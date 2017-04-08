const Discord = require("discord.js");
const beheeyem = new Discord.Client();
const fs = require("fs");
const jsonfile = require("jsonfile");
const path = require("path");
const request = require("request");
var config = require('./config.js');

var imageCheck;

console.log("Starting Beheeyem...");

var commands = loadCommands();
console.log(commands);

beheeyem.on("ready", function() {
    console.log("Beheeyem is active! Currently serving in " + beheeyem.guilds.size + " guilds.\n");
    beheeyem.user.setGame("b.help");
    try {
        request.post("https://bots.discord.pw/api/bots/" + beheeyem.user.id + "/stats", {
            server_count: beheeyem.guilds.size
        });
    } catch (err) {
        console.log("Could not update server count on Discord Bots website.");
    }


});

function loadCommands() {
    var commands = {};
    cmdfiles = fs.readdirSync('./commands/');
    console.log(cmdfiles)
    cmdfiles.forEach(filename => {
        var cmdName = filename.split('.')[0];
        commands[cmdName] = require('./commands/' + filename);
    })
    return commands;
}

beheeyem.on("message", msg => {
    if (msg.author.id != beheeyem.user.id && !msg.author.bot) {
        if (msg.content.startsWith(config.prefix)) {
            var commandstring = msg.content.substring(config.prefix.length);
            var cmd = commandstring.split(" ")[0];
            var args = commandstring.substring(cmd.length + 1);

            if (commands[cmd]) {
                commands[cmd].action(msg, args)
            } else if (cmd == "obtain") {
                msg.channel.sendMessage("Honestly, just use Bulbapedia. The encounter data on the web is so inconsistent and undreadable that there's no way I could create an obtainability command. Sorry about that. 🙁");
            } else if (cmd == "deathbird") {
                msg.channel.sendFile("https://i.imgur.com/pIxQQXA.png", "DEATHBIRD.png");
            } else if (cmd == "youtried") {
                msg.channel.sendFile("https://i.imgur.com/bAxMdQ0.png", "Filename.jpeg.gif.webp.mp4.exe.bat.sh.app.png");
            }

            if (msg.author.id == 120887602395086848) {
                if (cmd == "addnonya") {
                    var nonyas = require("./data/nonyas.json");
                    nonyas.nonyas.push(args);
                    jsonfile.writeFileSync("./data/nonyas.json", nonyas);
                    msg.channel.sendMessage("👌🏾 Sucessfully added Nonya!");
                }
            }
        }
        imageCheck = false;
        checkItalics(msg);
    }
});


beheeyem.login(config.token);

beheeyem.on("guildCreate", (guild) => {
    try {
        request.post("https://bots.discord.pw/api/bots/" + beheeyem.user.id + "/stats", {
            server_count: beheeyem.guilds.size
        });
    } catch (err) {
        console.log("Could not update server count on Discord Bots website.");
    }
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkItalics(msg) {
    var isFound = false;
    var asteriskSplit = msg.content.split("*");
    for (var i = 1; i < asteriskSplit.length - 1; i++) {
        var pokeName = asteriskSplit[i].toLowerCase();
        pokename = pokeName.replace(" ", "-").split("-").map(capitalizeFirstLetter).join("-");
        try {
            msg.channel.sendFile("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif");
        } catch (err) {
            if (!err) {
                console.log(pokeName);
                isFound = true;
                break;
            }
        }
    }
    if (!isFound) {
        var underSplit = msg.content.split("_");
        for (var i = 1; i < underSplit.length - 1; i++) {
            var pokeName = underSplit[i].toLowerCase();
            pokename = pokeName.replace(" ", "-").split("-").map(capitalizeFirstLetter).join("-");
            try {
                msg.channel.sendFile("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif");
            } catch (err) {
                if (!err) {
                    console.log(pokeName);
                    isFound = true;
                    break;
                }
            }
        }
    }
}