module.exports = {
    name: 'clearconvo',
    description: 'wipes the convo history off the face of the earth... or at least this channel lol',
    async execute(interaction, client) {
        client.globalState.botReset = true;
        interaction.reply('poof! convo history is gone!');
    },
};