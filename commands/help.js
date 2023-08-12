module.exports = {
    name : 'help',
    description: 'u have no idea how this bot works so now ur here',
    async execute(interaction, client) {
        try {
            await interaction.reply(`
    **Commands**
    \`/help\` - shows u this help menu lmao
    \`/hello\` - start a conversation! this turns on AUTOREPLY!
    \`/goodbye\` - ends a conversation, turns off autoreplyin
    \`/botfact\` - cool fact of the day ;)
    \`/manul\` - sends manul gifs
   
    btw, u can mention dottys name and she'll reply to u. BUT autoreply IS OFF!
    so use \`/hello\` for a proper convo!
    `);
        } 
        catch (error) {
            console.error(error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};