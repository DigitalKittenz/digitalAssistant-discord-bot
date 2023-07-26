const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hi!')
        .setDescription('Says Hi back!'),
    
    async execute(interaction){
        await interaction.reply('hii 🙂');
    },
        
};






