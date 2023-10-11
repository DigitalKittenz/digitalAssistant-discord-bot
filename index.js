require('dotenv').config();
require('emoji-regex');
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
// getting a bunch of banned words.
const bannedWords = require('./bannedWords.js')

//requiring the logits file
const logits = require('./logits');

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


// setup openai
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// handle message events

client.globalState = {
    autoReply: false,
    botActive: true, //bot's state
    conversations: {} /* object to store chat histories per channel*/,
};

function cutLongMessage(messages, maxTokens = 4400) {
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
// hit up openais fancy api
        let aiRequest = openai.createChatCompletion({ // ok im literally putting values in here lmao
            model: 'gpt-3.5-turbo-0301',
            temperature: 1.985,
            top_p: 0.963,
            frequency_penalty: 1.8,
            n : 1,
            presence_penalty: 0.78,
            max_tokens: 800,
            logit_bias: logits.biases,
            messages: result.messages
        });

        //initialize stuff
        let attempts = 0;
        let response = await aiRequest;
        let cuteResponse = ["that was a lil bit too much for me u guys 。゜゜(´Ｏ`) ゜゜。", ];

        // (response.data.choices[0].message.content.match(bannedWords) && attempts < 8)
        for (attempts;response.data.choices[0].message.content.match(bannedWords) && attempts < 8; attempts++){
            response;
            // check if we gotta reset
            if (response.data.choices[0].message.content.match(bannedWords) && attempts >= 8) {
                console.log("resetting ig");
                // add the prompts back into the bots dumb brain
                result.messages = [{
                    "role": "system",
                    "content": prompts.dotty.message
                }, ...exampleConvo.exampleConvo,
                    {
                        "role" : "system",
                        "content" :"im rlly sorry dotty this is the system talkin but u malfunctioned and u have restarted due to a p sad glitch!!!! :("
                    }];
                message.reply("that was a lil bit too much for me u guys 。゜゜(´Ｏ`) ゜゜。");
               // Reset attempts
                attempts = 0;
                response;
            }
            }


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

// if the message contains 'dotty'/'dottybot' OR if autoReply is enabled, call processMessage
    if (/dotty(bot)?/i.test(message.content) || client.globalState.autoReply[message.channel.id] || /doty(bot)?/i.test(message.content)) {
        await processMessage(message);
    }

// clear with the !clear command and if botReset is true!!!
    if (message.content === '!clear' || client.globalState.botReset === true) {
        if (message.content === '!clear') {
            await message.reply('poof! convo history is gone!');
        }
        // clear convo and resend the prompts!
        client.globalState.conversations[message.channel.id] = [{
            "role": "system",
            "content": prompts.dotty.message
        },...exampleConvo.exampleConvo];
        client.globalState.botReset = false;

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
    console.log(`logged into discord as ${client.user.tag}!!!`);
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
        await kittyCmd.execute(interaction, client);
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
        await helpCmd.execute(interaction, client);
    } else {
        // if the command isn't 'hello' or one of the kitty types, ignore it
    }
});

// login with ur token
client.login(process.env.TOKEN).catch(err => console.error("Bot failed to login!", err));
