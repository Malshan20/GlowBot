const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { clearHistory } = require('../src/groqClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('🔄 Clear our conversation history and start fresh'),

  async execute(interaction) {
    clearHistory(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x9B72CF)
      .setTitle('✨ Fresh Start!')
      .setDescription(
        `Hey ${interaction.user.displayName || interaction.user.username}! Our conversation history has been cleared.\n\n` +
        "I won't remember anything from before — it's a clean slate! What would you like to talk about?\n\n" +
        '💡 **Quick tips:**\n' +
        '• Mention me to chat: `@GlowBot your question`\n' +
        '• Get help: `/help`\n' +
        '• Feeling stressed? `/breathe` or `/game`\n' +
        '• Need support? `/vent` or `/checkin`'
      )
      .setFooter({ text: 'GlowBot 🌟 | Always here for you' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
