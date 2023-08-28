module.exports = {
    name: 'kitty',
    description: 'Shows a kitty pic',
    async execute(interaction, client) {
        // get the options from the interaction
        const type = interaction.options.getString('type');

        // now u got the type of kitty they want, so u can do different stuff depending on the type
        if (type === 'manul') {
            // define a list of manul pics
            const pics = [
                'https://giphy.com/gifs/cat-manul-haies-F0ZriKBdzZjnARVTeM',
                'https://i.makeagif.com/media/7-18-2014/QXVCFz.gif',
                'https://giphy.com/gifs/reaction-mrw-screen-Tq0pFzzBpg4SI',
                'https://tenor.com/view/manul-pallas-cat-rolling-cuddle-cuddle-roll-gif-26410302',
                'https://tenor.com/view/manul-pallas-cat-cute-gif-21607590',
                'https://tenor.com/view/manul-pallas-cat-sticker-cat-dm4uz3-gif-21083490',
                'https://i.pinimg.com/originals/e2/a6/04/e2a604a5615d890f60870ecfcea1db0d.gif',
                'https://i.pinimg.com/originals/7a/3f/1b/7a3f1b5b021106d1dcc40e205011b36c.gif',
                'https://i.gifer.com/BJah.gif',
                'https://i.makeagif.com/media/5-18-2023/qexKFn.gif',
                'https://gifer.com/en/BJat',
                'https://gifer.com/en/BJao',
                'https://media.tenor.com/images/40e3550fc57ad035277d94bb94bcaa3d/tenor.gif',
                'https://64.media.tumblr.com/f300cacd754e1eb4315a8ce9b7683314/tumblr_mmtj6dRV021resz13o1_250.gif',
                'https://66.media.tumblr.com/tumblr_m478k4fh701qisaxro1_250.gif',
                'https://thumbs.gfycat.com/WeirdTerrificIndianjackal-max-1mb.gif',
                'https://media.tenor.com/images/87446a1691d3bb78afeca8a73691a078/tenor.gif',
                'https://c.tenor.com/fglOwY1fGNsAAAAM/manul-pallas-cat.gif',
                'https://thumbs.gfycat.com/FoolhardyPlayfulKitty-size_restricted.gif',
                'https://i.pinimg.com/originals/70/42/3a/70423a7666969b330e123e37efcc8498.gif',
                'https://img1.picmix.com/output/pic/normal/8/2/0/1/5171028_3dec3.gif',
                'https://thumbs.gfycat.com/MilkyThoseBlackbuck-size_restricted.gif',
                'https://64.media.tumblr.com/1e207762df60d92f2e09502a979c2ba2/c34ab316327a8518-61/s640x960/914ab4f53c5f7bcf9693cd552def4b269eeb736b.gifv',
                'https://64.media.tumblr.com/e4865db5a72aa49969e58801dac94f2e/tumblr_n80rytWaEh1rx5st2o1_400.gif',
                'https://64.media.tumblr.com/7af0269b7e589a15de853d1af20ae124/b467aa66f807da83-66/s640x960/90441b443a39f669e428212e513e698dcb4b45d3.gifv',
                'https://64.media.tumblr.com/f46990023d4e3b872215e0ce21e4e3e1/b467aa66f807da83-dc/s640x960/4fcc10bf905b576727af693534979cb758cfffab.gifv',
                'https://media.tenor.com/HftjEmsB0pQAAAAM/manul-pallas-cat.gif',
                'https://64.media.tumblr.com/49a246badd411798b3f6ac4d7f39cbeb/cf709cf4b3abb001-46/s400x600/33e9b427c05b66a9886ac1dde44c11b2aac4f222.gifv',
                'https://64.media.tumblr.com/01110418df1c3c6e48e61282e9bfdea6/cf709cf4b3abb001-c6/s400x600/4376fcd2a6e6f69c6ad78a36733cb903c3d284ac.gifv',
                'https://tenor.com/view/pallas-cat-cat-cute-cat-cute-pallas-cat-dirk-gif-24844897',
                'https://tenor.com/view/manul-pallas-cat-manul-cat-gif-26136860',
                'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/465d0c33-a5aa-4d36-8e06-53dcee114fd5/d93yr89-4dd19586-0776-4311-92ca-02ba88850e39.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi80NjVkMGMzMy1hNWFhLTRkMzYtOGUwNi01M2RjZWUxMTRmZDUvZDkzeXI4OS00ZGQxOTU4Ni0wNzc2LTQzMTEtOTJjYS0wMmJhODg4NTBlMzkuZ2lmIn1dXX0.8mUgSTUNvm8W6lNuKge1ZhSolNi0P8gQoENm6ufYyU8',
                'https://tenor.com/view/pallas-pallas-cat-manul-cat-gif-20906933',
                'https://tenor.com/view/pallas-cat-what-huh-gif-14070902',
                'https://tenor.com/view/cat-gif-6071885',
                'https://tenor.com/view/manul-pallas-cat-rolling-cuddle-cuddle-roll-gif-26410302',
                'https://64.media.tumblr.com/a2504a1afdea347c2c66503ae63710c3/tumblr_mmtj6dRV021resz13o4_250.gif',
                'https://tenor.com/view/manul-pallas-cat-manul-cat-gif-26136867',
                'https://i255.photobucket.com/albums/hh145/xmrsdanifilth/Animals/Pallas%20Cats/Manul-Kittens1.gif',
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
                'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmhzeW03dmV6czM0Ymp5bmRjcjM2aWl4bnNxbzlsMzZkaWRoc3I1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L4G60Ewtdoem4/giphy.gif',
                'https://giphy.com/gifs/cat-manul-haies-F0ZriKBdzZjnARVTeM'
            ];
            // choose a random manul pic
            const pic = pics[Math.floor(Math.random() * pics.length)];
            // send a response with the manul pic
            interaction.reply(pic);
        } else if (type === 'cartoon') {
            // do something for cartoon kitties here
            interaction.reply('check out this uwu cartoon kitty!');
        } else if (type === 'wizard') { 
            // do something for wizard kitties here
            interaction.reply('omg wizard kitties are the best!!');
        } else if (type === 'wizard') {
            // do something for wizard kitties here
            interaction.reply('omg wizard kitties are the best!!');
        } else if (type === 'spotty kitty') {
            // do something for spotty kitties here
            interaction.reply('spotty kitties are so chic, rite??');
        } else if (type === 'meow') {
                // randomize the response
                const options = [
                    'meow',
                    'nya!!',
                    'mewwww 🐾🐱',
                    'nyawn (^ω^)',
                    'ME-OW!',
                    'Rawwr! (coz cats think they’re savage)',
                    'Mroooooow',
                    'Meow meow meow!',
                    'Mroooooow',
                    'Purrr purr meownee!',
                    'Purrrpurr',
                    'mmmeoowww naps',
                    'hiss! 🐱',
                    'prrrp? 😸',
                    'mrowl! >:3',
                    '*licks paw*',
                    '*rolls over for belly rubs*',
                    '*stretches and yawns*',
                    '*knocks stuff off table*',
                    '*runs and zooms around*',
                    '*sharpens claws on couch*',
                    "'Scuse me hooman but I'ma need petss 🙀👉👈",
                    "Me-oww 😸 !",
                    "Mreow~!",
                    "Stop the regular daily BS. MORE PETS.",
                    "*Ripping up sofa because undying resentment*",
                    " Purrr ＾-＾ ~",
                    "Wait...I left that hairball where!? #oops",
                    "*purrs loudly in content ❤️😽❤️*"
                    ];
                try {
                    interaction.reply(options[Math.floor(Math.random() * options.length)]);
                    // Set the autoReply state to true
                    client.globalState.autoReply[interaction.channel.id] = true;
                } catch (error) {
                    console.error('Failed to reply to interaction:', error);
            }
        } else {
            // if they didn't specify a type or gave an unknown type, just give them a random kitty
            interaction.reply('here\'s a random kitty for ya!');
        }
    },
};