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
            }, ];
        }
        // push new user message into the ongoing convo
        client.globalState.conversations[message.channel.id].push({
            "role": "user",
            "content": `${displayName}: ${message.content}`
        });
        // counting the messages here (counting the array);
        function cutLongMessage(messages, maxWords = 3000) {
            let totalWordCount = 0; // keep track of the total words
            messages.forEach(message => {
                let content = message.content;
                let wordCount = content.split(" ").length;
                totalWordCount += wordCount; // add the words in this message to the total
            });
            // if we're over the limit, gotta trim it down
            while (totalWordCount > maxWords) {
                // let's not be hasty and chop off prompts, now
                if (messages[0].role !== "system") {
                    let content = messages[0].content;
                    let wordCount = content.split(" ").length;
                    totalWordCount -= wordCount; // we've snipped it out so subtract it from the total
                    messages.shift(); // off with the first message's head!
                } else {
                    break; // hit a prompt, stop the trimming!
                }
            }
        
            // returning the cleaned up messages and the word count
            return {messages, wordCount: totalWordCount}; 
        }

        // clone the array in the channel's history so we don't alter the original while adding the system message
        let messages = [...client.globalState.conversations[message.channel.id]];
        let result = cutLongMessage(messages);
        messages = result.messages;  // now we got our nice and trimmed messages
        wordCount = result.wordCount; // and the final total. nice and tidy.
        console.log(wordCount);
        // hit up openai's fancy api
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo-0301',
            temperature: 1.25,
            messages: messages
        });
        // Ok then, let's send that message back to discord!
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

client.on('messageCreate', async(message) => {
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

client.on('interactionCreate', async(interaction) => {
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