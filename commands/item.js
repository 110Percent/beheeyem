const items = require("../data/items.js").BattleItems;

exports.action = (msg, args) => {
    var item;
    for (var i = 0; i < Object.keys(items).length; i++) {
        if (items[Object.keys(items)[i]].id.toLowerCase() == args.toLowerCase().replace(" ", "").replace("'", "")) {
            item = items[Object.keys(items)[i]];
            break;
        }
    }
    if (item) {
        msg.channel.sendMessage("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(item.name) + "**", {
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
                footer: {
                    text: capitalizeFirstLetter(item.name),
                    icon_url: "https://raw.githubusercontent.com/110Percent/beheeyem-data/master/sprites/items/" + item.name.toLowerCase().replace(" ", "-") + ".png"
                }
            }
        });
        console.log("https://raw.githubusercontent.com/110Percent/beheeyem-data/master/sprites/items/" + item.name.toLowerCase().replace(" ", "-").replace("'", "") + ".png");
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}