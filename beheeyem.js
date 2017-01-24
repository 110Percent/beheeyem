const Discord = require("discord.js");
const beheeyem = new Discord.Client();
const fs = require("fs");
const jsonfile = require("jsonfile");
const mw = require("nodemw");
const path = require("path");
const csvjson = require("csvjson");
const wtfWikipedia = require("wtf_wikipedia");

const dex = require("./data/pokedex.js").BattlePokedex;
const abilities = require("./data/abilities.js").BattleAbilities;
const items = require("./data/items.js").BattleItems;
const moves = require("./data/moves.js").BattleMovedex;
const typeMatchups = require("./data/typechart.js").BattleTypeChart;

var client = new mw({
  server: 'bulbapedia.bulbagarden.net',
  path: '/w',
  debug: false
});

var versionNames = ["",
"Red",
"Blue",
"Yellow",
"Gold",
"Silver",
"Crystal",
"Ruby",
"Sapphire",
"Emerald",
"FireRed",
"LeafGreen",
"Diamond",
"Pearl",
"Platinum",
"HeartGold",
"SoulSilver",
"Black",
"White",
"Colosseum",
"XD",
"Black 2",
"White 2",
"X",
"Y",
"Omega Ruby",
"Alpha Sapphire"];

var availabilityObject = {
    gen1: {
        redBlue: [],
        yellow: []
    },
    gen2: {
        goldSilver: [],
        crystal: []
    },
    gen3: {
        rubySapphire: [],
        emerald: [],
        fireRedLeafGreen: [],
        colosseum: [],
        xd: []
    },
    gen4: {
        diamondPearl: [],
        platinum: [],
        heartGoldSoulSilver: [],
        palPark: [],
        pokewalker: []
    },
    gen5: {
        blackWhite: [],
        black2White2: [],
        dreamWorld: []
    },
    gen6: {
        XY: [],
        omegaRubyAlphaSapphire: []
    },
    gen7: {
        sunMoon: []
    }
};

var dexEntries = require("./data/flavorText.json");
var locationAreas = require("./data/locationAreas.json");
var locationNames = require("./data/locationNames.json");
var encounters = require("./data/encounters.json");

var imageCheck;
var msgEdits = require("./data/edits.json");

var embedColours = {
    Red: 16724530,
    Blue: 2456831,
    Yellow: 16773977,
    Green: 4128590,
    Black: 3289650,
    Brown: 10702874,
    Purple: 10894824,
    Gray: 9868950,
    White: 14803425,
    Pink: 16737701
};

console.log("Starting Beheeyem...");

beheeyem.on("ready",function(){
    console.log("Beheeyem is active! Currently serving in " + beheeyem.guilds.size + " guilds.\n");
    beheeyem.user.setGame("b.help");
});

