module.exports = {
    //* you could totally edit this 1 l8r 4 the dumb bday thing *//
    name: 'server',
    description: 'displays server info',
    async execute(interaction, client) {
        try {
            const specialPhrase = process.env.SPECIAL_PHRASE;

            if (interaction.options.getNumber('validate') == specialPhrase) {
                client.globalState.botActive = !client.globalState.botActive;
                await interaction.reply(`Bot activity toggled. Current state: ${client.globalState.botActive ? "Active" : "Inactive"}`);
            } else {
                await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};