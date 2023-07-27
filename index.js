// reload discord client
const { CLient, Intents } = require('discord.js');
const client = new CLient({ intents: [Intents.FLAGS.GUILDS] });
// intents is needed to register a client apparently?

// listen and see when connected
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// okay commands now. this is an array of stuff

const options = [
    'hiii <3',
    'i`m not a bot, swear 🤞',
    'hey whats up? r u gonna do something or just say hi to me lol',
    'thats kinda a boring thing to say tbh, hi anyways tho. but maybe i`m just bored 😔',
    '😊👋',
    'hello!',
];

// listen to intereactions and fire an event 🔥
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'hello'){

        // randomize the response
         await interaction.reply(
            options[Math.floor(Math.random() * options.length)]
);}});
// call login command with the bot token
client.login(process.env.TOKEN);