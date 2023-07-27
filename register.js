const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [
{
    name: 'hello',
    description: 'Says hello!'
},
];

const rest = new REST({version:'9'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started reloading slash commands.');
        await rest.put(Routes.applicationCommands(process.env.APP_ID), {
            body: commands,
        });
    
    console.log('successfully reloaded slash commands');
    } catch (error) {
        console.error(error);
    }
})();