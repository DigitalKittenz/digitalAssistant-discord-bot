
module.exports = {
    name: 'server',
    description: 'displays some server info',
    async execute(interaction) {
        const server = interaction.guild;
        const serverCreatedDate = new Date(server.createdTimestamp).toDateString();
        const owner = server.owner ? server.owner.user.username : "Owner not found :(";
        const roleCount = server.roles.cache.size;
        const textChannelCount = server.channels.cache.filter(c => c.type === 'GUILD_TEXT').size;
        const voiceChannelCount = server.channels.cache.filter(c => c.type === 'GUILD_VOICE').size;
        const region = server.region;

        const boostLevel = server.premiumTier;
        const boostCount = server.premiumSubscriptionCount;

        await interaction.reply(`Server name: ${server.name}\n` +
            `Server owner: ${owner}\n` +
            `Created on: ${serverCreatedDate}\n` +
            `Total members: ${server.memberCount}\n` +
            `Roles: ${roleCount}\n` +
            `Text Channels: ${textChannelCount}\n` +
            `Voice Channels: ${voiceChannelCount}\n` +
            `Region: ${region}\n` +
            `Boost Level: ${boostLevel}\n` +
            `Boost Count: ${boostCount}`
        );
    },
};
