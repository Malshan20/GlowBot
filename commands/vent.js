const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vent')
    .setDescription('💙 Share what\'s on your mind — I\'m here to listen (privately)')
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('What\'s going on? Share as much or as little as you\'d like.')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Always ephemeral for privacy
    await interaction.deferReply({ ephemeral: true });

    const ventMessage = interaction.options.getString('message');
    const username = interaction.user.displayName || interaction.user.username;

    // Crisis check
    const crisisWords = ['kill myself', 'suicide', 'want to die', 'end my life', 'self harm'];
    const hasCrisis = crisisWords.some(w => ventMessage.toLowerCase().includes(w));

    if (hasCrisis) {
      const crisisEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('💙 I hear you, and I\'m really glad you reached out')
        .setDescription(
          `${username}, what you shared sounds very serious, and I want to make sure you get real support right now.\n\n` +
          '**Please reach out to one of these immediately:**\n\n' +
          '🆘 **Crisis Text Line:** Text `HOME` to `741741`\n' +
          '📞 **988 Suicide & Crisis Lifeline:** Call or text `988`\n' +
          '🌍 **International:** [iasp.info](https://www.iasp.info/resources/Crisis_Centres/)\n' +
          '💬 **Crisis Chat:** [crisischat.org](https://crisischat.org)\n\n' +
          'I\'m an AI and I care about you — but these trained humans can help in ways I cannot. You deserve real support. 💛\n\n' +
          '*This message is only visible to you.*'
        )
        .setFooter({ text: 'GlowBot 💙 | You are not alone.' });

      await interaction.editReply({ embeds: [crisisEmbed] });
      return;
    }

    try {
      const response = await generateFocused(
        `A student named ${username} vented to me. Here's what they said:

"${ventMessage}"

Please respond as a warm, empathetic emotional support companion. 
- First, genuinely validate their feelings (2-3 sentences)
- Then offer 1-2 gentle, practical coping suggestions (not preachy)
- End with an open invitation to keep talking or to try a bot feature like /breathe or /game
- Keep it warm, conversational, NOT clinical
- Do NOT use bullet points or headers — just flowing, warm prose
- Be genuine, not generic`,
        'You are GlowBot, a warm emotional support companion for students. Respond with empathy, validation, and gentle guidance.'
      );

      const embed = new EmbedBuilder()
        .setColor(0xFFB3C6)
        .setTitle('💙 I\'m here with you')
        .setDescription(response)
        .addFields({
          name: '🔒 Privacy note',
          value: 'Only you can see this message. Your feelings are safe here.',
          inline: false,
        })
        .setFooter({ text: 'GlowBot Emotional Support 💙 | Remember: professional help is always available.' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply(
        '💙 I\'m having a moment, but I want you to know — what you\'re feeling is valid. ' +
        'Try talking to me by mentioning @GlowBot in chat, or use `/breathe` to ground yourself. You\'re not alone. 🌟'
      );
    }
  },
};
