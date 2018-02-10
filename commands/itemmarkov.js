const MarkovChain = require('markovchain-generate'),
    request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    chain = new MarkovChain();
let concatString = '',
    items = {};

request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/items.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        items = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/items.js').BattleItems;
    } else {
        console.log('Error fetching Showdown items; Switching to local items...');
        items = require('../data/pokedex.js').BattleItems;
    }
    concatString = Object.values(items).map(c => c.desc).join(' ');
    chain.generateChain(concatString);
});

exports.action = (msg) => {
    let genString = chain.generateString();
    if (!genString.endsWith('.')) genString += '.';
    msg.channel.send(genString);
}