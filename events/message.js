const url = require('url');

module.exports = {
    name: 'messageCreate',
    lastMessageContent: '',
    lastMessageUrl: '',
    async execute(message) {
        // debugging
        console.log(`Received message: ${message.content} from: ${message.author.username}`);

        // only run in specific channel
       // if (message.channel.id !== process.env.CHANNEL_ID) return;

        // ignore bot messages
        if (message.author.bot || message.webhookId) return;

        // check URLs
        const urlsInMessage = message.content.match(/\bhttps?:\/\/\S+/gi); // Finds URLs
        
        if(urlsInMessage !== null){
            for(let u of urlsInMessage){
                if(u === this.lastMessageUrl){
                    await message.delete();
                    return message.channel.send('No duplicate URLs!').then(msg => {
                        setTimeout(() => msg.delete(), 5000)  // Deletes the warning after 5 seconds
                    });
                }
                this.lastMessageUrl = u;
            }
        }

        // if this message is the same as the last one delete it
        if (message.content === this.lastMessageContent) {
            await message.delete();
            console.log(`Deleted duplicated message: ${message.content}`);
        }

        this.lastMessageContent = message.content;
    },
};
