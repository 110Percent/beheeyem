const abilities = require("../data/abilities.js").BattleAbilities;

exports.action = (msg, args) => {
    for (var i = 0; i < Object.keys(abilities).length; i++) {
        if (abilities[Object.keys(abilities)[i]].name.toLowerCase() == args.toLowerCase()) {
            var ability = abilities[Object.keys(abilities)[i]];
            break;
        }
    }
    var abilityDesc = ability.desc;
    if (!abilityDesc) {
        abilityDesc = ability.shortDesc;
    }
    if (ability) {
        msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(ability.name) + "**", {
            embed: {
                color: 35071,
                fields: [{
                        name: "Description",
                        value: abilityDesc
                    },
                    {
                        name: "Rating (-2 to 5)",
                        value: String(ability.rating)
                    },
                    {
                        name: "External Resources",
                        value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(ability.name.replace(" ", "_")) + "_(Ability\\))  |  [Smogon](http://www.smogon.com/dex/sm/abilities/" + ability.name.toLowerCase().replace(" ", "_") + ")  |  [PokémonDB](http://pokemondb.net/ability/" + ability.name.toLowerCase().replace(" ", "-") + ")"
                    }
                ]
            }
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}