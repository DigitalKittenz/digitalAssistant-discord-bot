const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [
{
    name: 'hello',
    description: 'Says hello!'
},

{
    name: 'manul',
    description: 'shows a manul pic',
    options: [
        {
            name: 'random',
            type: 'BOOLEAN',
            description: 'whether 2 show a random manul pic or not',
            required: false
        }
    ]
}


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