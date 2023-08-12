module.exports = {
    name: 'server',
    description: 'displays server info',
    async execute(interaction, client) {
        try {
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        }
        catch (error) {
            console.error(error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};