beheeyem.on("message", msg => {
    if (msg.author.id != beheeyem.user.id && !msg.author.bot){
        if (msg.content.startsWith("b.")){
            var commandstring = msg.content.substring(2);
            var cmd = commandstring.split(" ")[0];
            var args = commandstring.substring(cmd.length + 1);

            if (cmd == "help"){
                msg.channel.sendMessage("",{
                    embed: {
                        color: 35071,
                        fields: [
                            {
                                name: "b.help",
                                value: "Displays a list of helpful commands.",
                                inline: true
                            },
                            {
                                name: "b.invite",
                                value: "Shows an invite link for Beheeyem to join servers. Also shows a link for the /r/Pokemon Discord.",
                                inline: true
                            },
                            {
                                name: "b.dex",
                                value: "`b.dex beheeyem`\n`b.dex 606`\nShows information about a Pokémon.",
                                inline: true
                            },
                            {
                                name: "b.ability",
                                value: "`b.ability static`\nShows information about an ability.",
                                inline: true
                            },
                            {
                                name: "b.item",
                                value: "`b.item soothe bell`\nShows information about an item.",
                                inline: true
                            },
                            {
                                name: "b.move",
                                value: "`b.move quick attack`\nShows information about a move.",
                                inline: true
                            },
                            {
                                name: "b.type",
                                value: "`b.type psychic`\nShows the damage modifiers between a set of types and others. Multiple types can be inputted.",
                                inline: true
                            },
                            {
                                name: "b.edit",
                                value: "Checks the most recently edited message in the current channel.",
                                inline: true
                            }
                        ]
                    }
                })
            }
            else if (cmd == "invite"){
                msg.channel.sendMessage("Want to invite me to your server? Use the link below!\n\nhttps://discordapp.com/oauth2/authorize?client_id=246647016111865856&scope=bot&permissions=67488832\n\nWant to join the /r/Pokemon Discord? Check out this link!\nhttps://discord.gg/pokemon\n\nThank you for using Beheeyem! ❤");
            }
            else if (cmd == "dex"){
                var poke = args.toLowerCase();
                if (poke.split(" ")[0] == "mega"){
                    poke = poke.substring(poke.split(" ")[0].length + 1) + "mega";
                }
                var pokeEntry = dex[poke];
                if (!pokeEntry){
                    for (var i = 0; i < Object.keys(dex).length; i++){
                        if (dex[Object.keys(dex)[i]].num == Number(poke)){
                            poke = dex[Object.keys(dex)[i]].species.toLowerCase();
                            pokeEntry = dex[poke];
                            break;
                        }
                    }
                }
                if (!pokeEntry){
                    for (var i = 0; i < Object.keys(dex).length; i++){
                        console.log(i);
                        if (dex[Object.keys(dex)[i]].species.toLowerCase() == poke){
                            pokeEntry = dex[Object.keys(dex)[i]];
                            break;
                        }
                    }
                }
                if (pokeEntry){
                    poke = pokeEntry.species;
                    var evoLine = "**" + capitalizeFirstLetter(poke) + "**";
                    var preEvos = "";
                    if (pokeEntry.prevo){
                        preEvos = preEvos + capitalizeFirstLetter(pokeEntry.prevo) + " > ";
                        var preEntry = dex[pokeEntry.prevo];
                        if (preEntry.prevo){
                            preEvos = capitalizeFirstLetter(preEntry.prevo) + " > " + preEvos;
                        }
                        evoLine = preEvos + evoLine;
                    }
                    var evos = ""
                    if (pokeEntry.evos){
                        evos = evos + " > " + pokeEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
                        if (pokeEntry.evos.length < 2){
                            var evoEntry = dex[pokeEntry.evos[0]];
                            if (evoEntry.evos){
                                evos = evos + " > " + evoEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
                            }
                        }
                        evoLine = evoLine + evos;
                    }
                    if (!pokeEntry.prevo && !pokeEntry.evos){
                        evoLine = evoLine + " (No Evolutions)";
                    }
                    var typestring = "Type";
                    if (pokeEntry.types.length > 1){
                        typestring += "s";
                    }
                    var abilityString = pokeEntry.abilities[0];
                    for (var i = 1; i < Object.keys(pokeEntry.abilities).length; i++){
                        if (Object.keys(pokeEntry.abilities)[i] == 'H'){
                            abilityString = abilityString + ", *" + pokeEntry.abilities['H'] + "*";
                        }
                        else {
                            abilityString = abilityString + ", " + pokeEntry.abilities[i];
                        }
                    }
                    var imagefetch = pokeEntry.num;
                    if (imagefetch < 100){
                        imagefetch = "0" + imagefetch;
                    }
                    if (imagefetch < 10){
                        imagefetch = "0" + imagefetch;
                    }
                    imagefetch = imagefetch + capitalizeFirstLetter(poke) + ".png";

                    for (var i = 0; i < dexEntries.length; i++){
                        if (dexEntries[i].version_id == 25 && dexEntries[i].species_id == pokeEntry.num && dexEntries[i].language_id == 9){
                            var pokedexEntry = "*" + dexEntries[i].flavor_text + "*";
                            break;
                        }
                    }
                    if (!pokedexEntry){
                        var pokedexEntry = "*This Pokémon was not featured in Pokémon Omega Ruby.*";
                    }

                    var dexEmbed = {
                        color: embedColours[pokeEntry.color],
                        fields: [
                            {
                                name: typestring,
                                value: pokeEntry.types.join(", "),
                                inline: true
                            },
                            {
                                name: "Abilities",
                                value: abilityString,
                                inline: true
                            },
                            {
                                name: "Evolutionary Line",
                                value: evoLine,
                                inline: false
                            },
                            {
                                name: "Base Stats",
                                value: Object.keys(pokeEntry.baseStats).map(i => i.toUpperCase() + ": **" + pokeEntry.baseStats[i] + "**").join(", ")
                            },
                            {
                                name: "Height",
                                value: pokeEntry.heightm + "m",
                                inline: true
                            },
                            {
                                name: "Weight",
                                value: pokeEntry.weightkg + "kg",
                                inline: true
                            },
                            {
                                name: "Egg Groups",
                                value: pokeEntry.eggGroups.join(", ")
                            },
                            {
                                name: "Dex Entry (OR)",
                                value: pokedexEntry
                            },
                            {
                                name: "External Resources",
                                value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(poke).replace(" ","_") + "_(Pokémon\\))  |  [Smogon](http://www.smogon.com/dex/sm/pokemon/" + poke.replace(" ","_") + ")  |  [PokémonDB](http://pokemondb.net/pokedex/" + poke.replace(" ","-") + ")"
                            }
                        ],
                        thumbnail: {

                            url: "http://smogon.com/dex/media/sprites/xy/" + poke.toLowerCase().replace(" ","_") + ".gif"
                            //url: "https://raw.githubusercontent.com/fanzeyi/Pokemon-DB/master/thm/" + imagefetch
                        },
                        footer: {
                            text: "#" + pokeEntry.num,

                            icon_url: "https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular/" + poke.replace(" ","_") + ".png"
                        }
                    };
                    console.log(dexEmbed);

                    msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(poke) + "**",{
                        embed: dexEmbed
                    });
                }
                else {
                    msg.channel.sendMessage("⚠ Dex entry not found! Maybe you misspelt the Pokémon's name?");
                }
            }
            else if (cmd == "ability"){
                for (var i = 0; i < Object.keys(abilities).length; i++){
                    if (abilities[Object.keys(abilities)[i]].name.toLowerCase() == args.toLowerCase()){
                        var ability = abilities[Object.keys(abilities)[i]];
                        break;
                    }
                }
                var abilityDesc = ability.desc;
                if (!abilityDesc){
                    abilityDesc = ability.shortDesc;
                }
                if (ability){
                    msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(ability.name) + "**",{
                        embed: {
                            color: 35071,
                            fields: [
                                {
                                    name: "Description",
                                    value: abilityDesc
                                },
                                {
                                    name: "Rating (-2 to 5)",
                                    value: String(ability.rating)
                                },
                                {
                                    name: "External Resources",
                                    value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(ability.name.replace(" ","_")) + "_(Ability\\))  |  [Smogon](http://www.smogon.com/dex/sm/abilities/" + ability.name.toLowerCase().replace(" ","_") + ")  |  [PokémonDB](http://pokemondb.net/ability/" + ability.name.toLowerCase().replace(" ","-") + ")"
                                }
                            ]
                        }
                    });
                }
            }
            else if (cmd == "item"){
                for (var i = 0; i < Object.keys(items).length; i++){
                    if (items[Object.keys(items)[i]].id.toLowerCase() == args.toLowerCase().replace(" ","").replace("'","")){
                        var item = items[Object.keys(items)[i]];
                        break;
                    }
                }
                if (item){
                    msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(item.name) + "**",{
                        embed: {
                            color: 35071,
                            fields: [
                                {
                                    name: "Description",
                                    value: item.desc
                                },
                                {
                                    name: "Generation Introduced",
                                    value: item.gen,
                                    inline: true
                                },
                                {
                                    name: "Item ID",
                                    value: item.num,
                                    inline: true
                                },
                                {
                                    name: "External Resources",
                                    value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(item.name.replace(" ","_").replace("'","")) + ")  |  [Smogon](http://www.smogon.com/dex/sm/items/" + item.name.toLowerCase().replace(" ","_").replace("'","") + ")  |  [PokémonDB](http://pokemondb.net/item/" + item.name.toLowerCase().replace(" ","-").replace("'","") + ")"
                                }
                            ],
                            footer: {
                                icon_url: "https://raw.githubusercontent.com/110Percent/beheeyem/master/data/sprites/items/" + item.name.toLowerCase().replace(" ","-") + ".png"
                            }
                        }
                    });
                    console.log("https://raw.githubusercontent.com/110Percent/beheeyem/master/data/sprites/items/" + item.name.toLowerCase().replace(" ","-").replace("'","") + ".png");
                }
            }
            else if (cmd == "obtain"){
                msg.channel.sendMessage("Honestly, just use Bulbapedia. The encounter data on the web is so inconsistent and undreadable that there's no way I could create an obtainability command. Sorry about that. 🙁");
            }
            else if (cmd == "move"){
                var moveName = args.toLowerCase();
                var move = moves[moveName];
                if (!move){
                    for (var i = 0; i < Object.keys(moves).length; i++){
                        if (moves[Object.keys(moves)[i]].num == moveName){
                            move = moves[Object.keys(moves)[i]];
                            break;
                        }
                    }
                }
                if (!move){
                    for (var i = 0; i < Object.keys(moves).length; i++){
                        if (moves[Object.keys(moves)[i]].name.toLowerCase() == moveName){
                            move = moves[Object.keys(moves)[i]];
                            break;
                        }
                    }
                }
                if (move){
                    moveName = move.name;
                    var descString;
                    if (move.desc){
                        descString = move.desc;
                    }
                    else {
                        descString = move.shortDesc;
                    }
                    var accuracyString;
                    if (move.accuracy == true){
                        accuracyString = "Certain Success";
                    }
                    else {
                        accuracyString = move.accuracy;
                    }
                    var viableString;
                    if (move.isViable){
                        viableString = "Yes";
                    }
                    else {
                        viableString = "No";
                    }
                    var targetString;
                    if (move.target == "normal"){
                        targetString = "One Enemy";
                    }
                    else {
                        targetString = capitalizeFirstLetter(move.target.replace(/([A-Z])/g, ' $1'));
                    }
                    var crystalString;
                    if (move.isZ){
                        crystalString = capitalizeFirstLetter(move.isZ.substring(0,move.isZ.length - 1)) + " Z";
                    }
                    else {
                        crystalString = "None";
                    }
                    var embedObject = {
                        color: 35071,
                        fields: [
                            {
                                name: "Description",
                                value: descString
                            },
                            {
                                name: "Type",
                                value: move.type,
                                inline: true
                            },
                            {
                                name: "Base Power",
                                value: move.basePower,
                                inline: true
                            },
                            {
                                name: "PP",
                                value: move.pp,
                                inline: true
                            },
                            {
                                name: "Category",
                                value: move.category,
                                inline: true
                            },
                            {
                                name: "Accuracy",
                                value: accuracyString,
                                inline: true
                            },
                            {
                                name: "Viable?",
                                value: viableString,
                                inline: true
                            },
                            {
                                name: "Priority",
                                value: move.priority,
                                inline: true
                            },
                            {
                                name: "Target",
                                value: targetString,
                                inline: true
                            },
                            {
                                name: "Z-Crystal",
                                value: crystalString,
                                inline: true
                            }
                        ],
                        footer: {
                            text: "#" + move.num
                        }
                    };
                    msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(move.name) + "**",{embed:embedObject});
                    console.log(embedObject);
                }
            }
            else if (cmd == "mods"){
                //msg.channel.sendMessage(msg.guild.roles.map(c => c.name + "\t" + c.id + "\n"));
                var modsRoleid = 175810054987972608;
                try {
                    var mods = beheeyem.guilds.get("111504456838819840").roles.get("264780359332265985").members.map(c => c.user);
                }
                catch (err){
                    if (!err){
                        var modsObject = {
                            online: [],
                            away: [],
                            dnd: []
                        };
                        for (var i = 0; i < Object.keys(mods).length; i++){
                            var modUser = mods[i];
                            if (modUser.presence.status == "online"){
                                modsObject.online.push(modUser.id);
                            }
                            else if (modUser.presence.status == "idle"){
                                modsObject.away.push(modUser.id);
                            }
                            else if (modUser.presence.status == "dnd"){
                                modsObject.dnd.push(modUser.id);
                            }
                        }
                        var embedObject = {
                            color: 35071,
                            fields: []
                        };
                        if (modsObject.online.length > 0){
                            embedObject.fields.push({
                                name: "Online",
                                value: modsObject.online.map(c => msg.guild.members.get(c).user.username + "#" + msg.guild.members.get(c).user.discriminator).join("\n")
                            });
                        }
                        if (modsObject.away.length > 0){
                            embedObject.fields.push({
                                name: "Away",
                                value: modsObject.away.map(c => msg.guild.members.get(c).user.username + "#" + msg.guild.members.get(c).user.discriminator).join("\n")
                            });
                        }
                        if (modsObject.dnd.length > 0){
                            embedObject.fields.push({
                                name: "Do Not Disturb",
                                value: modsObject.dnd.map(c => msg.guild.members.get(c).user.username + "#" + msg.guild.members.get(c).user.discriminator).join("\n")
                            });
                        }
                        msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**Moderators**",{embed:embedObject});
                    }
                }
            }
            else if (cmd == "type"){
                var defMulti = {
                    "Bug": 1,
                    "Dark": 1,
                    "Dragon": 1,
                    "Electric": 1,
                    "Fairy": 1,
                    "Fighting": 1,
                    "Fire": 1,
                    "Flying": 1,
                    "Ghost": 1,
                    "Grass": 1,
                    "Ground": 1,
                    "Ice": 1,
                    "Normal": 1,
                    "Poison": 1,
                    "Psychic": 1,
                    "Rock": 1,
                    "Steel": 1,
                    "Water": 1
                };
                var atkMulti = {
                    "Bug": 1,
                    "Dark": 1,
                    "Dragon": 1,
                    "Electric": 1,
                    "Fairy": 1,
                    "Fighting": 1,
                    "Fire": 1,
                    "Flying": 1,
                    "Ghost": 1,
                    "Grass": 1,
                    "Ground": 1,
                    "Ice": 1,
                    "Normal": 1,
                    "Poison": 1,
                    "Psychic": 1,
                    "Rock": 1,
                    "Steel": 1,
                    "Water": 1
                };
                var vulnCheck = false;
                var normalCheck = false;
                var resistCheck = false;
                var noCheck = false;
                var vulnTypes = [];
                var normalTypes = [];
                var resistTypes = [];
                var noTypes = [];
                var vulnDisplay = [];
                var vulnRaw = [];
                var normalRaw = [];
                var resistRaw = [];
                var noRaw = [];
                var atkVulnCheck = false;
                var atkNormalCheck = false;
                var atkResistCheck = false;
                var atkNoCheck = false;
                var atkVulnTypes = [];
                var atkNormalTypes = [];
                var atkResistTypes = [];
                var atkNoTypes = [];
                var atkVulnRaw = [];
                var atkNormalRaw = [];
                var atkResistRaw = [];
                var atkNoRaw = [];
                var vulnDisplay = [];
                var atkVulnDisplay = [];
                var displayTypes = [];
                for (var z = 0; z < args.split(" ").length; z++){
                    var argsSplit = args.split(" ")[z];
                    if (Object.keys(typeMatchups).map(c => c.toLowerCase()).indexOf(argsSplit.toLowerCase()) != -1){
                        var toType = capitalizeFirstLetter(argsSplit);
                        displayTypes.push(toType);
                        var dTaken = typeMatchups[toType].damageTaken;
                        for (toMatch in dTaken){
                            if (defMulti[toMatch]){
                                if (dTaken[toMatch] == 1){
                                    defMulti[toMatch] *= 2;
                                }
                                else if (dTaken[toMatch] == 2){
                                    defMulti[toMatch] *= 0.5;
                                }
                                else if (dTaken[toMatch] == 3){
                                    defMulti[toMatch] = 0;
                                }
                            }
                        }
                        for (toMatch in typeMatchups){
                            if (atkMulti[toMatch]){
                                if (typeMatchups[toMatch].damageTaken[toType] == 1){
                                    atkMulti[toMatch] *= 2;
                                }
                                else if (typeMatchups[toMatch].damageTaken[toType] == 2){
                                    atkMulti[toMatch] *= 0.5;
                                }
                                else if (typeMatchups[toMatch].damageTaken[toType] == 3){
                                    atkMulti[toMatch] *= 0;
                                }
                            }
                        }
                        for (var i = 0; i < Object.keys(defMulti).length; i++){
                            if (defMulti[Object.keys(defMulti)[i]] > 1){
                                vulnCheck = true;
                                break;
                            }
                        }
                        for (var i = 0; i < Object.keys(defMulti).length; i++){
                            if (defMulti[Object.keys(defMulti)[i]] == 1){
                                normalCheck = true;
                                break;
                            }
                        }
                        for (var i = 0; i < Object.keys(defMulti).length; i++){
                            if (defMulti[Object.keys(defMulti)[i]] > 0 && defMulti[Object.keys(defMulti)[i]] < 1){
                                resistCheck = true;
                                break;
                            }
                        }
                        for (var i = 0; i < Object.keys(defMulti).length; i++){
                            if (defMulti[Object.keys(defMulti)[i]] == 0){
                                noCheck = true;
                                break;
                            }
                        }
                        for (var i = 0; i < Object.keys(atkMulti).length; i++){
                            if (atkMulti[Object.keys(atkMulti)[i]] > 1){
                                atkVulnCheck = true;
                                break;
                            }
                        }
                        for (var i = 0; i < Object.keys(atkMulti).length; i++){
                            if (atkMulti[Object.keys(atkMulti)[i]] == 1){
                                atkNormalCheck = true;
                                break;
                            }
                        }
                        for (var i = 0; i < Object.keys(atkMulti).length; i++){
                            if (atkMulti[Object.keys(atkMulti)[i]] > 0 && atkMulti[Object.keys(atkMulti)[i]] < 1){
                                atkResistCheck = true;
                                break;
                            }
                        }
                        for (var i = 0; i < Object.keys(atkMulti).length; i++){
                            if (atkMulti[Object.keys(atkMulti)[i]] == 0){
                                atkNoCheck = true;
                                break;
                            }
                        }
                    }

                }
                if (vulnCheck){
                    for (var i = 0; i < Object.keys(defMulti).length; i++){
                        if (defMulti[Object.keys(defMulti)[i]] > 1 && vulnRaw.indexOf(Object.keys(defMulti)[i]) == -1){
                            vulnTypes.push(Object.keys(defMulti)[i] + " (x" + defMulti[Object.keys(defMulti)[i]] + ")");
                            vulnRaw.push(Object.keys(defMulti)[i]);
                        }
                    }
                    vulnDisplay[0] = "Vulnerable to: " + vulnTypes.join(", ");
                }
                if (normalCheck){
                    for (var i = 0; i < Object.keys(defMulti).length; i++){
                        if (defMulti[Object.keys(defMulti)[i]] == 1 && normalRaw.indexOf(Object.keys(defMulti)[i]) == -1){
                            normalTypes.push(Object.keys(defMulti)[i]);
                            normalRaw.push(Object.keys(defMulti)[i]);
                        }
                    }
                    vulnDisplay[1] = "Takes normal damage from: " + normalTypes.join(", ");
                }
                if (resistCheck){
                    for (var i = 0; i < Object.keys(defMulti).length; i++){
                        if (defMulti[Object.keys(defMulti)[i]] > 0 && defMulti[Object.keys(defMulti)[i]] < 1 && resistRaw.indexOf(Object.keys(defMulti)[i]) == -1){
                            resistTypes.push(Object.keys(defMulti)[i] + " (x" + defMulti[Object.keys(defMulti)[i]] + ")");
                            resistRaw.push(Object.keys(defMulti)[i]);
                        }
                    }
                    vulnDisplay[2] = "Resists: " + resistTypes.join(", ");
                }
                if (noCheck){
                    for (var i = 0; i < Object.keys(defMulti).length; i++){
                        if (defMulti[Object.keys(defMulti)[i]] == 0 && noRaw.indexOf(Object.keys(defMulti)[i]) == -1){
                            noTypes.push(Object.keys(defMulti)[i]);
                            noRaw.push(Object.keys(defMulti)[i]);
                        }
                    }
                    vulnDisplay[3] = "Not affected by: " + noTypes.join(", ");
                }

                if (atkVulnCheck){
                    for (var i = 0; i < Object.keys(atkMulti).length; i++){
                        if (atkMulti[Object.keys(atkMulti)[i]] > 1 && atkVulnRaw.indexOf(Object.keys(atkMulti)[i]) == -1){
                            atkVulnTypes.push(Object.keys(atkMulti)[i] + " (x" + atkMulti[Object.keys(atkMulti)[i]] + ")");
                            atkVulnRaw.push(Object.keys(atkMulti)[i]);
                        }
                    }
                    atkVulnDisplay[0] = "Supereffective against: " + atkVulnTypes.join(", ");
                }
                if (atkNormalCheck){
                    for (var i = 0; i < Object.keys(atkMulti).length; i++){
                        if (atkMulti[Object.keys(atkMulti)[i]] == 1 && atkNormalRaw.indexOf(Object.keys(atkMulti)[i]) == -1){
                            atkNormalTypes.push(Object.keys(atkMulti)[i]);
                            atkNormalRaw.push(Object.keys(atkMulti)[i]);
                        }
                    }
                    atkVulnDisplay[1] = "Deals normal damage to: " + atkNormalTypes.join(", ");
                }
                if (atkResistCheck){
                    for (var i = 0; i < Object.keys(atkMulti).length; i++){
                        if (atkMulti[Object.keys(atkMulti)[i]] > 0 && atkMulti[Object.keys(atkMulti)[i]] < 1 && atkResistRaw.indexOf(Object.keys(atkMulti)[i]) == -1){
                            atkResistTypes.push(Object.keys(atkMulti)[i] + " (x" + atkMulti[Object.keys(atkMulti)[i]] + ")");
                            atkResistRaw.push(Object.keys(atkMulti)[i]);
                        }
                    }
                    atkVulnDisplay[2] = "Not very effective against: " + atkResistTypes.join(", ");
                }
                if (atkNoCheck){
                    for (var i = 0; i < Object.keys(atkMulti).length; i++){
                        if (atkMulti[Object.keys(atkMulti)[i]] == 0 && atkNoRaw.indexOf(Object.keys(atkMulti)[i]) == -1){
                            atkNoTypes.push(Object.keys(atkMulti)[i]);
                            atkNoRaw.push(Object.keys(atkMulti)[i]);
                        }
                    }
                    atkVulnDisplay[3] = "Doesn't affect: " + atkNoTypes.join(", ");
                }
                console.log(atkVulnRaw);
                msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + displayTypes.join(", ") + "**",{
                    embed: {
                        color: 35071,
                        fields: [
                            {
                                name: "Offense",
                                value: atkVulnDisplay.join("\n\n")
                            },
                            {
                                name: "Defense",
                                value: vulnDisplay.join("\n\n")
                            }
                        ]
                    }
                })
            }
            else if (cmd == "edit"){
                if (msgEdits[msg.channel.id]){
                    msg.channel.sendMessage("",{embed:{
                        fields: [
                            {
                                name: "Old Content",
                                value: msgEdits[msg.channel.id].oldMessage
                            },
                            {
                                name: "New Content",
                                value: msgEdits[msg.channel.id].newMessage
                            }
                        ],
                        author: {
                            name: msgEdits[msg.channel.id].authorName,
                            icon_url: msgEdits[msg.channel.id].iconUrl
                        },
                        timestamp: new Date(msgEdits[msg.channel.id].timestamp)

                    }});
                }
                else {
                    msg.channel.sendMessage("Sorry! No logged edits were found.");
                }
            }
            else if (cmd == "nonya"){
                var nonyas = require("./data/nonyas.json").nonyas;
                var selectedNonya = nonyas[Math.floor(Math.random() * nonyas.length)];
                msg.channel.sendFile(selectedNonya,"nonya." + selectedNonya.split(".")[selectedNonya.split(".").length - 1]);
            }
            else if (cmd == "deathbird"){
                msg.channel.sendFile("https://i.imgur.com/pIxQQXA.png","DEATHBIRD.png");
            }
            else if (cmd == "youtried"){
                msg.channel.sendFile("https://i.imgur.com/bAxMdQ0.png","Filename.jpeg.gif.webp.mp4.exe.bat.sh.app.png");
            }

            if (msg.author.id == 120887602395086848){
                if (cmd == "addnonya"){
                    var nonyas = require("./data/nonyas.json");
                    nonyas.nonyas.push(args);
                    jsonfile.writeFileSync("./data/nonyas.json",nonyas);
                    msg.channel.sendMessage("👌🏾 Sucessfully added Nonya!");
                }
            }
        }
        imageCheck = false;
        checkItalics(msg);
    }
});


