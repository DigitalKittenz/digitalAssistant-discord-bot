const url = require('url');
const QuickLRU = require('quick-lru');

module.exports = {
    name: 'messageCreate',
    messageMap: new Map(),
    urlMap: new Map(),
    channels: process.env.CHANNEL_IDS.split(','), 
    async execute(message) {
        // debugging
        console.log(`Received message: ${message.content} from: ${message.author.username}`);

        // only run in specific channel
        if (!this.channels.includes(message.channel.id)) { 
            return; 
        }

        // add a new QuickLRU instance to the maps if the channel is new
        if (!this.messageMap.has(message.channel.id)) {
            this.messageMap.set(message.channel.id, new QuickLRU({ maxSize: 1000 }));
        }
        if (!this.urlMap.has(message.channel.id)) {
            this.urlMap.set(message.channel.id, new QuickLRU({ maxSize: 1000 }));
        }

        // ignore bot messages
        if (message.author.bot || message.webhookId) return;

        // check URLs
        const urlsInMessage = message.content.match(/\bhttps?:\/\/\S+/gi); // Finds URLs

        if(urlsInMessage !== null){
            for(let u of urlsInMessage){
                if(this.urlMap.get(message.channel.id).has(u)){
                    await message.channel.send('No duplicate URLs!').then(msg => {
                            setTimeout(() => msg.delete(), 2000)  // Deletes the warning after 5 seconds
                        });
                    await message.delete();
                    return ;
                }
                this.urlMap.get(message.channel.id).set(u, true);
            }
        }

        // if this message is the same as the last one delete it
        if (this.messageMap.get(message.channel.id).has(message.content)) {
            await message.delete();
            console.log(`Deleted duplicated message: ${message.content}`);
        } else {
            this.messageMap.get(message.channel.id).set(message.content, true);
        }
    },
};
