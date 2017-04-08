exports.action = (msg, args) => {
    msg.channel.sendMessage("", {
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
                    value: "`b.type psychic`\nShows the damage modifiers between a set of types and others. Multiple types can be inputted.",
                    inline: true
                }
            ]
        }
    })
}