// reload discord client
const { CLient, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });