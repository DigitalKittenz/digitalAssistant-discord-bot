// index.js
// reload discord client
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { Collection } = require('discord.js');

// intents are needed to register a client, apparently?

// require fs module
const fs = require('fs');

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

    // get the command name from the interaction
    const commandName = interaction.commandName;

    // check if the command exists in the collection
    if (!client.commands.has(commandName)) return;

    // get the command from the collection
    const command = client.commands.get(commandName);

    // try to execute the command
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// call login command with the bot token
client.login(process.env.TOKEN);
