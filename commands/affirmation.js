const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

const COLORS = [0xFFB3C6, 0xFFD166, 0x9B72CF, 0x7ED4D4, 0x74B9FF, 0x55EFC4];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('affirmation')
    .setDescription('💛 Get a personalized affirmation to brighten your day')
    .addStringOption(opt =>
      opt.setName('mood')
        .setDescription('How are you feeling right now?')
        .setRequired(false)
        .addChoices(
          { name: '😰 Anxious / Stressed', value: 'anxious' },
          { name: '😔 Sad / Low energy', value: 'sad' },
          { name: '😤 Frustrated / Overwhelmed', value: 'frustrated' },
          { name: '😴 Tired / Unmotivated', value: 'tired' },
          { name: '🙂 Just want positivity!', value: 'general' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const mood = interaction.options.getString('mood') || 'general';
    const username = interaction.user.displayName || interaction.user.username;

    const moodContext = {
      anxious: 'The student is feeling anxious and stressed.',
      sad: 'The student is feeling sad and low.',
      frustrated: 'The student is feeling frustrated and overwhelmed.',
      tired: 'The student is tired and unmotivated.',
      general: 'The student just wants some positivity.',
    };

    try {
      const affirmation = await generateFocused(
        `Generate a genuine, warm, personalized affirmation for a student named ${username}. Context: ${moodContext[mood]}. 
        
        The affirmation should:
        - Feel personal and real (not generic)
        - Be 2-4 sentences
        - Acknowledge their struggle without minimizing it
        - End with empowerment, not toxic positivity
        - Not use clichés like "you've got this!" or "believe in yourself"
        
        Just write the affirmation, no extra commentary.`,
        'You are a compassionate affirmation writer. Write genuine, specific, non-clichéd affirmations.'
      );

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`💛 For you, ${username}`)
        .setDescription(`*${affirmation}*`)
        .addFields({
          name: '✨ A reminder',
          value: 'Screenshot this if it helped. You can come back to it anytime.',
          inline: false,
        })
        .setFooter({ text: 'GlowBot 🌟 | You matter more than your productivity.' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply('💛 Couldn\'t generate an affirmation right now. But know this: you are enough, exactly as you are, right now. 🌟');
    }
  },
};
