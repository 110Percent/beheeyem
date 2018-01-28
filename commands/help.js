const footers = require('../data/footers.js'),
    config = require('../config'),
    fs = require('fs'),
    reload = require('require-reload')(require)
let tFooter,
    commands = {},
    fields = [],
    tmpCmd = [];

module.exports = {
    name: 'help',
    usage: ['help [command]'],
    shortDesc: 'Displays a list of helpful commands.',
}

let files = fs.readdirSync('./commands');
for (let i = 0; i < files.length; i++) {
    tmpCmd[files[i].split('.')[0]] = require(`./${files[i]}`);
    if (tmpCmd[files[i].split('.')[0]].name) commands[files[i].split('.')[0]] = require(`./${files[i]}`);
}
for (let i in commands) {
    let cmd = commands[i];
    fields.push({
                name: config.prefix + cmd.name,
                value: `${cmd.example ? '\`' + config.prefix + cmd.example[0].split('\n').join('\`\n\`') + '\`\n' : ''}${cmd.shortDesc}`,
        inline: true
    });
}


module.exports.action = (msg, args) => {
    tFooter = Math.floor(Math.random() * 15) == 0 ? {
        text: footers[Math.floor(Math.random() * footers.length)],
        icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
    } : null;
    if (!args) {
        msg.channel.send("", {
            embed: {
                color: 35071,
                fields: fields,
                footer: tFooter
            }
        })
    } else {
        let checkString = args.split(' ')[0];
        if (commands[checkString]) {
            let cmd = commands[checkString];
            msg.channel.send(`**${config.prefix + cmd.name}**`, {
                embed: {
                    color: 35071,
                    description: cmd.longDesc ? cmd.longDesc : cmd.shortDesc,
                    fields: [
                        {
                            name: 'Usage',
                            value: cmd.usage ? cmd.usage.map(c => config.prefix + c).join('\n') : config.prefix + cmd.name
                        }
                    ],
                    footer: tFooter
                }
            })
        }
    }
}