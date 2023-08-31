module.exports = {
    name : 'help',
    description: 'u have no idea how this bot works so now ur here',
    async execute(interaction, client) {
        try {
            await interaction.reply(`
    
    **====Commands====**
    \`/help\` - shows u this help menu lmao
    \`clear\` - wipes the convo history off the face of the earth... or at least this channel lol
    \`/botfact\` - cool fact of the day ;)
    \`/kitty\` - sends manul gifs - has OPTIONS
    
    ---kitty options---
    - manul - pallas cats
    - cartoon - cartoon kitties
    - wizard - wizard kitties
    - spotty - rusted spotted kitties
   
    btw, mention dottys name and she'll reply to u. 
    here are the equiv ! commands
    **!!!!!!!!!!!!!!!!**
    !help
    !clear
    !kitty
    !manul
    !cartoon
    !wizard
    !spotty


    `);
        } 
        catch (error) {
            console.error(error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};