exports.action = (msg, args) => {
    var nonyas = require("./data/nonyas.json").nonyas;
    var selectedNonya = nonyas[Math.floor(Math.random() * nonyas.length)];
    msg.channel.sendFile(selectedNonya, "nonya." + selectedNonya.split(".")[selectedNonya.split(".").length - 1]);
}