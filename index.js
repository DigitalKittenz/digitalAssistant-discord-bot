require('dotenv').config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

// setup discord client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ] 
});

// setup openai
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// handle message events



client.globalState = {
    autoReply: false
};//brooooooooo this is all wrong im using not the chatbot
//but the completion omfg u piece of shit

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        // send message to OpenAI's API
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 1.45,
            messages: [
                {
                    "role": "system",
                    "content": "You are chatting with Dotty, a helpful AI assistant."
                },
                {
                    "role": "user",
                    "content": message.content
                }
            ],
        });

        console.log("OpenAI API response:", response);

        // make sure response and message exist
        if (response && response.data && response.data.choices && response.data.choices.length > 0) {
            const reply = response.data.choices[0].message.content;
            console.log("Replying with message:", reply);

            // reply with OpenAI's response
            await message.reply(reply);
        } else {
            console.log("Unexpected response from OpenAI API:", response);
        }
    } catch (error) {
        console.error("Error while communicating with OpenAI API or Discord API:", error);
    }
});
/*
const messageEvent = require('./events/message.js');
client.on('messageCreate', messageEvent.execute.bind(messageEvent));
*/

// load commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
        await command.execute(interaction, client); // Pass the client object here
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
client.login(process.env.TOKEN);