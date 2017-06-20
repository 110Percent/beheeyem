const convert = require('convert-units');
let units = convert().possibilities();

exports.action = (msg, args) => {
    if (args) {
        if (args.split(' ')[0].match(/^-?\d+\.?\d*$/) && args.split(' ')[2] == 'to') {
            if (units.indexOf(args.split(' ')[1]) != -1) {
                if (units.indexOf(args.split(' ')[3]) != -1) {
                    if (convert().from(args.split(' ')[1]).possibilities().indexOf(args.split(' ')[3]) != -1) {
                        let result = Math.round(convert(Number(args.split(' ')[0])).from(args.split(' ')[1]).to(args.split(' ')[3]) * 100) / 100;
                        msg.channel.send('**Unit Conversion**', {
                            embed: {
                                fields: [{
                                        name: 'Input',
                                        value: args.split(' ')[0] + ' ' + (args.split(' ')[0] == 1 ? convert().describe(args.split(' ')[1]).singular : convert().describe(args.split(' ')[1]).plural)
                                    },
                                    {
                                        name: 'Output',
                                        value: result + ' ' + (result == 1 ? convert().describe(args.split(' ')[3]).singular : convert().describe(args.split(' ')[3]).plural)
                                    }
                                ]
                            }
                        });
                    } else {
                        msg.channel.send('Could not convert **' + convert().describe(args.split(' ')[1]).plural + '** to **' + convert().describe(args.split(' ')[3]).plural + '**!');
                    }
                } else {
                    msg.channel.send('Invalid unit `' + args.split(' ')[3] + '`!\nFor a list of supported units, see here: https://github.com/ben-ng/convert-units#supported-units');
                }
            } else {
                msg.channel.send('Invalid unit `' + args.split(' ')[1] + '`!\nFor a list of supported units, see here: https://github.com/ben-ng/convert-units#supported-units');
            }
        } else {
            msg.channel.send('Invalid Syntax!\nProper Syntax: `b.convert <float> <unit> to <unit>`');
        }
    }

}