const request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    Matcher = require('did-you-mean'),
    footers = require('../data/footers.js');
let items,
    aliases,
    tFooter,
    match;


request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/items.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        items = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/items.js').BattleItems;
    } else {
        console.log('Error fetching Showdown items; Switching to local items...');
        items = require('../data/pokedex.js').BattleItems;
    }
    match = new Matcher(Object.keys(items).join(' '));
});
request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        aliases = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/aliases.js').BattleAliases;
    } else {
        console.log('Error fetching Showdown aliases; Switching to local aliases...');
        aliases = require('../data/aliases.js').BattleAliases;
    }
});

module.exports = {
    name: 'item',
    usage: ['item <name>'],
    example: ['item soothe bell'],
    shortDesc: 'Shows information on an item.',
    longDesc: 'Shows information about an item, including the description, the ID and which generation the item was introduced in.'
};

module.exports.action = (msg, args) => {
    var itemName = args.toLowerCase();
    if (aliases[itemName]) {
        itemName = aliases[itemName];
    }
    itemName = itemName.toLowerCase();
    let item;
    for (var i = 0; i < Object.keys(items).length; i++) {
        if (items[Object.keys(items)[i]].id.toLowerCase() == itemName.replace(" ", "").replace("'", "")) {
            item = items[Object.keys(items)[i]];
            break;
        }
    }
    if (item) {
        tFooter = Math.floor(Math.random() * 15) === 0 ? {
            text: footers[Math.floor(Math.random() * footers.length)],
            icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
        } : {
            text: capitalizeFirstLetter(item.name),
            icon_url: "https://raw.githubusercontent.com/110Percent/beheeyem-data/master/sprites/items/" + item.name.toLowerCase().replace(" ", "-") + ".png"
        };
        console.log(`Sending item ${item.name} to guild ${msg.guild.name}`);
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(item.name) + "**", {
            embed: {
                color: 35071,
                fields: [{
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
                        value: "[Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/" + capitalizeFirstLetter(item.name.replace(" ", "_").replace("'", "")) + ")  |  [Smogon](http://www.smogon.com/dex/sm/items/" + item.name.toLowerCase().replace(" ", "_").replace("'", "") + ")  |  [PokémonDB](http://pokemondb.net/item/" + item.name.toLowerCase().replace(" ", "-").replace("'", "") + ")"
                    }
                ],
                footer: tFooter
            }
        });
    } else {
        let dym = match.get(args);
        let dymString;
        if (dym === null) {
            dymString = 'Check your spelling and try again.';
        } else {
            dymString = `Did you mean \`${dym}\`?`;
        }
        msg.channel.send("⚠ Item not found! " + dymString);
    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}