const request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    Matcher = require('did-you-mean');
let abilities;

request('https://cdn.rawgit.com/Zarel/Pokemon-Showdown/2d605975/data/abilities.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        abilities = requireFromUrl('https://cdn.rawgit.com/Zarel/Pokemon-Showdown/2d605975/data/abilities.js').BattleAbilities;
    } else {
        console.log('Error fetching Showdown abilities; Switching to local abilities...');
        abilities = require('../data/abilities.js').BattleAbilities;
    }
    match = new Matcher(Object.keys(abilities).join(' '));
});
request('https://cdn.rawgit.com/Zarel/Pokemon-Showdown/2d605975/data/aliases.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        aliases = requireFromUrl('https://cdn.rawgit.com/Zarel/Pokemon-Showdown/2d605975/data/aliases.js').BattleAliases;
    } else {
        console.log('Error fetching Showdown aliases; Switching to local aliases...');
        aliases = require('../data/aliases.js').BattleAliases;
    }
});

exports.action = (msg, args) => {
    let abilityName = args.toLowerCase();
    if (aliases[abilityName]) {
        abilityName = aliases[abilityName];
    }
    abilityName = abilityName.toLowerCase();
    for (var i = 0; i < Object.keys(abilities).length; i++) {
        if (abilities[Object.keys(abilities)[i]].name.toLowerCase() == abilityName) {
            var ability = abilities[Object.keys(abilities)[i]];
            break;
        }
    }
    if (ability) {
        var abilityDesc = ability.desc;
        if (!abilityDesc) {
            abilityDesc = ability.shortDesc;
        }
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(ability.name) + "**", {
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
    } else {
        let dym = match.get(args);
        let dymString;
        if (dym == null) {
            dymString = 'Check your spelling and try again.';
        } else {
            dymString = `Did you mean \`${dym}\`?`;
        }
        msg.channel.send("⚠ Ability not found! " + dymString);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}