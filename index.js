// reload discord client
const { CLient, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// intents is needed to register a client apparently?

// listen and see when connected
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// okay commands now. this is an array of stuff

const options = [
    




]