// manul.js
module.exports = {
    name: 'manul',
    description: 'Shows a manul pic',
    execute(interaction) {
        // define a list of manul pics
        const pics = [
            'https://tenor.com/view/pallas-cat-cat-cute-cat-cute-pallas-cat-dirk-gif-24844897',
            'https://tenor.com/view/manul-pallas-cat-manul-cat-gif-26136860',
            'https://tenor.com/view/pallas-pallas-cat-manul-cat-gif-20906933',
            'https://tenor.com/view/pallas-cat-what-huh-gif-14070902',
            'https://tenor.com/view/cat-gif-6071885',
            'https://tenor.com/view/manul-pallas-cat-rolling-cuddle-cuddle-roll-gif-26410302',
            'https://tenor.com/view/manul-pallas-cat-manul-cat-gif-26136867',
            'https://tenor.com/view/manul-pallas-cat-manul-cat-gif-26136862',
            'https://tenor.com/view/manul-lazy-lazy-manul-sleep-gif-26516029',
            'https://tenor.com/view/manul-cat-generator-manul-generator-pallas-cat-gif-20710027',
            'https://tenor.com/view/cat-scritch-scratch-gif-23659187',
            'https://tenor.com/view/pallas-cat-manul-cat-pallas-gif-20906931',
            'https://tenor.com/view/cute-cat-cat-cute-manul-pallas-gif-21607843',
            'https://tenor.com/view/manul-pallas-cat-manuel-ruben-slikk-cute-gif-24948033',
            'https://tenor.com/view/manul-pallas-cat-kemo-curious-listen-gif-26411455',
            'https://tenor.com/view/cat-manul-snow-pallas-cat-turn-around-gif-24714377',
            'https://tenor.com/view/manul-pallas-cat-manul-cat-gif-26136861',
            'https://tenor.com/view/cat-hello-gif-25094727',
            'https://tenor.com/view/cat-pallas-manul-pallas-cat-gif-20906936',
            'https://tenor.com/view/cat-animal-paws-scratching-gif-15512593',
            'https://tenor.com/view/%D1%85%D0%BE%D0%BB%D0%BE%D0%B4%D0%BD%D0%BE-%D1%81%D0%BA%D1%83%D1%87%D0%BD%D0%BE-%D0%B1%D0%B0%D1%80%D1%81-%D1%81%D0%BE%D0%BD-gif-24711635',
            'https://tenor.com/view/pallas-cat-peekaboo-hi-meow-gif-14070981',
            'https://tenor.com/view/manul-gif-22066197',
            'https://tenor.com/view/goobis-manul-cat-suspicious-sus-gif-26515901',
            'https://tenor.com/view/elisttm-jotism-jotism_-jo-autism-jo_autism-gif-21343864',
            'https://tenor.com/view/bulgus-flopa-sogga-bobba-pallas-cat-gif-21365522',
            'https://tenor.com/view/brungus-floppa-manul-pallas-cat-humor-gif-26566218',
            'https://tenor.com/view/cat-cute-shy-pallas-cat-manul-cat-gif-26196386',
            'https://tenor.com/view/pallas-cat-pallas-manul-cat-manul-pallas-cat-winking-gif-19179991',
            'https://tenor.com/view/manul-pallas-cat-mungdaal-cute-bladee-gif-25498111',
            'https://tenor.com/view/brungus-anger-humor-manul-pallas-cat-gif-26566224',
            'https://tenor.com/view/wink-cat-snow-cute-cat-stare-gif-5283058',
            'https://tenor.com/view/manul-hi-cat-pallas-cat-gif-20652693',
            'https://tenor.com/view/elisttm-jotism-jotism_-jo-autism-jo_autism-gif-21343794',
            'https://tenor.com/view/manul-manul-morning-pallas-cat-good-morning-gm-gif-26228661',
            'https://tenor.com/view/manul-cute-cat-cute-cat-anger-gif-21607786',
            'https://tenor.com/view/manul-pallas-cat-licking-lips-emoji-cat-licking-lips-yum-gif-26114435',
            'https://tenor.com/view/elisttm-jotism-jotism_-jo-autism-jo_autism-gif-21343710',
            'https://tenor.com/view/manul-pallas-cat-lucki-real-rx-rx-papi-gif-26362070',
            'https://tenor.com/view/manul-gif-20905492',
            'https://tenor.com/view/manul-lazy-lazy-manul-sleep-gif-26516029',
            ''
            
        ];

        // choose a random manul pic
        const pic = pics[Math.floor(Math.random() * pics.length)];

        // send a response with the manul pic
        interaction.reply(`here's a manul pic for u <3: ${pic}`);
    }
};
