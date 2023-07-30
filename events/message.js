// message.js
module.exports = {
  name: 'messageCreate',
  async execute(message) {
      // only run in specific channel
      if (message.channel.id !== process.env.CHANNEL_ID) return;

      // ignore bot messages
      if (message.author.bot) return;

      // if this message is the same as the last one delete it
      if (message.content === this.lastMessageContent) {
          await message.delete();
      } else {
          this.lastMessageContent = message.content;
      }
  },
};
