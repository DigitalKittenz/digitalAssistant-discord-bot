
// referencing the prompts files
const prompts = require('../prompts/prompts');
const  exampleConvo  = require('../prompts/ConvoPrompt');

module.exports = {
    name: 'clearconvo',
    description: 'wipes the convo history off the face of the earth... or at least this channel lol',
    async execute(interaction, client) {


        // snatching the channel id from the interaction
        const channelId = interaction.channelId;
        
        // doing a lil check to see if there's any convo history for this channel
        if (!client.globalState.conversations[channelId]) {
            await interaction.reply('nothing to clear here, this channel is as clean as a whistle!');
            return;
        }

        // poof! there goes the convo history
        client.globalState.conversations[channelId] = [];

        //add prompt back in!
        client.globalState.conversations[channelId] = [{
            "role": "system",
            "content": prompts.dotty.message
        },
        {...exampleConvo}]

        // sending a lil confirmation message to let u know it's done
        await interaction.reply('poof! convo history is gone!');
    },
};