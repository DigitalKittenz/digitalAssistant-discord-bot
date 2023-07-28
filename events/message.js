// message.js
// create a collection to store the links
const links = new Collection();

// export the message event listener as a module
module.exports = {
    name: 'messageCreate',
    // add async here
    async execute(message, client) {
        // check if the message is from the channel you want to monitor
        if (message.channel.id === 'your-channel-id') {
            // check if the message contains a link
            const linkRegex = /https?:\/\/\S+/g; // this is a simple regex that matches http or https URLs
            const linkMatch = message.content.match(linkRegex);
            if (linkMatch) {
                // get the first link from the match
                const link = linkMatch[0];
                // check if the link is already in the collection
                if (links.has(link)) {
                    // delete the message
                    await message.delete();
                    // send a warning message
                    await message.channel.send(`Duplicate link detected: ${link}`);
                } else {
                    // add the link to the collection
                    links.set(link, true);
                }
            }
        }
    },
};
