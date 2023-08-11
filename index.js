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
// for sending long messages
async function sendLongMessage(channel, message) {
    const parts = message.match(/[\s\S]{1,2000}/g) || [];

    for (const part of parts) {
        await channel.send(part);
        // wait a bit between message parts
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// setup openai
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// handle message events



client.globalState = {
    autoReply: {},
    botActive: true,  //bot's state
};

async function processMessage(message) {
    try {
        // send typing indicator
        await message.channel.sendTyping();

        // initial message array
        let messages = [
            {
                "role": "system",
                "content": "Your name is Dotty, an excited & kind AI girl."
            }, 
            {
                "role": "user",
                "content": `${message.author.username}: ${message.content}`
            }
        ];

        // check if those funny words r in the chat
        if (message.content.includes('dottybot') || message.content.includes('dotty') || message.content.includes('dotbot')) { 
            messages.push({
                "role": "system",
                "content": "Dotty, what do you have to say about that??"
            });
        }

        // hit up openai's fancy api
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 1.4,
            messages: messages
        });

        console.log("OpenAI API response:", response);

        // does the response actually exist? let's check
        if (response && response.data && response.data.choices && response.data.choices.length > 0) {
            const reply = response.data.choices[0].message.content;
            console.log("Replying with message:", reply);

            // send that reply out into the world
            await sendLongMessage(message.channel, reply); 
        } else {
            console.log("Unexpected response from OpenAI API:", response);
        }

    } catch (error) {
        console.error("Error while communicating with OpenAI API or Discord API:", error);
    }
}
client.on('messageCreate', async (message) => {
    // Ignore messages sent by the bot
    if (message.author.bot) return;

    if (!client.globalState.botActive) {
        console.log("Bot is inactive, not processing messages");
        return;
    }

    // Check if autoReply is enabled for this channel
    if (client.globalState.autoReply[message.channel.id]) {
        // Call the processMessage function without waiting for it to finish
        processMessage(message);
    }
});


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
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
client.login(process.env.TOKEN);