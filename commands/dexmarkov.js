const MarkovChain = require('markovchain-generate'),
    chain = new MarkovChain(),
    dexEntries = require('../data/flavorText.json');
let concatString = '',
    descs = [];

for (let i in dexEntries) {
    descs.push(dexEntries[i].filter((c) => { return c.langID == 9 })[0].flavourText);
}
concatString = descs.join(' ');
chain.generateChain(concatString);

exports.action = (msg) => {
    let genString = chain.generateString();
    if (!genString.endsWith('.')) genString += '.';
    msg.channel.send(genString);
}