// reload discord client
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// intents are needed to register a client, apparently?

// listen and see when connected
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// okay commands now. this is an array of stuff
const options = [
    'hiii <3',
    'hii. i‛m not a bot, btw. swear 🤞',
    'hey whats up? r u gonna do something or just say hi to me lol',
    'i‛m bored 😔',
    '😊👋',
    'hello!',
    'da bot? more like, daring and awesome bot, am i right? right guys? guys? 😢 where is everyone?',
    'heya! i‛m totally not a bot, btw, swear! i have crippling self-doubt just like you!',
];

// listen to interactions and fire an event 🔥
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'hello') {
        // randomize the response
        await interaction.reply(
            options[Math.floor(Math.random() * options.length)]
        );
    } else if (interaction.commandName === 'manul') {
        // define a list of manul pics
        const pics = [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExenJkMGw5Ymd3bnI1cW1qd2NvZ3k2bGZiamw0bmpsbTR4M2piZWIzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F0ZriKBdzZjnARVTeM/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmhzeW03dmV6czM0Ymp5bmRjcjM2aWl4bnNxbzlsMzZkaWRoc3I1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L4G60Ewtdoem4/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGZ4M3dwc2NoMXdxd2ltOGR3MHlxcDYyd2Y2Y3JsZGVqdDg1bzkxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YL8quuOin5E7C/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTVoZW85b3lwajhtY2tpYjA4N20xeWJ0eWh2OHAyeGt2N3NobXlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/K8l4eiS88UvWU/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2U5c2piNG1odWJ2cTBycm9xcXA5Y2ZkOXN0eDNrcHN3NXY0Z2lnaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12fjBkQf5CV596/giphy.gif'
        ];

        // choose a random manul pic
        const pic = pics[Math.floor(Math.random() * pics.length)];

        // send a response with the manul pic
        await interaction.reply(`here's a manul pic for u <3: ${pic}`);
    }
});

// call login command with the bot token
client.login(process.env.TOKEN);
