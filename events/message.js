module.exports = {
    name: 'messageCreate', // name of our event
    messageMap: new Map(), // we're gonna use this map to keep track of messages
    urlMap: new Map(), // and this one to keep track of urls
    channels: process.env.CHANNEL_IDS.split(','), // here's a list of channels we care about
    
    // this is the main function that gets called when a message is created
    async execute(message) {
        // let's print out the message and who sent it
        console.log(`Received message: ${message.content} from: ${message.author.username}`);

        // if the message wasn't in one of our channels, we don't care about it
        if (!this.channels.includes(message.channel.id)) { 
            return; 
        }

        // if we haven't seen this channel before, let's add it to our maps
        if (!this.messageMap.has(message.channel.id)) {
            this.messageMap.set(message.channel.id, {});
        }
        if (!this.urlMap.has(message.channel.id)) {
            this.urlMap.set(message.channel.id, {});
        }

        // we don't care about messages from bots or webhooks
        if (message.author.bot || message.webhookId) return;

        // let's find all the urls in the message
        const urlsInMessage = message.content.match(/\bhttps?:\/\/\S+/gi);

        // if we found any urls...
        if (urlsInMessage !== null) {
            // let's go through each one
            for(let u of urlsInMessage){
                // if we've seen this url before in this channel...
                if(this.urlMap.get(message.channel.id)[u]){
                    // delete the message and tell the user no duplicate urls
                    await message.delete();
                    return await message.channel.send('No duplicate URLs!').then(msg => {
                        setTimeout(() => msg.delete(), 2000);
                    });
                }
                // if it's a new url, add it to our map
                else {
                    this.urlMap.get(message.channel.id)[u] = true;
                }
            }
        }

        // if we've seen this message before in this channel...
        if(this.messageMap.get(message.channel.id)[message.content]){
            // delete the message and print a log
            await message.delete();
            console.log(`Deleted duplicated message: ${message.content}`);
        }
        // if it's a new message, add it to our map
        else {
            this.messageMap.get(message.channel.id)[message.content] = true;
        }
    },
};