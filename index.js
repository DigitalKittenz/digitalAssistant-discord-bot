// index.js
// reload discord client
const { Client, GatewayIntentBits } = require('discord.js');
const { Collection } = require('discord.js');
const messageEvent = require('./events/message.js');
// intents are needed to register a client, apparently?
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// i have 2 channels.
const channel_id = process.env.CHANNEL_ID.split(",").map(Number);
// require fs module
const fs = require("fs");
// Collection to store links
const links = new Collection();

client.on("messageCreate", (...args) => messageEvent.execute(...args, client, links));



// create a collection to store commands
client.commands = new Collection();

// loop through the files in the commands folder and add them to the collection
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// listen and see when connected
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// listen to interactions and fire an event 🔥
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        // Defer the reply if the command takes more than 3 seconds to execute
        await interaction.deferReply();
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error on command: ${commandName}\n`, error);
        if(!interaction.replied){
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});



// call login command with the bot token
client.login(process.env.TOKEN);
