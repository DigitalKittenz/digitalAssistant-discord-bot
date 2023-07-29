// hello.js
module.exports = {
    name: 'hello',
    description: 'Says hello!',
    async execute(interaction) {
        const options = [
            'hiii <3',
            'hii. i‛m not a bot, btw. swear 🤞',
            'hey whats up? r u gonna do something or just say hi to me lol',
            'i‛m bored 😔',
            '😊👋',
            'hello!',
            'da bot? more like, daring and awesome bot, am i right? right guys? guys? 😢 where is everyone?',
            'heya! i‛m totally not a bot, btw, swear! i have crippling self-doubt just like you!',
        ];
        await interaction.followUp(options[Math.floor(Math.random() * options.length)]);
    }
};
