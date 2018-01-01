module.exports = { action: () => {} };

// This command is now deprecated, due to the shutdown of Miiverse.

/*const cheerio = require('cheerio'),
    request = require('request');

exports.action = (msg, args) => {

    let embedObject = {}

    msg.channel.send('Fetching profile...')
        .then(msg2 => {
            request(`https://miiverse.nintendo.net/users/${args.split(' ')[0]}`, function(err, resp, html) {
                console.log(resp.statusCode)
                if (!err && resp.statusCode == 200) {
                    $ = cheerio.load(html);
                    let genres = $('.favorite-game-genre').children('.note').children('span').toArray();
                    let genreString;
                    if (genres.map(c => c.children[0].data).length > 0) {
                        genreString = genres.map(c => c.children[0].data).join(', ');
                    } else {
                        genreString = 'None';
                    }
                    let systems = $('.game').children('.note').children('div').toArray().map(c => c.children);
                    let systemArray = [];
                    for (system in systems) {
                        let sysName = systems[system].find(x => x.name == 'span').children[0].data;
                        if (sysName == 'System in the Nintendo 3DS Family') {
                            sysName = 'Nintendo 3DS';
                        }
                        systemArray.push(sysName);
                    }
                    embedObject = {
                        title: `${$('.id-name').text()} (${$('.nick-name').text()})`,
                        url: `https://miiverse.nintendo.net${$('.nick-name').attr('href')}`,
                        description: $('.js-truncated-text').text(),
                        color: 0x5ac800,
                        thumbnail: {
                            url: $('#sidebar-profile-body').children('.icon-container').children('a').children('.icon').attr('src')
                        },
                        fields: [{
                                name: 'Following',
                                value: $('.test-following-count').text(),
                                inline: true
                            },

                            {
                                name: 'Followers',
                                value: $('.test-follower-count').text(),
                                inline: true
                            },
                            {
                                name: 'Game Experience',
                                value: $('.test-game-skill').text(),
                                inline: true
                            },
                            {
                                name: 'Country',
                                value: $('.user-main-profile').children('.note').toArray()[0].children[0].data,
                                inline: true
                            },
                            {
                                name: genres.length > 1 ? 'Favourite Game Genres' : 'Favourite Game Genre',
                                value: genreString

                            },
                            {
                                name: 'Systems Owned',
                                value: systemArray.join(', ')
                            }
                        ]
                    }
                    msg2.channel.send('', { embed: embedObject });
                } else if (resp.statusCode == 404) {
                    setTimeout(function() {
                        msg2.channel.send('Couldn\'t find a profile with that username. Check your spelling and try again.');
                    }, 100);
                } else {
                    msg2.channel.send('Unknown error.');
                }
                msg2.delete();
            });
        });

}*/