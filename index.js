const { ShardingManager } = require('discord.js');
const config = require('./config.js');
const manager = new ShardingManager('./beheeyem.js', { token: config.token });

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));