module.exports = {
    name: 'messageCreate',
    messageMap: new Map(),
    urlMap: new Map(),
    channels: process.env.CHANNEL_IDS.split(','), 
    async execute(message) {
        console.log(`Received message: ${message.content} from: ${message.author.username}`);

        if (!this.channels.includes(message.channel.id)) { 
            return; 
        }

        if (!this.messageMap.has(message.channel.id)) {
            this.messageMap.set(message.channel.id, {});
        }
        if (!this.urlMap.has(message.channel.id)) {
            this.urlMap.set(message.channel.id, {});
        }

        if (message.author.bot || message.webhookId) return;

        const urlsInMessage = message.content.match(/\bhttps?:\/\/\S+/gi);

        if (urlsInMessage !== null) {
            for(let u of urlsInMessage){
                if(this.urlMap.get(message.channel.id)[u]){
                    await message.delete();
                    return await message.channel.send('No duplicate URLs!').then(msg => {
                        setTimeout(() => msg.delete(), 2000);
                    });
                }
                else {
                    this.urlMap.get(message.channel.id)[u] = true;
                }
            }
        }

        if(this.messageMap.get(message.channel.id)[message.content]){
            await message.delete();
            console.log(`Deleted duplicated message: ${message.content}`);
        }
        else {
            this.messageMap.get(message.channel.id)[message.content] = true;
        }
    },
};
