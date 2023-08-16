require('dotenv').config(); // pulls in environmental variables
const { Client, Collection, GatewayIntentBits } = require('discord.js'); // picks out the bits u need from discord.js
const { Configuration, OpenAIApi } = require('openai'); // same goes for openai
const fs = require('fs');
// here we load up that juicy prompts file
const prompts = require('./prompts'); // file system, for reading files


// setting up the discord client with various permissions
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

// function for sending long messages coz discord has a character limit
async function sendLongMessage(channel, message) {
    const parts = message.match(/[\s\S]{1,2000}/g) || [];

    for (const part of parts) {
        await channel.send(part);
        // wait a bit between message parts
        await new Promise(resolve => setTimeout(resolve, 1000)); // nice lil pause between parts
    }
}

// setting up the openai api
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// global state for the bot to keep track of various bits 
client.globalState = {
    autoReply: {},
    botActive: true,  //bot's state
    conversations: {} // store chat histories per channel so the bot can maintain context
};

//processing incoming messages 
async function processMessage(message) {
    try {
        // send typing indicator, coz bot manners
        await message.channel.sendTyping();  
        // here we use nickname if there is one, otherwise we grab username
        let displayName = message.member ? (message.member.nickname ? message.member.nickname : message.author.username) : message.author.username;
        // if there's no convo history for this channel, start it off with the bot's instruction message
        if (!client.globalState.conversations[message.channel.id]) {
            client.globalState.conversations[message.channel.id] = [
            {
              "role": "system",
              "content": prompts.dotty.message
            },
        ];
    }

 // adding new user message into ongoing convo
 let userContent = `${displayName}: ${message.content}`
 client.globalState.conversations[message.channel.id].push({
    "role": "user",
    "content": userContent
});

 // if the user says 'dotty' or 'dottybot', add the bot's instructions to the messages array
let messages = [...client.globalState.conversations[message.channel.id]];

        // check if those funny words r in the chat
        if (/dotty(bot)?/i.test(message.content)) {
            messages.push({
                "role": "system",
                "content": prompts.dotty.message
            });
        }

        // hit up openai's fancy api
        const response = await openai.createChatCompletion({
           // model: 'gpt-3.5-turbo',
            model: 'gpt-3.5-turbo-0301',
            temperature: 1.3,
            messages: messages
        });
        // logging the openai api response 4 errors n stuff
        console.log("OpenAI API response:", response);

 // Ok then, let's send that message back to discord!
const botResponse = response.data.choices[0].message.content;
if (botResponse.length > 2000) {
    await sendLongMessage(message.channel, botResponse);
} else {
    await message.channel.send(botResponse);
}

// saving the bot's response in this channel's conversation history
client.globalState.conversations[message.channel.id].push({
    "role": "assistant",
    "content": botResponse
});

// we gotta keep count of total tokens too coz if we hit 4000 we start dropping the old ones
// shoving the countTokens thing up here. 

function countTokens(messageContent) {
    // split the message content into words
    const words = messageContent.split(' ');
    // return the number of words as an approximation of the number of tokens
    return words.length;
}

let totalTokens = 0;
for (let i = 0; i < client.globalState.conversations[message.channel.id].length; i++){
    const messageContent = client.globalState.conversations[message.channel.id][i].content;
    // count tokens (attempt to)
    const tokensInMessage = countTokens(messageContent); // u need to define this function tho!
    totalTokens += tokensInMessage;
    // if the total token count exceeds the limit, cut the convo a bit
    if (totalTokens >= 2000) {
        client.globalState.conversations[message.channel.id] = client.globalState.conversations[message.channel.id].slice(i);
        break;
    }
}

    } catch (error) {
        console.error("oops got some errors: ", error);
    }
}

// event handler for when a new message is sent in any discord server the bot is linked to
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
    // add the command to the client's collection of commands
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

// start up the bot
client.login(process.env.TOKEN);
