exports.action = (msg, args) => {
    var rnd = null;
    var dice = [];
    if (args) {
        if (args.indexOf("d") == -1) {
            if (args == Number(args)) {
                if (Number(args) > 0 && Number(args) < 100) {
                    rnd = Math.ceil(Math.random() * Number(args));
                } else {
                    msg.channel.send('How are you even reading this die?');
                }
            }
        } else {
            var numDice = (args.split("d")[0]);
            if (numDice < 16) {
                if (Number(args.split("d")[1]) > 0 && Number(args.split("d")[1]) < 100) {
                    for (var i = 0; i < numDice; i++) {
                        dice.push(Number(Math.ceil(Math.random() * Number(args.split("d")[1]))));
                    }
                } else {
                    msg.channel.send('How are you even reading these dice?');
                }
            } else {
                msg.channel.send('That\'s a lot of dice. How can you even fit those in your hand?');
            }
        }
    } else {
        rnd = Math.ceil(Math.random() * 6);
    }
    if (dice.length > 0) {
        msg.channel.send("🎲 Rolled `" + dice.join("` `") + "`.");
    } else if (rnd != null) {
        msg.channel.send("🎲 Rolled `" + rnd + "`");
    }
}