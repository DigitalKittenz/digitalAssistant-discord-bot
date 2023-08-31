// this lil guy lets us chat with discord's REST API
const { REST } = require('@discordjs/rest');

//whip up the URLs for the API endpoints
const { Routes } = require('discord-api-types/v9');

// define our commands! each command is a cute lil object with a name and a description
const commands = [
{
    name: 'kitty',
    description: 'Shows a kitty pic',
    options: [
      {
        name: 'type',
        description: 'The type of kitty u want',
        type: 3,
        required: false,
        choices: [
          {
            name: 'Manul',
            value: 'manul',
          },
          {
            name: 'cartoon',
            value: 'cartoon'
          },
          {
           name: 'wizard',
           value: 'wizard'
          },
          {
            name: 'spotty',
            value: 'spotty'
          },
          {
            name: 'meow',
            value: 'meow'
          }
        ],
      },
    ],
  },
{
name: 'botfact',
description: 'Tells a random fact!'
},
{
name: 'help',
description: 'gives u help'
},
];

// our shiny new discord rest api! we're cool with version '9' and we're passing it our bot's super secret token
const discordRestPal = new REST({ version: '9' }).setToken(process.env.TOKEN);

// this function isn't gonna wait around for an invitation, it's gonna get the party started asap!
(async () => {
    try {
        // let everyone know we're starting with a slash command reload
        console.log('getting this slash command reload party started!');

        // time to knock on discord's door and hand over our fresh batch of commands
        await discordRestPal.put(Routes.applicationCommands(process.env.APP_ID), {
            body: commands,
        });

        // if all went well, success message!
        console.log('woohoo! slash commands reloaded successfully!');
    } catch (error) {
        // dang, something went wrong!
        console.error(error);
    }
})();

/*
SUB_COMMAND 1   
SUB_COMMAND_GROUP 2 
STRING 3    
INTEGER 4
BOOLEAN 5   
USER 6  
CHANNEL 7
ROLE 8  
MENTIONABLE 9
NUMBER 10
ATTACHMENT 11
*/