const MarkovChain = require('markovchain-generate'),
    request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    chain = new MarkovChain();
let concatString = '',
    abilities = {};

request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/abilities.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        abilities = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/abilities.js').BattleAbilities;
    } else {
        console.log('Error fetching Showdown abilities; Switching to local abilities...');
        abilities = require('../data/abilities.js').BattleAbilities;
    }
    concatString = Object.values(abilities).map(c => c.desc).join(' ');
    chain.generateChain(concatString);
});

exports.action = (msg) => {
    let genString = chain.generateString();
    if (!genString.endsWith('.')) genString += '.';
    msg.channel.send(genString);
}