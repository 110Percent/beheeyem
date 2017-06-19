const dex = require("../data/pokedex.js").BattlePokedex;
const dexEntries = require("../data/flavorText.json");
const abilities = require("../data/abilities.js").BattleAbilities;

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


exports.action = (msg, args) => {
    var poke = args.toLowerCase();
    if (poke.split(" ")[0] == "mega") {
        poke = poke.substring(poke.split(" ")[0].length + 1) + "mega";
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
        poke = pokeEntry.species;
        var evoLine = "**" + capitalizeFirstLetter(poke) + "**";
        var preEvos = "";
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
        var imagefetch = pokeEntry.num;
        if (imagefetch < 100) {
            imagefetch = "0" + imagefetch;
        }
        if (imagefetch < 10) {
            imagefetch = "0" + imagefetch;
        }
        imagefetch = imagefetch + capitalizeFirstLetter(poke) + ".png";

        for (var i = 0; i < dexEntries.length; i++) {
            if (dexEntries[i].version_id == 25 && dexEntries[i].species_id == pokeEntry.num && dexEntries[i].language_id == 9) {
                var pokedexEntry = "*" + dexEntries[i].flavor_text + "*";
                break;
            }
        }
        if (!pokedexEntry) {
            var pokedexEntry = "*This Pokémon was not featured in Pokémon Omega Ruby.*";
        }

        var dexEmbed = {
            color: embedColours[pokeEntry.color],
            fields: [{
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
                    value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(poke).replace(" ", "_") + "_(Pokémon\\))  |  [Smogon](http://www.smogon.com/dex/sm/pokemon/" + poke.replace(" ", "_") + ")  |  [PokémonDB](http://pokemondb.net/pokedex/" + poke.replace(" ", "-") + ")"
                }
            ],
            thumbnail: {

                url: "http://smogon.com/dex/media/sprites/xy/" + poke.toLowerCase().replace(" ", "_") + ".gif"
                    //url: "https://raw.githubusercontent.com/fanzeyi/Pokemon-DB/master/thm/" + imagefetch
            },
            footer: {
                text: "#" + pokeEntry.num,
                icon_url: "https://cdn.rawgit.com/msikma/pokesprite/master/icons/pokemon/regular/" + poke.replace(" ", "_").toLowerCase() + ".png"
            }
        };

        msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(poke) + "**", {
            embed: dexEmbed
        });
    } else {
        msg.channel.sendMessage("⚠ Dex entry not found! Maybe you misspelt the Pokémon's name?");
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}