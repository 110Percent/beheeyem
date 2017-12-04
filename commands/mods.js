// This command isn't functional until Beheeyem joins the /r/Pokemon Discord.

exports.action = null
    /*(msg, args) => {
    var modsRoleid = 175810054987972608;
    try {
        var mods = beheeyem.guilds.get("111504456838819840").roles.get("264780359332265985").members.map(c => c.user);
        var modsObject = {
            online: [],
            away: [],
            dnd: []
        };
        for (var i = 0; i < Object.keys(mods).length; i++) {
            var modUser = mods[i];
            if (modUser.presence.status == "online") {
                modsObject.online.push(modUser.id);
            } else if (modUser.presence.status == "idle") {
                modsObject.away.push(modUser.id);
            } else if (modUser.presence.status == "dnd") {
                modsObject.dnd.push(modUser.id);
            }
        }
        var embedObject = {
            color: 35071,
            fields: []
        };
        if (modsObject.online.length > 0) {
            embedObject.fields.push({
                name: "Online",
                value: modsObject.online.map(c => msg.guild.members.get(c).user.username + "#" + msg.guild.members.get(c).user.discriminator).join("\n")
            });
        }
        if (modsObject.away.length > 0) {
            embedObject.fields.push({
                name: "Away",
                value: modsObject.away.map(c => msg.guild.members.get(c).user.username + "#" + msg.guild.members.get(c).user.discriminator).join("\n")
            });
        }
        if (modsObject.dnd.length > 0) {
            embedObject.fields.push({
                name: "Do Not Disturb",
                value: modsObject.dnd.map(c => msg.guild.members.get(c).user.username + "#" + msg.guild.members.get(c).user.discriminator).join("\n")
            });
        }
        msg.channel.send("\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\n\n**Moderators**", { embed: embedObject });
    } catch (err) {}
}*/