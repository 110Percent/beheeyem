exports.action = (msg, args) => {
    var nonyas = require("../data/nonyas.js").nonyas,
        selectedNonya = nonyas[Math.floor(Math.random() * nonyas.length)];
    msg.channel.send('', {
        file: selectedNonya,
        name: "nonya." + selectedNonya.split(".")[selectedNonya.split(".").length - 1]
    });
};