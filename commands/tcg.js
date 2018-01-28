const tcg = require('../data/tcg.json'),
    request = require('request'),
    Matcher = require('did-you-mean'),
    match = new Matcher(tcg.map(c => c.name.toLowerCase().replace(' ', '-')).join(' '));

module.exports = {
    name: 'tcg',
    usage: ['tcg find <card> [set]', 'tcg list <card>'],
    example: ['tcg find dusknoir', 'tcg list super-potion'],
    shortDesc: 'Search and view Pokémon TCG cards.',
    longDesc: 'Help look for a Pokémon TCG card and display it.\n\nThe `find` subcommand searches for a card by name (eg. Decidueye), followed by an optional set id (eg. sm1).\nThe `list` subcommand displays a list of sets (by ID) in which a given card is present.'
}

module.exports.action = (msg, args) => {
    if (!args) {
        msg.channel.send('No search parameters!');
    }
    let params = args;
    params = params.replace(' ex', '-ex');
    let spar = params.split(' '),
        subCmd = spar[0];
    spar.shift();
    let nameTester = [
        spar[0],
        spar[0].replace('-', ' '),
        spar[0].replace('_', ' ')
    ]
    if (subCmd == 'find') {
        let card = tcg.find((c) => {
            let cond = '';
            if (spar.length > 1) cond = 'nameTester.indexOf(c.name.toLowerCase()) > -1 && c.setCode.toLowerCase() == spar[1].toLowerCase()'
            else cond = 'nameTester.indexOf(c.name.toLowerCase()) > -1'
            return eval(cond);
        });
        if (card) {
            console.log(card);
            msg.channel.send('Fetching card...')
                .then(msg2 => {
                    var requestSettings = {
                        url: card.imageUrlHiRes,
                        method: 'GET',
                        encoding: null
                    };
                    request(requestSettings, function(err, res, body) {
                        if (res.statusCode == 200) {
                            msg2.edit('', {
                                embed: {
                                    title: card.name,
                                    fields: [{
                                            name: 'Set',
                                            value: card.set,
                                            inline: true
                                        },
                                        {
                                            name: 'Card Type',
                                            value: card.supertype,
                                            inline: true
                                        }
                                    ],
                                    image: {
                                        url: card.imageUrlHiRes,
                                    }
                                }
                            })
                        } else {
                            request({
                                url: card.imageUrl,
                                method: 'GET',
                                encoding: null
                            }, function(err, res, body) {
                                if (res.statusCode == 200) {
                                    msg2.edit('', {
                                        embed: {
                                            title: card.name,
                                            fields: [{
                                                    name: 'Set',
                                                    value: card.set,
                                                    inline: true
                                                },
                                                {
                                                    name: 'Card Type',
                                                    value: card.supertype,
                                                    inline: true
                                                }
                                            ],
                                            image: {
                                                url: card.imageUrl,
                                            },
                                            footer: {
                                                text: 'A high-resolution version of this card could not be found.\nIf you\'d like a hi-res version, try another set.'
                                            }
                                        }
                                    })
                                } else {

                                }
                            });
                        }

                        //.catch(console.error)
                    });
                })
        } else {
            if (spar.length == 1) {
                let dym = match.get(spar[0]);
                let dymString;
                if (dym == null) {
                    dymString = 'Check your spelling and try again.';
                } else {
                    dymString = `Did you mean \`${dym}\`?`;
                }
                msg.channel.send("⚠ Card not found! " + dymString);
            }
        }
    } else if (subCmd == 'list') {
        let cards = [];
        cards = tcg.filter(c => nameTester.indexOf(c.name.toLowerCase()) > -1);
        if (cards.length > 0) {
            msg.channel.send(`${jsUcfirst(spar[0])} is found in the following sets:\n\`\`\`\n${cards.map(c => c.setCode).join(', ')}\n\`\`\``);
        }
    }

}

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}