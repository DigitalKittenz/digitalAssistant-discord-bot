// manul.js
module.exports = {
    name: 'manul',
    description: 'Shows a manul pic',
    execute(interaction) {
        // define a list of manul pics
        const pics = [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExenJkMGw5Ymd3bnI1cW1qd2NvZ3k2bGZiamw0bmpsbTR4M2piZWIzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F0ZriKBdzZjnARVTeM/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmhzeW03dmV6czM0Ymp5bmRjcjM2aWl4bnNxbzlsMzZkaWRoc3I1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L4G60Ewtdoem4/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGZ4M3dwc2NoMXdxd2ltOGR3MHlxcDYyd2Y2Y3JsZGVqdDg1bzkxeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YL8quuOin5E7C/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTVoZW85b3lwajhtY2tpYjA4N20xeWJ0eWh2OHAyeGt2N3NobXlvZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/K8l4eiS88UvWU/giphy.gif',
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2U5c2piNG1odWJ2cTBycm9xcXA5Y2ZkOXN0eDNrcHN3NXY0Z2lnaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/12fjBkQf5CV596/giphy.gif',
            'https://media.tenor.com/URusWFQaYgUAAAAC/cute-cat-cat.gif'
        ];

        // choose a random manul pic
        const pic = pics[Math.floor(Math.random() * pics.length)];

        // send a response with the manul pic
        interaction.reply(`here's a manul pic for u <3: ${pic}`);
    }
};
