const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('😄 Get a wholesome, funny joke to lighten your mood!')
    .addStringOption(opt =>
      opt.setName('type')
        .setDescription('What kind of joke?')
        .setRequired(false)
        .addChoices(
          { name: '📚 Student / School life', value: 'student' },
          { name: '🔬 Science & nerdy', value: 'nerdy' },
          { name: '🌍 Random & wholesome', value: 'random' },
          { name: '🤔 Dad joke (groan-worthy)', value: 'dad' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const type = interaction.options.getString('type') || 'random';

    const typePrompts = {
      student: 'a funny, relatable joke about student life, studying, exams, or school. Make it something every student can relate to.',
      nerdy: 'a clever, nerdy joke about science, math, literature, or academic subjects. It should be witty.',
      random: 'a wholesome, universally funny joke. Family-friendly and genuinely amusing.',
      dad: 'a classic dad joke — the worse the pun, the better. Maximum groan-worthiness.',
    };

    try {
      const joke = await generateFocused(
        `Tell me ${typePrompts[type]} Format: Setup on line 1, then "..." then punchline. Just the joke, no commentary.`,
        'You are a comedian. Tell clean, genuinely funny jokes. No offensive content ever.'
      );

      const typeEmojis = { student: '📚', nerdy: '🔬', random: '😄', dad: '👴' };

      const embed = new EmbedBuilder()
        .setColor(0xFFD166)
        .setTitle(`${typeEmojis[type]} Here's one for you!`)
        .setDescription(joke)
        .setFooter({ text: 'GlowBot 😄 | Laughter is the best study break! | /game for more fun' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply('😄 Why did the student eat their homework? Because the teacher told them it was a piece of cake! 🎂\n*(My joke generator had a hiccup — try again!)*');
    }
  },
};
