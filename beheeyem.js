const Discord = require("discord.js"), // Require Node modules and initialize Discord client
    beheeyem = new Discord.Client(),
    fs = require("fs"),
    jsonfile = require("jsonfile"),
    path = require("path"),
    request = require("request"),
    colors = require('colors'),
    otherAliases = require('./data/otherAliases.json');
var config = require('./config.js'),
    imageCheck;

console.log("Starting Beheeyem...");

var commands = loadCommands(); // Load commands into the commands object

beheeyem.on("ready", function() {
    console.log(("Beheeyem is active! Currently serving in " + String(beheeyem.guilds.size).white + " guilds.\n".green).bold);
    beheeyem.user.setGame("b.help"); //Set "playing" status on the user's profile


});

function loadCommands() {
    console.log('Loading commands...'.cyan)
    let commands = {}, // Initialize values
        errCount = 0;
    cmdfiles = fs.readdirSync('./commands/'); // Read files in the commands directory
    cmdfiles.forEach(filename => {
        var cmdName = filename.split('.')[0];
        try { // Attempt to load the command into the bot
            commands[cmdName] = require('./commands/' + filename);
            console.log('Loaded '.green + cmdName.yellow.bold);
        } catch (err) { // If unsuccessful, display an error
            if (err) {
                errCount++;
                console.log('Error in '.red + cmdName.yellow + '!'.red + '\n' + err.stack);
            }
        }
    });
    console.log('Loaded commands with '.cyan + (errCount > 0 ? errCount.toString().red : 'no'.green) + ` error${errCount == 1? '' : 's'}!`.cyan); // Print number of errored commands, if any.
    return commands;
}

beheeyem.on("message", msg => { // Fires when a message is sent that can be detected by Beheeyem
    if (msg.author.id != beheeyem.user.id && !msg.author.bot) { // Ensures Beheeyem doesn't detect messages from bots or itself 
        if (msg.content.startsWith(config.prefix)) { // Check to see if the message is an attempted command
            let commandstring = msg.content.substring(config.prefix.length),
                cmd = commandstring.split(" ")[0], // Split the message into more readable argument/command portions
                args = commandstring.substring(cmd.length + 1);

            if (commands[cmd]) { // If a command by the name of the attempted name exists, try to fire it
                try {
                    commands[cmd].action(msg, args, beheeyem);
                } catch (err) {
                    console.error(err); // If unsuccessful, log the error.
                }
                // TO MOVE TO SEPARATE FILES
            } else if (cmd == "obtain") {
                msg.channel.send("Honestly, just use Bulbapedia. The encounter data on the web is so inconsistent and undreadable that there's no way I could create an obtainability command. Sorry about that. 🙁");
            } else if (cmd == "deathbird") {
                msg.channel.send('', {
                    file: "https://i.imgur.com/pIxQQXA.png",
                    name: "DEATHBIRD.png"
                });
            } else if (cmd == "youtried") {
                msg.channel.send('', {
                    file: "https://i.imgur.com/bAxMdQ0.png",
                    name: "Filename.jpeg.gif.webp.mp4.exe.bat.sh.app.png"
                });
            } else if (msg.author.id == 120887602395086848) { // Commands only to be fired by the bot's owner
                if (cmd == 'eval') {
                    try {
                        msg.channel.sendMessage("", {
                            embed: {
                                title: '🖥 JavaScript Eval',
                                fields: [{
                                        name: "Input",
                                        value: args
                                    },
                                    {
                                        name: "Output",
                                        value: eval(args)
                                    }
                                ],
                                color: 5561189
                            }
                        });
                    } catch (err) {
                        msg.channel.sendMessage("", {
                            embed: {
                                title: '⚠ Error',
                                fields: [{
                                        name: "Input",
                                        value: args
                                    },
                                    {
                                        name: "Error",
                                        value: err.toString()
                                    }
                                ],
                                color: 16724015
                            }
                        });
                    }
                }
            }
        } else { // If a command was fired, do not check for italics in the messsage.
            checkItalics(msg);
        }
    }
});


beheeyem.login(config.token);

function capitalizeFirstLetter(string) { // Simple function to capitalize the first letter in a string.
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkItalics(msg) { // Function to be fired if a message is valid for italicization checking
    let isShiny = false, // Sprite defaults to a non-shiny version
        isFound = false,
        urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani/', // Default constructor for a sprite
        asteriskSplit = msg.content.replace(/#/g, '').replace(/\?/g, '').split("*"); // Split the message contents by asterisk, making sure to remove any url-tricky characters.
    var pokeName;
    for (var i = 1; i < asteriskSplit.length - 1; i++) { // Check each substring between asterixes
        pokeName = asteriskSplit[i].toLowerCase();
        if (pokeName.indexOf('shiny') != -1) { // Detect if the potential pokemon is a shiny
            isShiny = true;
            pokeName = pokeName.replace(' shiny', '').replace('shiny ', '').replace('-shiny', '').replace('shiny-', '').replace('shiny', '');

        }
        pokeName = pokeName.replace(" ", "-");
        let imgPoke = pokeName.toLowerCase();
        for (let r in otherAliases) {
            imgPoke = imgPoke.replace(r, otherAliases[r]); // Fix custom aliases
        }
        if (isShiny) urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani-shiny/';
        request(urlBuild + imgPoke + ".gif", (err, response) => {; // Check to see if the sprite for the desired Pokemon exists
            if (!err) {
                if (response.statusCode == 200) {
                    msg.channel.send('', { // If it does, send it
                        file: response.request.href
                    });
                    isFound = true;
                }
            }
        });
        if (isFound) break;
    }
    if (!isFound) { // Same stuff with underscores (to be fixed)
        var underSplit = msg.content.replace(/#/g, '').replace(/\?/g, '').split("_");
        var pokeName;
        for (var i = 1; i < underSplit.length - 1; i++) {
            pokeName = underSplit[i].toLowerCase();
            if (pokeName.indexOf('shiny') != -1) {
                isShiny = true;
                pokeName = pokeName.replace(' shiny', '').replace('shiny ', '').replace('-shiny', '').replace('shiny-', '').replace('shiny', '');
            }
            pokeName = pokeName.replace(" ", "-");
            let imgPoke = pokeName.toLowerCase();
            for (let r in otherAliases) {
                imgPoke = imgPoke.replace(r, otherAliases[r]);
            }
            if (isShiny) urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani-shiny/';
            request(urlBuild + imgPoke + ".gif", (err, response) => {
                if (!err) {
                    if (response.statusCode == 200) {
                        isFound == true;
                        msg.channel.send({
                            file: response.request.href
                        });
                    }
                }
            });
            if (isFound) break;
        }
    }
}