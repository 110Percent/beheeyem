const Discord = require("discord.js");
const beheeyem = new Discord.Client();
const fs = require("fs");
const dex = require("./data/pokedex.js").BattlePokedex;
const abilities = require("./data/abilities.js").BattleAbilities;
const items = require("./data/items.js").BattleItems;

var imageCheck;

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
    if (msg.author.id != beheeyem.user.id){
        if (msg.content.startsWith("b.")){
            var commandstring = msg.content.substring(2);
            var cmd = commandstring.split(" ")[0];
            var args = commandstring.substring(cmd.length + 1);

            if (cmd == "dex"){
                var poke = args.split(" ")[0].toLowerCase();
                var pokeEntry = dex[poke];
                if (!pokeEntry){
                    for (var i = 0; i < Object.keys(dex).length; i++){
                        console.log(i);
                        if (dex[Object.keys(dex)[i]].num == Number(poke)){
                            poke = dex[Object.keys(dex)[i]].species.toLowerCase();
                            pokeEntry = dex[poke];
                            break;
                        }
                    }
                }
                if (pokeEntry){
                    console.log(pokeEntry);
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
                    msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(poke) + "**",{
                        embed: {
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
                                    name: "External Resources",
                                    value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(poke) + "/)  |  [Smogon](http://www.smogon.com/dex/xy/pokemon/" + poke + ")  |  [PokémonDB](http://pokemondb.net/pokedex/" + poke + ")"
                                }
                            ],
                            thumbnail: {
                                url: "https://raw.githubusercontent.com/fanzeyi/Pokemon-DB/master/thm/" + imagefetch
                            },
                            footer: {
                                text: "#" + pokeEntry.num,
                                icon_url: "https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/regular/" + poke + ".png"
                            }
                        }
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
                if (ability){
                    msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(ability.name) + "**",{
                        embed: {
                            color: 35071,
                            fields: [
                                {
                                    name: "Description",
                                    value: ability.desc
                                },
                                {
                                    name: "Rating (-2 to 5)",
                                    value: String(ability.rating)
                                },
                                {
                                    name: "External Resources",
                                    value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(ability.name.replace(" ","_")) + "_(Ability\\))  |  [Smogon](http://www.smogon.com/dex/xy/abilities/" + ability.name.toLowerCase().replace(" ","_") + ")  |  [PokémonDB](http://pokemondb.net/ability/" + ability.name.toLowerCase().replace(" ","-") + ")"
                                }
                            ]
                        }
                    });
                }
            }
            else if (cmd == "item"){
                for (var i = 0; i < Object.keys(items).length; i++){
                    if (items[Object.keys(items)[i]].id.toLowerCase() == args.toLowerCase().replace(" ","")){
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
                                }
                            ]
                        }
                    });
                }
            }
        }
        imageCheck = false;
        checkItalics(msg);
    }
});


beheeyem.login(":^)");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkItalics(msg){
    var isFound = false;
    var asteriskSplit = msg.content.split("*");
    for (var i = 1; i < asteriskSplit.length - 1; i++){
        if (Object.keys(dex)[Object.keys(dex).indexOf(asteriskSplit[i].toLowerCase())]){
            var pokeName = Object.keys(dex)[Object.keys(dex).indexOf(asteriskSplit[i].toLowerCase())];
            console.log("Retrieving image for " + capitalizeFirstLetter(pokeName) + "...")
            if (fs.existsSync("./data/pokegifs/" + pokeName + ".gif")){
                msg.channel.sendFile("./data/pokegifs/" + pokeName + ".gif");
                console.log("Sent image!\n");
            }
            else {
                console.log("Could not find image.\n");
            }
            isFound = true;
            break;
        }
    }
    if (!isFound){
        var underSplit = msg.content.split("_");
        for (var i = 1; i < underSplit.length - 1; i++){
            if (Object.keys(dex)[Object.keys(dex).indexOf(underSplit[i].toLowerCase())]){
                var pokeName = Object.keys(dex)[Object.keys(dex).indexOf(underSplit[i].toLowerCase())];
                console.log("Retrieving image for " + capitalizeFirstLetter(pokeName) + "...")
                if (fs.existsSync("./data/pokegifs/" + pokeName + ".gif")){
                    msg.channel.sendFile("./data/pokegifs/" + pokeName + ".gif");
                    console.log("Sent image!\n");
                }
                else {
                    console.log("Could not find image.\n");
                }
                break;
            }
        }
    }
}
