module.exports = {
    name: 'kitty',
    description: 'Shows a kitty pic',
    async execute(interaction, client) {
        // get the options from the interaction
        const type = interaction.options.getString('type');

        // now u got the type of kitty they want, so u can do different stuff depending on the type
        if (type === 'manul') {
            // do something for manul kitties here
            interaction.reply('here\'s a cute manul kitty for ya! :3');
        } else if (type === 'cartoon') {
            // do something for cartoon kitties here
            interaction.reply('check out this rad cartoon kitty!');
        } else if (type === 'wizard') {
            // do something for wizard kitties here
            interaction.reply('omg wizard kitties are the best!!');
        } else if (type === 'spotty kitty') {
            // do something for spotty kitties here
            interaction.reply('spotty kitties are so chic, rite??');
        } else if (type === 'meow') {
            // do something for meow here
            interaction.reply('meow!!');
        } else {
            // if they didn't specify a type or gave an unknown type, just give them a random kitty
            interaction.reply('here\'s a random kitty for ya!');
        }
    },
};