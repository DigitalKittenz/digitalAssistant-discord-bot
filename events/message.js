const url = require('url');
const QuickLRU = require('quick-lru');

module.exports = {
    name: 'messageCreate',
    messages: new QuickLRU({ maxSize: 1000 }),
    urls: new QuickLRU({ maxSize: 1000 }),
    async execute(message) {
        // debugging
        console.log(`Received message: ${message.content} from: ${message.author.username}`);

        // ignore bot messages
        if (message.author.bot || message.webhookId) return;

        // check URLs
        const urlsInMessage = message.content.match(/\bhttps?:\/\/\S+/gi); // Finds URLs
        
        if(urlsInMessage !== null){
            for(let u of urlsInMessage){
                if(this.urls.has(u)){
                    await message.delete();
                    return message.channel.send('No duplicate URLs!').then(msg => {
                        setTimeout(() => msg.delete(), 5000)  // Deletes the warning after 5 seconds
                    });
                }
                this.urls.set(u, true);
            }
        }

        // if this message is the same as the last one delete it
        if (this.messages.has(message.content)) {
            await message.delete();
            console.log(`Deleted duplicated message: ${message.content}`);
        } else {
            this.messages.set(message.content, true);
        }
    }
};
