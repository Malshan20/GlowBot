const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

const MOODS = [
  { label: '😄 Great', value: 5, color: 0x55EFC4, emoji: '😄' },
  { label: '🙂 Good', value: 4, color: 0xFFD166, emoji: '🙂' },
  { label: '😐 Okay', value: 3, color: 0x74B9FF, emoji: '😐' },
  { label: '😔 Low', value: 2, color: 0xFFB3C6, emoji: '😔' },
  { label: '😰 Rough', value: 1, color: 0xFF7675, emoji: '😰' },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkin')
    .setDescription('💙 Daily mental health check-in — how are you really doing?'),

  async execute(interaction) {
    const username = interaction.user.displayName || interaction.user.username;

    const row = new ActionRowBuilder().addComponents(
      MOODS.map(m =>
        new ButtonBuilder()
          .setCustomId(`mood_${m.value}`)
          .setLabel(m.label)
          .setStyle(ButtonStyle.Secondary)
      )
    );

    const promptEmbed = new EmbedBuilder()
      .setColor(0x9B72CF)
      .setTitle(`💙 Daily Check-In — Hey ${username}!`)
      .setDescription('Taking 30 seconds to check in with yourself is a powerful habit.\n\n**How are you feeling right now, honestly?**')
      .setFooter({ text: 'Your response is just between us 🌟' });

    const response = await interaction.reply({ embeds: [promptEmbed], components: [row], ephemeral: true });

    const collector = response.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) return;

      const moodValue = parseInt(i.customId.split('_')[1]);
      const mood = MOODS.find(m => m.value === moodValue);

      await i.deferUpdate();

      try {
        const moodLabels = { 5: 'great', 4: 'good', 3: 'okay', 2: 'low', 1: 'rough' };
        const moodLabel = moodLabels[moodValue];

        const supportMessage = await generateFocused(
          `A student named ${username} just checked in and said they feel "${moodLabel}" (${moodValue}/5).

Write a warm, brief check-in response (2-3 sentences max):
- If great/good: Celebrate briefly + encourage them to keep glowing
- If okay: Acknowledge it + normalize + one tiny positive nudge  
- If low/rough: Deep validation + gentle care + suggest /vent or /breathe or /game
- Always end with one small, concrete action they can take right now
- Warm, peer-like tone. No therapy-speak. No lists.`,
          'You are a warm, caring friend who gives brief, genuine check-in responses.'
        );

        const suggestions = {
          5: ['🎯 Set an intention for today with `/studytip`', '✨ Share the good vibes — say hi to someone!'],
          4: ['📚 Ride the momentum with `/studytip`', '🌟 Keep the energy with `/affirmation`'],
          3: ['🧘 A quick `/breathe` can help shift gears', '🎮 Try `/game` for a gentle mental break'],
          2: ['💙 Let it out with `/vent` — just you and me', '🌬️ `/breathe` can help lift the heaviness'],
          1: ['💙 Try `/vent` — I\'m here to listen, no judgment', '🧘 `/breathe` right now — your nervous system needs it'],
        };

        const suggestion = suggestions[moodValue][Math.floor(Math.random() * 2)];

        const resultEmbed = new EmbedBuilder()
          .setColor(mood.color)
          .setTitle(`${mood.emoji} Check-In Complete`)
          .setDescription(supportMessage)
          .addFields(
            { name: '💡 Try this now', value: suggestion, inline: false },
            { name: '📊 Your mood today', value: '⬜'.repeat(5 - moodValue) + '🟣'.repeat(moodValue) + ` (${moodValue}/5)`, inline: false },
          )
          .setFooter({ text: 'GlowBot 💙 | Checking in is an act of self-love 🌟' })
          .setTimestamp();

        await interaction.editReply({ embeds: [resultEmbed], components: [] });
        collector.stop();
      } catch (err) {
        await interaction.editReply({
          embeds: [],
          components: [],
          content: `${mood.emoji} Thanks for checking in, ${username}. Whatever you\'re feeling is valid. Try \`/breathe\` or \`/vent\` if you need support! 💛`,
        });
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') {
        interaction.editReply({ components: [] }).catch(() => {});
      }
    });
  },
};
