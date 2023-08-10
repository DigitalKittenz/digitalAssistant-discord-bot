const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [
    {
        name: 'hello',
        description: 'Says hello!'
    },
    {
        name: 'goodbye',
        description: 'says goodbye!'
    },
    {
        name: 'manul',
        description: 'Shows a manul pic',

    },
    {
        name: 'botfact',
        description: 'Tells a random fact!'
    },
    {
        name: 'server',
        description: 'displays server info'
    }

];

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started reloading slash commands.');
        await rest.put(Routes.applicationCommands(process.env.APP_ID), {
            body: commands,
        });

        console.log('Successfully reloaded slash commands');
    } catch (error) {
        console.error(error);
    }
})();
