exports.action = (msg) => {
    setTimeout(() => {
        msg.channel.send('', {
            file: {
                attachment: './data/slowpoke.png'
            }

        });
    }, 45000);
}