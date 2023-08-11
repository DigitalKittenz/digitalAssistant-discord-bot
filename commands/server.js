module.exports = {
    name: 'server',
    description: 'displays server info',
    async execute(interaction, client) { // Add the async keyword and client parameter here
        const specialPhrase = process.env.SPECIAL_PHRASE; // Change this to whatever you want

        if (interaction.options.getString('message').includes(specialPhrase)) {
            client.globalState.botActive = !client.globalState.botActive;
            await interaction.reply(`Bot activity toggled. Current state: ${client.globalState.botActive ? "Active" : "Inactive"}`);
        } else {
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        }
    },
};