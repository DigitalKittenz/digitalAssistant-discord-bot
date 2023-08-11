module.exports = {
    name: 'server',
    description: 'displays server info',
    async execute(interaction, client) {
        const specialPhrase = process.env.SPECIAL_PHRASE;

        if (interaction.options.getNumber('message') == specialPhrase) {
            client.globalState.botActive = !client.globalState.botActive;
            await interaction.reply(`Bot activity toggled. Current state: ${client.globalState.botActive ? "Active" : "Inactive"}`);
        } else {
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        }
    },
};