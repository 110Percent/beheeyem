exports.action = (msg, args) => {
    var rnd = null,
        dice = [];
    if (args) {
        if (args.indexOf("d") == -1) {
            if (args == Number(args)) {
                if (Number(args) > 0 && Number(args) <= 100) {
                    rnd = Math.ceil(Math.random() * Number(args));
                } else {
                    msg.channel.send('How are you even reading this die?');
                }
            } else {
                msg.channel.send('That doesn\'t look like a positive integer to me. (I\'m not good at parsing words as numbers, sorry...)')
            }
        } else {
            var numDice = (args.split("d")[0]);
            if (numDice != Number(numDice)) {
                msg.channel.send('Sorry, what...?');
                return;
            }
            if (numDice < 16) {
                if (args.split("d")[1] != Number(args.split("d")[1])) {
                    msg.channel.send('What are these dice...?');
                    return;
                }
                if (Number(args.split("d")[1]) > 0 && Number(args.split("d")[1]) <= 100) {
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