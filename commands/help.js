const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('See everything GlowBot can do for you! 🌟'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(0x9B72CF)
      .setTitle('✨ GlowBot — Your QuillGlow Companion')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('Hey there! I\'m **GlowBot**, here to help you study, destress, and feel supported. Here\'s what I can do:')
      .addFields(
        {
          name: '📚 QuillGlow Help',
          value: '`/quillglow` — Learn about QuillGlow features\n`/studytip` — Get a personalized study tip\nOr just **mention me** and ask anything about quillglow.com!',
          inline: false,
        },
        {
          name: '🧘 Stress Relief',
          value: '`/breathe` — Guided breathing exercise\n`/game` — Play a quick stress-busting mini-game\n`/joke` — Get a wholesome laugh\n`/vibe` — Check the current server vibe 🎵',
          inline: false,
        },
        {
          name: '💙 Emotional Support',
          value: '`/vent` — Private space to share how you\'re feeling\n`/affirmation` — Get a personalized affirmation\n`/checkin` — Daily mental health check-in',
          inline: false,
        },
        {
          name: '🛠️ Utility',
          value: '`/reset` — Clear our conversation history\n`/help` — This menu!\n\n**💬 Chat Mode:** Just @mention me or type in the AI channel anytime!',
          inline: false,
        }
      )
      .setFooter({ text: 'QuillGlow Discord Bot 🌟 | quillglow.com', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
