// hello.js
module.exports = {
    name: 'hello',
    description: 'Says hello and turns on automatic replies',
    execute(interaction) {
        // randomize the response
        const options = [
            'hiii <3',
            'do u wanna chat w me? 🥹',
            'hii. i‛m not a bot, btw. swear 🤞',
            'hey whats up? r u gonna do something or just say hi to me lol',
            'i‛m bored 😔',
            '😊👋',
            'hello! :D',
            'hope ur doing well today friend 😁',
            'da bot? more like, daring and awesome bot, am i right? right guys? guys? 😢 where is everyone?',
            'heya! i‛m totally not a bot, btw, swear! i have crippling self-doubt just like you!',
        ];
        interaction.reply(options[Math.floor(Math.random() * options.length)]);
        
        // Set the autoReply state to true
        client.globalState.autoReply = true;
    }
};