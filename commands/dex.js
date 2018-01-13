const request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    dexEntries = require("../data/flavorText.json"),
    abilities = require("../data/abilities.js").BattleAbilities,
    Matcher = require('did-you-mean'),
    url = require('url'),
    http = require('https'),
    sizeOf = require('image-size'),
    footers = require('../data/footers.js'),
    minimist = require('minimist'),
    locales = require('../data/locales.js'),
    otherAliases = require('../data/otherAliases.js');
let dex,
    aliases,
    match,
    tFooter,
    mm,
    mainArgs,
    locale;

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

request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/pokedex.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        dex = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/pokedex.js').BattlePokedex;
    } else {
        console.log('Error fetching Showdown dex; Switching to local dex...');
        dex = require('../data/pokedex.js').BattlePokedex;
    }
    match = new Matcher(Object.keys(dex).join(' '));
});
request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        aliases = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js').BattleAliases;
    } else {
        console.log('Error fetching Showdown aliases; Switching to local aliases...');
        aliases = require('../data/aliases.js').BattleAliases;
    }
});
exports.action = (msg, args) => {
    mm = minimist(args.split(' '));
    mainArgs = mm._.join(' ');
    locale = mm.lang && locales[mm.lang] ? locales[mm.lang] : locales.en;
    var poke = mainArgs.toLowerCase();

    if (aliases[poke]) {
        poke = aliases[poke];
    }
    poke = poke.toLowerCase();
    if (poke.split(" ")[0] == "mega") {
        poke = poke.substring(poke.split(" ")[0].length + 1) + "mega";
    } else if (poke.split(' ')[0] == "alolan") {
        poke = poke.substring(poke.split(" ")[0].length + 1) + "alola";
    }
    var pokeEntry = dex[poke];
    if (!pokeEntry) {
        for (var i = 0; i < Object.keys(dex).length; i++) {
            if (dex[Object.keys(dex)[i]].num == Number(poke)) {
                poke = dex[Object.keys(dex)[i]].species.toLowerCase();
                pokeEntry = dex[poke];
                break;
            }
        }
    }
    if (!pokeEntry) {
        for (var i = 0; i < Object.keys(dex).length; i++) {
            if (dex[Object.keys(dex)[i]].species.toLowerCase() == poke) {
                pokeEntry = dex[Object.keys(dex)[i]];
                break;
            }
        }
    }
    if (pokeEntry) {
        let imgDimensions = {};

        poke = pokeEntry.species;
        var evoLine = "**" + capitalizeFirstLetter(poke) + "**",
            preEvos = "";
        if (pokeEntry.prevo) {
            preEvos = preEvos + capitalizeFirstLetter(pokeEntry.prevo) + " > ";
            var preEntry = dex[pokeEntry.prevo];
            if (preEntry.prevo) {
                preEvos = capitalizeFirstLetter(preEntry.prevo) + " > " + preEvos;
            }
            evoLine = preEvos + evoLine;
        }
        var evos = ""
        if (pokeEntry.evos) {
            evos = evos + " > " + pokeEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
            if (pokeEntry.evos.length < 2) {
                var evoEntry = dex[pokeEntry.evos[0]];
                if (evoEntry.evos) {
                    evos = evos + " > " + evoEntry.evos.map(entry => capitalizeFirstLetter(entry)).join(", ");
                }
            }
            evoLine = evoLine + evos;
        }
        if (!pokeEntry.prevo && !pokeEntry.evos) {
            evoLine = evoLine + " (No Evolutions)";
        }
        var typestring = "Type";
        if (pokeEntry.types.length > 1) {
            typestring += "s";
        }
        var abilityString = pokeEntry.abilities[0];
        for (var i = 1; i < Object.keys(pokeEntry.abilities).length; i++) {
            if (Object.keys(pokeEntry.abilities)[i] == 'H') {
                abilityString = abilityString + ", *" + pokeEntry.abilities['H'] + "*";
            } else {
                abilityString = abilityString + ", " + pokeEntry.abilities[i];
            }
        }

        if (abilityString == '' || abilityString == undefined) abilityString = 'None';
        var imagefetch = pokeEntry.num;
        if (imagefetch < 100) {
            imagefetch = "0" + imagefetch;
        }
        if (imagefetch < 10) {
            imagefetch = "0" + imagefetch;
        }
        imagefetch = imagefetch + capitalizeFirstLetter(poke) + ".png";

        let imgPoke = poke.toLowerCase(),
            a = otherAliases.aliases(msg.guild.id);
        for (let r in a) {
            let sp = imgPoke.split(' ')
            for (let i = 0; i < sp.length; i++) {
                if (sp[i] == r) {
                    sp[i] = a[r];
                }
            }
            imgPoke = sp.join(' ');
        }

        let imageURL = 'https://github.com/110Percent/beheeyem-data/raw/master/webp/' + imgPoke.replace(" ", "_") + ".webp";

        var pokedexEntry = dexEntries[pokeEntry.num] ? dexEntries[pokeEntry.num].filter((c) => { return c.langID == locale.id })[0].flavourText : 'No data found.';
        if (!pokedexEntry) {
            var pokedexEntry = "*An unknown error occurred.*";
        }
        tFooter = Math.floor(Math.random() * 15) == 0 ? {
            text: footers[Math.floor(Math.random() * footers.length)],
            icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
        } : {
            text: "#" + pokeEntry.num,
            icon_url: "https://cdn.rawgit.com/msikma/pokesprite/master/icons/pokemon/regular/" + poke.replace(" ", "_").toLowerCase() + ".png"
        };
        let totalStats = 0;
        for (let i in pokeEntry.baseStats) {
            totalStats += pokeEntry.baseStats[i];
        }
        var dexEmbed = {
            color: embedColours[pokeEntry.color],
            fields: [{
                    name: typestring,
                    value: pokeEntry.types.join(", "),
                    inline: true
                },
                {
                    name: locale.abilities,
                    value: abilityString,
                    inline: true
                },
                {
                    name: locale.evoLine,
                    value: evoLine,
                    inline: false
                },
                {
                    name: locale.bases,
                    value: Object.keys(pokeEntry.baseStats).map(i => i.toUpperCase() + ": **" + pokeEntry.baseStats[i] + "**").join(", ") + `, TOTAL: **${totalStats}**`
                },
                {
                    name: locale.height,
                    value: pokeEntry.heightm + "m",
                    inline: true
                },
                {
                    name: locale.weight,
                    value: pokeEntry.weightkg + "kg",
                    inline: true
                },
                {
                    name: locale.eggs,
                    value: pokeEntry.eggGroups.join(", ")
                },
                {
                    name: locale.dex,
                    value: pokedexEntry
                },
                {
                    name: locale.resources,
                    value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(poke).replace(" ", "_") + "_(Pokémon\\))  |  [Smogon](http://www.smogon.com/dex/sm/pokemon/" + poke.replace(" ", "_") + ")  |  [PokémonDB](http://pokemondb.net/pokedex/" + poke.replace(" ", "-") + ")"
                }
            ],
            image: {
                url: imageURL,

                width: 80
            },
            footer: tFooter
        };
        console.log(imageURL);
        console.log(`Sending ${poke} dex to guild ${msg.guild.name}`);
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(poke) + "**", {
                embed: dexEmbed
            })
            .catch(console.error);
    } else {
        let dym = match.get(mainArgs);
        let dymString;
        if (dym == null) {
            dymString = 'Maybe you misspelt the Pokémon\'s name?';
        } else {
            dymString = `Did you mean \`${dym}\`?`;
        }
        msg.channel.send("⚠ Dex entry not found! " + dymString);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}