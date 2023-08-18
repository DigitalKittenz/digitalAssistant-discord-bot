require('dotenv').config();

const {
    Client,
    Collection,
    GatewayIntentBits
} = require('discord.js');
const {
    Configuration,
    OpenAIApi
} = require('openai');
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
    botActive: true, //bot's state
    conversations: {} // object to store chat histories per channel
};

function cutLongMessage(messages, maxTokens = 3200) {
    // this will very roughly estimate the token count
    function countTokens(content) {
        return content.split(/\s+/).length + content.length / 6;
    }

    let totalTokenCount = 0;
    for (let message of messages) {
        let tokenCount = countTokens(message.content);
        totalTokenCount += tokenCount;
    }

    // if we're over the limit, remove the oldest user messages to get back in limit
    while (totalTokenCount > maxTokens) {
        let foundNonSystemMessage = false;
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].role !== "system") {
                let tokenCount = countTokens(messages[i].content);
                totalTokenCount -= tokenCount;
                messages.splice(i, 1);
                foundNonSystemMessage = true;
                break;
            }
        }
        if (!foundNonSystemMessage) {
            break;
        }
    }
    console.log('total tokens: ', totalTokenCount);
    return {
        messages,
        tokenCount: totalTokenCount
    };
}

async function processMessage(message) {
    try {
        // send typing indicator
        await message.channel.sendTyping();
        // here we use nickname if there is one, otherwise we grab username
        let displayName = message.member ? (message.member.nickname ? message.member.nickname : message.author.username) : message.author.username;
        // if there's no record for this channel, initialize it with the instruction message 
        if (!client.globalState.conversations[message.channel.id]) {
            client.globalState.conversations[message.channel.id] = [{
                "role": "system",
                "content": prompts.dotty.message
            }];
        }
// clone the array in the channel's history so we don't alter the original while adding the system message
let messages = [...client.globalState.conversations[message.channel.id]];

// trim down old convo before adding new message
let result = cutLongMessage(messages, 3500); // leave some room for the assistant's message!

// add new message
result.messages.push({
    "role": "user",
    "content": `${displayName}: ${message.content}`
});

//console.log(result)

// update the convos with trimmed messages and the new user message
client.globalState.conversations[message.channel.id] = result.messages;

// hit up openai's fancy api
const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0301',
    temperature: 2,
    top_p: 0.9,
    frequency_penalty: 1,
    presence_penalty: 0.6,
    messages: result.messages
});
console.log(response);

// log the response
//console.log(response);


        // Ok then, let's send that message back to discord!
        await sendLongMessage(message.channel, `${response.data.choices[0].message.content}`);

        // store the assistant's message in the channel's conversation history
        client.globalState.conversations[message.channel.id].push({
            "role": "assistant",
            "content": `${response.data.choices[0].message.content}`
        });
    } catch (error) {
        console.error("oops got some errors: ", error);
    }
}

client.on('messageCreate', async (message) => {
    // Ignore messages sent by the bot
    if (message.author.bot) return;
    // If the message is bot_on, set botActive to true
    if (message.content === process.env.BOT_ON) {
        client.globalState.botActive = true;
        console.log("Bot is now active...let's do this!");
    }
    // if the message is bot_off, set botActive to false
    if (message.content === process.env.BOT_OFF) {
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
    if (/dotty(bot)?/i.test(message.content) || client.globalState.autoReply[message.channel.id]) {
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
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});
client.login(process.env.TOKEN);