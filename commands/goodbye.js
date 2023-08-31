module.exports = {
    name: 'goodbye',
    description: 'Says goodbye',
    async execute(interaction, client) { // Add the async keyword here
        const options = [
            'byeee!!!',
            'take care!',
            'see you later!',
            'Catch you on the flip side! 🌟',
            'Toodaloo, darling! 🌸',
            'Take care! Sending virtual hugs your way! 🤗',
            'See ya later, alligator! 🐊',
            'luv u bestie but i gotta go now!',
            'going offline for a lil bit',
            'going offline!',
            'Smell ya later, potater! 🥔',
            'Have a fabulous day, rockstar! 🎸',
            'May unicorns and rainbows guide your path until we meet again! 🦄🌈',
            'until next time!',
            'lets catch up soon!',
            'sending positive vibes your way!',
            'byeee stay awesome tho!',
            'biii! lots of good vibes from me!',
            'farewell, my friend!',
            'Stay fab, my friend! Chat with you soon! Buh-bye for now! 🌈✨'
        ];

        try {
            interaction.reply(options[Math.floor(Math.random() * options.length)]);
            // check if interaction.channel and interaction.channel.id are defined
            if (interaction.channel && interaction.channel.id) {
                client.globalState.autoReply[interaction.channel.id] = false;
            } else {
                console.error('interaction.channel or interaction.channel.id is undefined!');
            }
        } catch (error) {
            console.error('Failed to reply to interaction:', error);
        }
    }
};