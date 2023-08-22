module.exports = {
    name: 'clearConvo',
    description: 'wipes the convo history off the face of the earth... or at least this channel lol',
    async execute(interaction, client) {
        // snatching the channel id from the interaction
        const channelId = interaction.channelId;
        
        // doin a lil check to see if there's any convo history for this channel
        if (!client.globalState.conversations[channelId]) {
            await interaction.reply('nothin to clear here, this channel is as clean as a whistle!');
            return;
        }

        // poof! there goes the convo history
        client.globalState.conversations[channelId] = [];

        // sendin a lil confirmation message to let u know it's done
        await interaction.reply('convo history is gonezo!');
    },
};