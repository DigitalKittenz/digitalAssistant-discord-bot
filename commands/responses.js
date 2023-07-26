const { SlashCommandBuilder } = require("discord.js");

module.exports = { /*so it can be requred()*/
    data: new SlashCommandBuilder()
        .setName('hi!')
        .setDescription('Says Hi back!'),
    
    async execute(interaction){
        await interaction.reply('hii 🙂');
    },
        
};






