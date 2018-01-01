const typeMatchups = require("../data/typechart.js").BattleTypeChart,
    footers = require('../data/footers.js');
let tFooter;

exports.action = (msg, args) => {
    let def = {
        vulnCheck: false,
        normalCheck: false,
        resistCheck: false,
        noCheck: false,
        vulnTypes: [],
        normalTypes: [],
        resistTypes: [],
        noTypes: [],
        vulnDisplay: [],
        vulnRaw: [],
        normalRaw: [],
        resistRaw: [],
        noRaw: [],
        multi: {
            "Bug": 1,
            "Dark": 1,
            "Dragon": 1,
            "Electric": 1,
            "Fairy": 1,
            "Fighting": 1,
            "Fire": 1,
            "Flying": 1,
            "Ghost": 1,
            "Grass": 1,
            "Ground": 1,
            "Ice": 1,
            "Normal": 1,
            "Poison": 1,
            "Psychic": 1,
            "Rock": 1,
            "Steel": 1,
            "Water": 1
        }
    };
    let atk = JSON.parse(JSON.stringify(def));
    var displayTypes = [];
    for (var z = 0; z < args.split(" ").length; z++) {
        var argsSplit = args.split(" ")[z];
        if (Object.keys(typeMatchups).map(c => c.toLowerCase()).indexOf(argsSplit.toLowerCase()) != -1) {
            var toType = capitalizeFirstLetter(argsSplit);
            displayTypes.push(toType);
            var dTaken = typeMatchups[toType].damageTaken;
            for (toMatch in dTaken) {
                if (def.multi[toMatch]) {
                    if (dTaken[toMatch] == 1) {
                        def.multi[toMatch] *= 2;
                    } else if (dTaken[toMatch] == 2) {
                        def.multi[toMatch] *= 0.5;
                    } else if (dTaken[toMatch] == 3) {
                        def.multi[toMatch] = 0;
                    }
                }
            }
            for (toMatch in typeMatchups) {
                if (atk.multi[toMatch]) {
                    if (typeMatchups[toMatch].damageTaken[toType] == 1) {
                        atk.multi[toMatch] *= 2;
                    } else if (typeMatchups[toMatch].damageTaken[toType] == 2) {
                        atk.multi[toMatch] *= 0.5;
                    } else if (typeMatchups[toMatch].damageTaken[toType] == 3) {
                        atk.multi[toMatch] *= 0;
                    }
                }
            }
            for (var i = 0; i < Object.keys(def.multi).length; i++) {
                if (def.multi[Object.keys(def.multi)[i]] > 1) {
                    def.vulnCheck = true;
                    break;
                }
            }
            for (var i = 0; i < Object.keys(def.multi).length; i++) {
                if (def.multi[Object.keys(def.multi)[i]] == 1) {
                    def.normalCheck = true;
                    break;
                }
            }
            for (var i = 0; i < Object.keys(def.multi).length; i++) {
                if (def.multi[Object.keys(def.multi)[i]] > 0 && def.multi[Object.keys(def.multi)[i]] < 1) {
                    def.resistCheck = true;
                    break;
                }
            }
            for (var i = 0; i < Object.keys(def.multi).length; i++) {
                if (def.multi[Object.keys(def.multi)[i]] == 0) {
                    def.noCheck = true;
                    break;
                }
            }
            for (var i = 0; i < Object.keys(atk.multi).length; i++) {
                if (atk.multi[Object.keys(atk.multi)[i]] > 1) {
                    atk.vulnCheck = true;
                    break;
                }
            }
            for (var i = 0; i < Object.keys(atk.multi).length; i++) {
                if (atk.multi[Object.keys(atk.multi)[i]] == 1) {
                    atk.normalCheck = true;
                    break;
                }
            }
            for (var i = 0; i < Object.keys(atk.multi).length; i++) {
                if (atk.multi[Object.keys(atk.multi)[i]] > 0 && atk.multi[Object.keys(atk.multi)[i]] < 1) {
                    atk.resistCheck = true;
                    break;
                }
            }
            for (var i = 0; i < Object.keys(atk.multi).length; i++) {
                if (atk.multi[Object.keys(atk.multi)[i]] == 0) {
                    atk.noCheck = true;
                    break;
                }
            }
        }

    }
    if (def.vulnCheck) {
        for (var i = 0; i < Object.keys(def.multi).length; i++) {
            if (def.multi[Object.keys(def.multi)[i]] > 1 && def.vulnRaw.indexOf(Object.keys(def.multi)[i]) == -1) {
                def.vulnTypes.push(Object.keys(def.multi)[i] + " (x" + def.multi[Object.keys(def.multi)[i]] + ")");
                def.vulnRaw.push(Object.keys(def.multi)[i]);
            }
        }
        def.vulnDisplay[0] = "Vulnerable to: " + def.vulnTypes.join(", ");
    }
    if (def.normalCheck) {
        for (var i = 0; i < Object.keys(def.multi).length; i++) {
            if (def.multi[Object.keys(def.multi)[i]] == 1 && def.normalRaw.indexOf(Object.keys(def.multi)[i]) == -1) {
                def.normalTypes.push(Object.keys(def.multi)[i]);
                def.normalRaw.push(Object.keys(def.multi)[i]);
            }
        }
        def.vulnDisplay[1] = "Takes normal damage from: " + def.normalTypes.join(", ");
    }
    if (def.resistCheck) {
        for (var i = 0; i < Object.keys(def.multi).length; i++) {
            if (def.multi[Object.keys(def.multi)[i]] > 0 && def.multi[Object.keys(def.multi)[i]] < 1 && def.resistRaw.indexOf(Object.keys(def.multi)[i]) == -1) {
                def.resistTypes.push(Object.keys(def.multi)[i] + " (x" + def.multi[Object.keys(def.multi)[i]] + ")");
                def.resistRaw.push(Object.keys(def.multi)[i]);
            }
        }
        def.vulnDisplay[2] = "Resists: " + def.resistTypes.join(", ");
    }
    if (def.noCheck) {
        for (var i = 0; i < Object.keys(def.multi).length; i++) {
            if (def.multi[Object.keys(def.multi)[i]] == 0 && def.noRaw.indexOf(Object.keys(def.multi)[i]) == -1) {
                def.noTypes.push(Object.keys(def.multi)[i]);
                def.noRaw.push(Object.keys(def.multi)[i]);
            }
        }
        def.vulnDisplay[3] = "Not affected by: " + def.noTypes.join(", ");
    }

    if (atk.vulnCheck) {
        for (var i = 0; i < Object.keys(atk.multi).length; i++) {
            if (atk.multi[Object.keys(atk.multi)[i]] > 1 && atk.vulnRaw.indexOf(Object.keys(atk.multi)[i]) == -1) {
                atk.vulnTypes.push(Object.keys(atk.multi)[i] + " (x" + atk.multi[Object.keys(atk.multi)[i]] + ")");
                atk.vulnRaw.push(Object.keys(atk.multi)[i]);
            }
        }
        atk.vulnDisplay[0] = "Supereffective against: " + atk.vulnTypes.join(", ");
    }
    if (atk.normalCheck) {
        for (var i = 0; i < Object.keys(atk.multi).length; i++) {
            if (atk.multi[Object.keys(atk.multi)[i]] == 1 && atk.normalRaw.indexOf(Object.keys(atk.multi)[i]) == -1) {
                atk.normalTypes.push(Object.keys(atk.multi)[i]);
                atk.normalRaw.push(Object.keys(atk.multi)[i]);
            }
        }
        atk.vulnDisplay[1] = "Deals normal damage to: " + atk.normalTypes.join(", ");
    }
    if (atk.resistCheck) {
        for (var i = 0; i < Object.keys(atk.multi).length; i++) {
            if (atk.multi[Object.keys(atk.multi)[i]] > 0 && atk.multi[Object.keys(atk.multi)[i]] < 1 && atk.resistRaw.indexOf(Object.keys(atk.multi)[i]) == -1) {
                atk.resistTypes.push(Object.keys(atk.multi)[i] + " (x" + atk.multi[Object.keys(atk.multi)[i]] + ")");
                atk.resistRaw.push(Object.keys(atk.multi)[i]);
            }
        }
        atk.vulnDisplay[2] = "Not very effective against: " + atk.resistTypes.join(", ");
    }
    if (atk.noCheck) {
        for (var i = 0; i < Object.keys(atk.multi).length; i++) {
            if (atk.multi[Object.keys(atk.multi)[i]] == 0 && atk.noRaw.indexOf(Object.keys(atk.multi)[i]) == -1) {
                atk.noTypes.push(Object.keys(atk.multi)[i]);
                atk.noRaw.push(Object.keys(atk.multi)[i]);
            }
        }
        atk.vulnDisplay[3] = "Doesn't affect: " + atk.noTypes.join(", ");
    }
    tFooter = Math.floor(Math.random() * 15) == 0 ? {
        text: footers[Math.floor(Math.random() * footers.length)],
        icon_url: 'https://cdn.rawgit.com/110Percent/beheeyem/gh-pages/include/favicon.png'
    } : null;
    console.log(`Sending type(s) ${displayTypes.join(', ')} to guild ${msg.guild.name}`);
    msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**" + displayTypes.join(", ") + "**", {
        embed: {
            color: 35071,
            fields: [{
                    name: "Offense",
                    value: atk.vulnDisplay.join("\n\n")
                },
                {
                    name: "Defense",
                    value: def.vulnDisplay.join("\n\n")
                }
            ],
            footer: tFooter
        }
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}