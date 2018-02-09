module.exports = {
    dab: {
        action: (msg) => {
            msg.channel.send('', {
                file: {
                    attachment: './data/kadabra.png',
                    name: 'kadabra.png'
                }
            });
        }
    }
}