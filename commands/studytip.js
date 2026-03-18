const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('studytip')
    .setDescription('📚 Get a personalized study tip or productivity hack')
    .addStringOption(opt =>
      opt.setName('topic')
        .setDescription('What are you studying or struggling with?')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('challenge')
        .setDescription('What\'s your biggest study challenge right now?')
        .setRequired(false)
        .addChoices(
          { name: '😵 Can\'t focus / distracted', value: 'focus' },
          { name: '😴 Procrastinating', value: 'procrastination' },
          { name: '📖 Hard to remember things', value: 'memory' },
          { name: '⏰ Bad at time management', value: 'time' },
          { name: '😰 Exam anxiety', value: 'anxiety' },
          { name: '✍️ Writer\'s block', value: 'writing' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const topic = interaction.options.getString('topic');
    const challenge = interaction.options.getString('challenge');
    const username = interaction.user.displayName || interaction.user.username;

    const challengeLabels = {
      focus: 'difficulty focusing and staying distracted',
      procrastination: 'procrastination',
      memory: 'trouble retaining and remembering information',
      time: 'poor time management',
      anxiety: 'exam anxiety and test nerves',
      writing: 'writer\'s block and writing difficulties',
    };

    const contextParts = [];
    if (topic) contextParts.push(`studying: ${topic}`);
    if (challenge) contextParts.push(`struggling with: ${challengeLabels[challenge]}`);
    const context = contextParts.length > 0
      ? contextParts.join(', ')
      : 'general study improvement';

    try {
      const tip = await generateFocused(
        `Give ${username} a practical, specific study tip for: ${context}.

Requirements:
- One focused, actionable tip (not a list of 10 generic things)
- Include the science/reason WHY it works (brief)
- Include a specific "try this right now" micro-action
- Mention how QuillGlow.com can help if relevant (writing, research, notes)
- Keep it under 200 words
- Conversational tone, not textbook-style`,
        'You are a study coach and learning science expert. Give specific, evidence-based, actionable tips.'
      );

      const embed = new EmbedBuilder()
        .setColor(0xFFD166)
        .setTitle(`📚 Study Tip for ${username}`)
        .setDescription(tip)
        .addFields(
          {
            name: '🌟 QuillGlow can help!',
            value: topic
              ? `Studying ${topic}? Try QuillGlow's **AI Mind Map Generator** to visualize it, **AI Revision Notes** to condense it, or the **Multi-Source Tutor** for cited explanations — all at [quillglow.com](https://quillglow.com)!`
              : 'Supercharge your study session with **Smart Flashcards**, the **AI Exam Generator**, the **Pomodoro Timer**, or the **AI Audio Overview** — all at [quillglow.com](https://quillglow.com) 🚀',
            inline: false,
          }
        )
        .setFooter({ text: 'GlowBot Study Coach 📚 | Learning is a superpower.' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply('📚 Couldn\'t generate a tip right now. Here\'s a classic though: The Pomodoro Technique — 25 min work, 5 min break. Set a timer and go! ⏰');
    }
  },
};
