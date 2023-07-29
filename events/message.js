// message.js
const { Collection } = require('discord.js');

// export the message event listener as a module
module.exports = {
  name: 'messageCreate',
  // add async here
  async execute(message, client, links) { 
    // check if the message is from the channel you want to monitor
    // use the environment variable here
    console.log(`Message received: ${message.content}`);
    if (message.author.bot) return;

    // get channel_id from environment variables
    const channel_id = process.env.CHANNEL_ID.split(',').map(Number);

    if (channel_id.includes(message.channel.id)) {
      console.log(process.env.CHANNEL_ID);

      // check if the message contains a link
      const linkRegex = /https?:\/\/\S+/g; 
      const linkMatch = message.content.match(linkRegex);
      if (linkMatch) {
        console.log(links);
        
        // get the first link from the match
        console.log('URL Found in message');
        const link = linkMatch[0];
        // check if the link is already in the collection and the message author is not the bot itself
        if (links.has(link) && message.author.id !== client.user.id) {
          console.log('Removing duplicate link: ' + link);
          // delete the message
          await message.delete();
          // send a warning message
          await message.channel.send(`Duplicate link detected: ${link}`);
        } else {
          // add the link to the collection
          console.log('Adding new link: ' + link);
          links.set(link, true);
        }
      }
    }
  },
};
