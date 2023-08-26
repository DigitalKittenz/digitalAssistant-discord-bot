require('dotenv').config();
const emojiRegex = require('emoji-regex');

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
// here we load up those juicy prompts files
const prompts = require('./prompts/prompts');
const  exampleConvo  = require('./prompts/ConvoPrompt');

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
const botOnMessage = "Bot is now active...let's do this!"
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
    botReset: false,
    conversations: {} /* object to store chat histories per channel*/,
};

function cutLongMessage(messages, maxTokens = 5000) {
    // this will very roughly estimate the token count
    function countTokens(content) {
        if (content === undefined) {
            console.log('content is undefined!');
            return 0;
        }
        return content.split(/\s+/).length + content.length / 6;
    }

    let totalTokenCount = 0;
    for (let message of messages) {
        if (message.content === undefined) {
            console.log('message without content: ', message);
            continue;
        }
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
            },
            ...exampleConvo.exampleConvo];
        }

// function to catch unclean input -- api can't handle spamming nonconforming characters!
function sanitizeMessage(message) {
    // match all emojis
    let emojis = message.match(emojiRegex());
    // remove anything that ain't an emoji or a regular text character
    let sanitized = message.replace(/[^a-zA-Z0-9\s\.\,\!\?\:\;\-\_\+\=\*\(\)\[\]\{\}\"\'\#\$\%\&\<\>\@\~\`\^\|\\\/]+/g, '');
    // add the emojis back in
    if (emojis) {
        for (let emoji of emojis) {
            sanitized += ' ' + emoji;
        }
    }
    return sanitized;
}

// clone the array in the channel's history so we don't alter the original while adding the system message
let messages = [...client.globalState.conversations[message.channel.id]];

// add new message
let sanitizedContent = sanitizeMessage(`${displayName}: ${message.content}`);

// trim down old convo before adding new message
let result = cutLongMessage(messages, 5000); // leave some room for the bots message!

// add new message
result.messages.push({
    "role": "user",
    "content": sanitizedContent
});

// update the convos with trimmed messages and the new user message
client.globalState.conversations[message.channel.id] = result.messages;

//requiring the logits file
const logits = require('./logits');
// hit up openai's fancy api
const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0301',
    temperature: 1.96, //randomness
    top_p: 0.90, // output filter! only lets % of whats considered out!
    frequency_penalty: 1.73, // penalizes common responses
    presence_penalty: 0.82, /* penalizes irrelevant responses (to the topic ykno)*/
    logit_bias: logits.biases, // token bias
    messages: result.messages
});

// Ok then, let's send that message back to discord!
    await sendLongMessage(message.channel, `${response.data.choices[0].message.content}`);
        // store the bots message in the channel's conversation history
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
        console.log(botOnMessage);
        // reply with bot on message!
        await message.reply(botOnMessage);
    }
    // if the message is bot_off, set botActive to false
    if (message.content === process.env.BOT_OFF) {
        client.globalState.botActive = false;
        console.log(botOffMessage);
        // reply with bot off message!
        await message.reply(botOffMessage);
    }
    // If the bot is not active, don't process other messages
    if (!client.globalState.botActive) {
        return;
    }
    // Call the processMessage function without waiting for it to finish
    // If the message contains dotty or dottybot, or if autoReply is enabled!
    if (/dotty(bot)?/i.test(message.content) || client.globalState.autoReply[message.channel.id] || /doty(bot)?/i.test(message.content)) {
        processMessage(message);
    }
    if (message.content === '!clear' || client.globalState.botReset === true) {
        if (message.content === '!clear') {
            message.reply('poof! convo history is gone!');
        }
        client.globalState.conversations[message.channel.id] = [{
            "role": "system",
            "content": prompts.dotty.message
        },
        ...exampleConvo.exampleConvo];
        client.globalState.botReset = false;
        return;
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
    console.log(`logged into discord as ${client.user.tag}!`);
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
