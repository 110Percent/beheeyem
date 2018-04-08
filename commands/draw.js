const fs = require('fs'),
    path = require('path'),
    request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    config = require('../config');
let drawDB = {},
    taken = [],
    randomID = 0,
    dex;
refreshDB();

request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/pokedex.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        dex = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/pokedex.js').BattlePokedex;
    } else {
        console.log('Error fetching Showdown dex; Switching to local dex...');
        dex = require('../data/pokedex.js').BattlePokedex;
    }
});

/* exports.action = (msg, args, beheeyem) => {
    if (!msg.guild || (msg.guild.id != '146626123990564864' && msg.guild.id != '146626123990564864')) return;
    if (!args) {
        msg.channel.send(`Use \`${config.prefix}draw assign\` to assign yourself a Pokémon to draw.`);
    }
    switch (args.split(' ')[0]) {
        case 'assign':
            if (!drawDB[msg.author.id]) {
                taken = Object.values(drawDB);
                randomID = Math.floor(Math.random() * 807) + 1;
                while (taken[randomID]) randomID = Math.floor(Math.random() * 807) + 1;
                drawDB[msg.author.id] = randomID;
                msg.channel.send(`User **${msg.member.displayName}** has been assigned to Pokémon **${fromID(drawDB[msg.author.id]).species}**!`);
                fs.writeFileSync(path.join(__dirname, '../data/drawDB.json'), JSON.stringify(drawDB, null, 4));
            } else {
                msg.channel.send(`**${msg.member.displayName}** has already been assigned to **${fromID(drawDB[msg.author.id]).species}**.`);
            }
            break;
        case 'get':
            let target, tUser;
            if (!msg.member.hasPermission('ADMINISTRATOR')) return;
            switch (args.split(' ')[1]) {
                case 'pokemon':
                    if (!args.split(' ')[2]) return;
                    target = args.split(' ')[2].replace(/[<>!@]*\/g, '');
                    console.log(target);
                    if (drawDB[target]) {
                        tUser = beheeyem.users.get(target);
                        msg.channel.send(`User **${tUser.username}#${tUser.discriminator}** is assigned to Pokémon **${fromID(drawDB[target]).species}**.`);
                    } else {
                        msg.channel.send('This user is not assigned to a Pokémon.');
                    }
                    break;
                case 'user':
                    if (!args.split(' ')[2]) return;
                    target = args.split(' ')[2],
                        pokeEntry = dex[target.toLowerCase()];
                    if (!pokeEntry) pokeEntry = fromID(target);
                    if (pokeEntry) {
                        if (Object.values(drawDB).indexOf(pokeEntry.num) > -1) {
                            tUser = beheeyem.users.get(getKeyByValue(drawDB, pokeEntry.num));
                            msg.channel.send(`Pokémon **${pokeEntry.species}** is being drawn by **${tUser.username}#${tUser.discriminator}**.`)
                        } else msg.channel.send(`Pokémon **${pokeEntry.species}** is not being drawn by anyone.`);
                    } else {
                        msg.channel.send('No Pokémon by that name or dex ID was found.');
                    }
            }
    }
}; */

function refreshDB() {
    drawDB = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/drawDB.json'), { encoding: 'utf8' }));
}

function fromID(id) {
    return Object.values(dex).find(c => c.num == id);
}

function getKeyByValue(obj, value) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === value)
                return prop;
        }
    }
}