module.exports = {
		name: 'server',
		description: 'displays server info',
		execute(interaction){

		interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};
