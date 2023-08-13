require('dotenv').config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
// here we load up that juicy prompts file
const prompts = require('./prompts');

// setup discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});
// just a cute offline message
const botOffMessage = 'bot is resigned to her very own dream bubble.';

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
    conversations: {} // object to store chat histories per channel
};

async function processMessage(message) {
    try {
        // send typing indicator
        await message.channel.sendTyping();

        // here we use nickname if there is one, otherwise we grab username
        let displayName = message.member ? (message.member.nickname ? message.member.nickname : message.author.username) : message.author.username;

        // if there's no record for this channel, initialize it with the instruction message 
        if (!client.globalState.conversations[message.channel.id]) {
            client.globalState.conversations[message.channel.id] = [
            {
              "role": "system",
              "content": prompts.dotty.message
            },
        ];
    }
 // push new user message into the ongoing convo
 client.globalState.conversations[message.channel.id].push({
    "role": "user",
    "content": `${displayName}: ${message.content}`
});

// clone the array in the channel's history so we don't alter the original while adding the system message
let messages = [...client.globalState.conversations[message.channel.id]];

        // check if those funny words r in the chat
        if (/dotty(bot)?/i.test(message.content)) {
       // if (message.content.includes('dottybot') || message.content.includes('dotty') || message.content.includes('Dotty') || message.content.includes('DOTTY') || message.content.includes('dotbot')) {
            messages.push({
                "role": "system",
                "content": prompts.dotty.message
            });
        }

        // hit up openai's fancy api
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 1.45,
            messages: messages
        });
        console.log("OpenAI API response:", response);

        // Ok then, let's send that message back to discord!
        await message.channel.send(`${response.data.choices[0].message.content}`);
        
         // store the assistant's message in the channel's conversation history
        client.globalState.conversations[message.channel.id].push({
            "role": "assistant",
            "content": `${response.data.choices[0].message.content}`
        });

    } catch (error) {
        console.error("oops got some errors: ", error);
    }
}

        // does the response actually exist? let's check
        /*if (response && response.data && response.data.choices && response.data.choices.length > 0) {
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
}  */

/////////////////////////////////////////////////////////////////
client.on('messageCreate', async (message) => {
    // Ignore messages sent by the bot
    if (message.author.bot) return;

    // If the message is bot_on, set botActive to true
    if(message.content === process.env.BOT_ON) {
        client.globalState.botActive = true;
        console.log("Bot is now active...let's do this!");
    }
    // if the message is bot_off, set botActive to false
    if(message.content === process.env.BOT_OFF) {
        client.globalState.botActive = false;
        console.log(botOffMessage)
    }

    // If the bot is not active, don't process other messages
    if (!client.globalState.botActive) {
        console.log(botOffMessage);
        return;
    }

    // Call the processMessage function without waiting for it to finish
    // If the message contains dotty or dottybot, or if autoReply is enabled
    if (/dotty(bot)?/i.test(message.content)  ||  client.globalState.autoReply[message.channel.id]) {
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
