exports.action = (msg, args) => {
    var rnd = null;
    var dice = [];
    if (args) {
        if (args.indexOf("d") == -1) {
            if (args == Number(args)) {
                rnd = Math.ceil(Math.random() * Number(args));
            }
        } else {
            var numDice = (args.split("d")[0]);
            for (var i = 0; i < numDice; i++) {
                dice.push(Number(Math.ceil(Math.random() * Number(args.split("d")[1]))));
            }
        }
    } else {
        rnd = Math.ceil(Math.random() * 6);
    }
    if (dice.length > 0) {
        msg.channel.sendMessage("Rolled `" + dice.join("` `") + "`.");
    } else if (rnd != null) {
        msg.channel.sendMessage("Rolled `" + rnd + "`");
    }
}