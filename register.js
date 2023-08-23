// this lil guy lets us chat with discord's REST API
const { REST } = require('@discordjs/rest');

//whip up the URLs for the API endpoints
const { Routes } = require('discord-api-types/v9');

// define our commands! each command is a cute lil object with a name and a description
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
name: 'clearConvo',
description: 'wipes the convo history off the face of the earth... or at least this channel lol'
},
{
name: 'botfact',
description: 'Tells a random fact!'
},
{
name: 'server',
description: 'displays server info',
},
{
name: 'help',
description: 'gives u help'
}

];

// new REST object! we're telling it to use version '9' and we're giving it our bot's secret token
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);


// this function that doesn't wait around, it gets to work as soon as it's defined
(async () => {
    try {
        // let's tell the world we're gettin started with reloadin slash commands
        console.log('Started reloading slash commands.');

        // knocking on discord's door and handin over our commands
        await rest.put(Routes.applicationCommands(process.env.APP_ID), {
            body: commands,
        });

        // if everything went well, we'll print a lil success message
        console.log('Successfully reloaded slash commands');
    } catch (error) {
        // oh no! if something went wrong, we'll print the error so we can figure out what it is
        console.error(error);
    }
})();