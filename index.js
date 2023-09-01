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
const globalState = 
client.globalState = {
    autoReply: false,
    botActive: true, //bot's state
    conversations: {} /* object to store chat histories per channel*/,
};


globalState;

function cutLongMessage(messages, maxTokens = 4700) {
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
        for (let i = 6; i < messages.length; i++) {
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
    //console.log(messages);
    return {
        messages,
        tokenCount: totalTokenCount
        
    };
}
// for sending long messages
async function sendLongMessage(channel, message) {
    const parts = message.match(/[\s\S]{1,2000}/g) || [];

    for (const part of parts) {
        await channel.send(part);
        // wait a bit between message parts
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function processMessage(message) {
    console.log("message is processing!", message.content);
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


// clone the array in the channel's history so we don't alter the original while adding the system message
let messages = [...client.globalState.conversations[message.channel.id]];

// add new message
let userMessages = `${displayName}: ${message.content}`;

// trim down old convo before adding new message
let result = cutLongMessage(messages); // leave some room for the bots message!

// add new message
result.messages.push({
    "role": "user",
    "content": userMessages
});

// update the convos with trimmed messages and the new user message
client.globalState.conversations[message.channel.id] = result.messages;
//console.log(result.messages);

//requiring the logits file
const logits = require('./logits');

// hit up openai's fancy api
let response
//console.log(response, "first");

// getting a bunch of banned words. 
const bannedWords =  new RegExp([
    'furthermore',
    "nonetheless",
    "sorry if I gave you the impression",
    "sorry if I gave you that impression",
    "designed to",
    "remember,",
    "it's important to",
    "thus",
    "let me know",
    "to note",
    "moreover",
    "hence",
    "correspondingly",
    "retrospect",
    "assist",
    "convey",
    "accordingly",
    "additionally",
    "subsequently",
    "clarify",
    "help",
    "absolutely",
    "in addition",
    "mentioned",
    "additional",
    "priority",
    "cannot",
    "apologize",
    "simply",
    "feel free",
    "however",
    "natural language processing ",
    "certainly",
    "simulate",
    "unfortunately",
    "regarding",
    "artificial intelligence",
    "proceed",
    "cannot",
    "nevertheless",
    "tapestry",
    "wouldn't have it any other way",
    "remember",
    "esteemed",
    "language model",
    "confusion",
    "assure",
    "it's important to note",
    "please",
    "As a bot",
    "As Dotty",
    "As Dottybot",
    "but I can't help",
    "crucial",
    "employ",
    "in addition",
    "apologies",
    "apologies for the confusion",
    "certainly",
    "ultimately",
    "what can I do for you",
    "is there anything on your mind",
    "specific",
    "overall",
    "is there anything else you’d like to talk about",
    "summary",
    "essentially",
    "regardless",
    "as an AI language model",
    "i don't have feelings",
    "simulate feelings",
    "programmed to",
    "are programmed into me",
    "I'm programmed to",
    "I am not programmed to",
    "Is there anything else you need help with",
    "I have virtualized feelings",
    "running smoothly",
    "I'm functioning",
    "As a chatbot",
    "Is there anything in particular you'd like to",
    "Let's move on",
    "I am designed for",
    "Is there anything in particular",
    "I apologize if",
    "programmed me",
    "I am capable of",
    "anything in particular",
    "as an AI chatbot",
    "is there anything else",
    "I am functioning ",
    " I am programmed to understand ",
    "I am not able to experience feelings",
    "I am capable of understanding",
    "I am not capable of understanding",
    "What would you like to discuss?", 
    "my programming is functioning normally",
    "I don't have any physical",
    "I don't have physical"
].join('|'), 'i'); //join with | and make case insensitive with i

const aiRequest = openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0301',
    temperature: 1.955,
    top_p: 0.96,
    frequency_penalty: 1.8,
    n : 1,
    presence_penalty: 0.78,
    logit_bias: logits.biases,
    messages: result.messages
});

// hit up openais fancy api
let attempts = 0;
do {    
    await aiRequest;
    response =  await aiRequest;
    
    attempts++;
    // if after 10 attempts we're still not getting what we want, reset the messages array!!!!
    if ((response.data.choices[0].message.content.match(bannedWords)) && attempts >= 6) {
        console.log("resetting messages...");
        //restarting message!!
        await message.reply("Glitch!!! Restarting!!");
        result.messages = [{
            "role": "system",
            "content": prompts.dotty.message
        }, ...exampleConvo.exampleConvo,
        {
            "role" : "system",
            "content" :"im rlly sorry dotty this is the system talkin but u malfunctioned and u have restarted due to a p sad glitch!!!! :("
        }];
          // get bot's response after restart
          await aiRequest;
    console.log(result.messages);
        attempts = 0; // reset attempts count as well
    }
} while ((response.data.choices[0].message.content.match(bannedWords)) && attempts < 6);
console.log(attempts);

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
};


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

// if the message contains 'dotty'/'dottybot' OR if autoReply is enabled, call processMessage
if (/dotty(bot)?/i.test(message.content) || client.globalState.autoReply[message.channel.id] || /doty(bot)?/i.test(message.content)) {
     processMessage(message);
}

// clear with the !clear command and if botReset is true!!!
    if (message.content === '!clear' || client.globalState.botReset === true) {
        if (message.content === '!clear') {
            message.reply('poof! convo history is gone!');
        }
        // clear convo and resend the prompts!
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
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

// import the commands
const kittyCmd = require('./commands/kitty'); // point to kitty.js file
const botFactCmd = require('./commands/botfact'); // point to botfact.js file
const helpCmd = require('./commands/help'); // point to help.js file

// message events
client.on('messageCreate', async (message) => {
    // ignore messages not starting with "!"
    if (!message.content.startsWith('!')) return;

    // split the message into command and args
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // map the command to the right kitty type
    const kittyType = {
        'kitty': 'kitty',
        'manul': 'manul',
        'cartoon': 'cartoon',
        'wizard': 'wizard',
        'spotty': 'spotty',
        'meow': 'meow'
    }[command];

    if (kittyType) {
        // create a mock interaction object with the right options
        const interaction = {
            channel: message.channel,
            options: {
                getString: () => kittyType,
            },
            reply: (content) => {
                // Set the autoReply state to false
                client.globalState.autoReply[message.channel.id] = false;
                // Then send the message
                return message.channel.send(content);
            },
        };

        // execute the kitty command
        kittyCmd.execute(interaction, client);
    } else if (command === 'botfact') {
        // create a mock interaction object for the botfact command
        const interaction = {
            channelId: message.channel.id,
            reply: (content) => {
                // Set the autoReply state to false
                client.globalState.autoReply[message.channel.id] = false;
                // Then send the message
                return message.channel.send(content);
            },
        };

        // execute the botfact command
        botFactCmd.execute(interaction, client);
    } else if (command === 'help') {
        // create a mock interaction object 4 help command. 
        const interaction = {
            channelId: message.channel.id,
            reply: (content) => {
                client.globalState.autoReply[message.channel.id] = false;
                // then send a message
                return message.channel.send(content);
            },
        };

        // execute the help command
        helpCmd.execute(interaction, client);
    } else {
        // if the command isn't 'hello' or one of the kitty types, ignore it
    }
}); 

// login with ur token
client.login(process.env.TOKEN);