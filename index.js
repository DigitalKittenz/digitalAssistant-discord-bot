// index.js

const { Client, GatewayIntentBits } = require('discord.js');
const { Collection } = require('discord.js');
// intents are needed to register a client, apparently?
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions // added this line
    ] 
});

// require fs module
const fs = require('fs');

const messageEvent = require('./events/message.js');

client.on('messageCreate', messageEvent.execute.bind(messageEvent)); // bind the event here

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
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// call login command with the bot token
client.login(process.env.TOKEN);
