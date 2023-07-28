// botfact.js
module.exports = {
    name: 'botfact',
    description: 'Gives a random fact about bots',
    execute(interaction) {
        // define a list of facts 
        const facts = [
            'the word "bot" comes from "robot", bet u didnʼt know that one 😉',
            'the first chatbot was ELIZA, created by Joseph Weizenbaum in 1966. it simulated a psychotherapist and used pattern matching to respond',
            'bots are kinda boring sometimes. hopefully iʼm not one of them. 😢',
            'if you sleep next to your phone or with your TV on, the screens release a blue light, which is probably the reason youʼre always reaching for NyQuil at bedtime. blue light inhibits the release of melatonin, a naturally existing hormone that helps you get to sleep.',
            'the first-ever computer, ENIAC (Electronic Numerical Integrator and Computer), weighed in at over 27 tons and took up an entire room. ',
            'before Microsoft released its Windows OS, it was briefly named Interface Manager. thankfully, the team decided to change the name before release',
            'in 1999, a 15-year-old hacker managed to hijack several computers at NASA. this caused all work to come to a standstill for 21 days. Jonathan James was put under house arrest till the time he turned 18.',
            'a dual-chip NVIDIA graphics card will get hot enough to fry an egg when the fan speed is decreased by around 10%',
            'social media users usually trust their circles of online friends. the result: more than 600.000 Facebook accounts are compromised every day! Also, 1 in 10 social media users said theyʼve been a victim of a cyber attack and the numbers are on the rise.',
            'oracle Java and Adobe Reader is present on 99% of computers. that means that 99% of computer users are vulnerable to exploit kits (software vulnerabilities).',
            '59% of employees steal proprietary corporate data when they quit or are fired.',
            'ransomware attacks happen every 10 seconds. ',
            'nearly half of all cyberattacks target small businesses.',
            'the first-ever email sent has the same sender and receiver.',
            'in 1971, American computer programmer Ray Tomlinson sent out an email to himself. as much as his action made history, Tomlinson does not remember what he said in the email.',
            'wednesday is the best day for sending emails.Thursday is the worst day to do so.',
            'the first-ever spam email was intended to sell computers. delivered in 1978, Gary Thuerk tried to make his sales by spamming over the ARPANET.',
            'the most hacked Customer Management System (CMS) is wordpress. wordpress sucks.',
            'private browsing is not as “private” as you think. your ISP sees everything. 👀',
            'NASA has an internet speed of 91 gigabits per second.',
            'st. Isidore is the patron saint for the internet and all computer repairmen.',
            'domain name registration used to be free.',
            'CAPTCHA stands for "Completely Automated Public Turing test to tell Computer and Humans Apart". ',
            'wifi doesnʼt stand for anything.',
            '123456 and 12345678 are the most common types of passwords that people use in the world'
        ];

        // choose a random fact
        const fact = facts[Math.floor(Math.random() * facts.length)];

        // send a response with the fact
        interaction.reply(`here's a cool fact! did u know that ${fact}`);
    }
};
