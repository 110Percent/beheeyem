const MarkovChain = require('markovchain-generate'),
    request = require('request'),
    requireFromUrl = require('require-from-url/sync'),
    chain = new MarkovChain();
let concatString = '',
    moves = {};

request('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/moves.js', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        moves = requireFromUrl('https://raw.githubusercontent.com/Zarel/Pokemon-Showdown/master/data/moves.js').BattleMovedex;
    } else {
        console.log('Error fetching Showdown dex; Switching to local dex...');
        moves = require('../data/pokedex.js').BattleMovedex;
    }
    concatString = Object.values(moves).map(c => c.desc).join(' ');
    chain.generateChain(concatString);
});

exports.action = (msg) => {
    let genString = chain.generateString();
    if (!genString.endsWith('.')) genString += '.';
    msg.channel.send(genString);
}