beheeyem.login("MjQ2NjQ3MDE2MTExODY1ODU2.CwdreQ.lueJ2DTVCmdOoFMFHXtj1Xf7gfM");


beheeyem.on("messageUpdate", (oldMsg,newMsg) => {
    msgEdits = require("./data/edits.json");
    msgEdits[oldMsg.channel.id] = {
        oldMessage: oldMsg.cleanContent,
        newMessage: newMsg.cleanContent,
        timestamp: newMsg.editedTimestamp,
        authorName: oldMsg.author.username,
        iconUrl: oldMsg.author.avatarURL

    };
    jsonfile.writeFileSync("./data/edits.json",msgEdits);
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function checkItalics(msg){
    var isFound = false;
    var asteriskSplit = msg.content.split("*");
    for (var i = 1; i < asteriskSplit.length - 1; i++){
        var pokeName = asteriskSplit[i].toLowerCase();
        pokename = pokeName.replace(" ","-").split("-").map(capitalizeFirstLetter).join("-");
        try {
            msg.channel.sendFile("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif");
        }
        catch (err){
            if (!err){
                console.log(pokeName);
                isFound = true;
                break;
            }
        }
    }
    if (!isFound){
        var underSplit = msg.content.split("_");
        for (var i = 1; i < underSplit.length - 1; i++){
            var pokeName = underSplit[i].toLowerCase();
            pokename = pokeName.replace(" ","-").split("-").map(capitalizeFirstLetter).join("-");
            try {
                msg.channel.sendFile("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif");
            }
            catch (err){
                if (!err){
                    console.log(pokeName);
                    isFound = true;
                    break;
                }
            }
        }
    }
}
