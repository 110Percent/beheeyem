const moves = require("../data/moves.js").BattleMovedex;

exports.action = (msg, args) => {
    var moveName = args.toLowerCase();
    var move = moves[moveName];
    if (!move) {
        for (var i = 0; i < Object.keys(moves).length; i++) {
            if (moves[Object.keys(moves)[i]].num == moveName) {
                move = moves[Object.keys(moves)[i]];
                break;
            }
        }
    }
    if (!move) {
        for (var i = 0; i < Object.keys(moves).length; i++) {
            if (moves[Object.keys(moves)[i]].name.toLowerCase() == moveName) {
                move = moves[Object.keys(moves)[i]];
                break;
            }
        }
    }
    if (move) {
        moveName = move.name;
        var descString;
        if (move.desc) {
            descString = move.desc;
        } else {
            descString = move.shortDesc;
        }
        var accuracyString;
        if (move.accuracy == true) {
            accuracyString = "Certain Success";
        } else {
            accuracyString = move.accuracy;
        }
        var viableString;
        if (move.isViable) {
            viableString = "Yes";
        } else {
            viableString = "No";
        }
        var targetString;
        if (move.target == "normal") {
            targetString = "One Enemy";
        } else {
            targetString = capitalizeFirstLetter(move.target.replace(/([A-Z])/g, ' $1'));
        }
        var crystalString;
        if (move.isZ) {
            crystalString = capitalizeFirstLetter(move.isZ.substring(0, move.isZ.length - 1)) + " Z";
        } else {
            crystalString = "None";
        }
        var embedObject = {
            color: 35071,
            fields: [{
                    name: "Description",
                    value: descString
                },
                {
                    name: "Type",
                    value: move.type,
                    inline: true
                },
                {
                    name: "Base Power",
                    value: move.basePower,
                    inline: true
                },
                {
                    name: "PP",
                    value: move.pp,
                    inline: true
                },
                {
                    name: "Category",
                    value: move.category,
                    inline: true
                },
                {
                    name: "Accuracy",
                    value: accuracyString,
                    inline: true
                },
                {
                    name: "Viable?",
                    value: viableString,
                    inline: true
                },
                {
                    name: "Priority",
                    value: move.priority,
                    inline: true
                },
                {
                    name: "Target",
                    value: targetString,
                    inline: true
                },
                {
                    name: "Z-Crystal",
                    value: crystalString,
                    inline: true
                }
            ],
            footer: {
                text: "#" + move.num
            }
        };
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + capitalizeFirstLetter(move.name) + "**", { embed: embedObject });
        console.log(embedObject);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}