const footers = require('../data/footers.js');
let tFooter;

exports.action = (msg, args) => {
    tFooter = Math.floor(Math.random() * 15) == 0 ? {
        text: footers[Math.floor(Math.random() * footers.length)],
        icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
    } : null;
    msg.channel.send("", {
        embed: {
            color: 35071,
            fields: [{
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
                    value: "`b.type psychic`\nShows the damage modifiers for a set\nof types. Multiple types can be entered.",
                    inline: true
                },
                {
                    name: 'b.convert',
                    value: '`b.convert 5 km to mi`\nConvert a value between two units.',
                    inline: true
                },
                {
                    name: 'b.user-info',
                    value: '`b.user-info <mention>`\nDisplays information on a user.',
                    inline: true
                }
            ],
            footer: tFooter
        }
    })
}