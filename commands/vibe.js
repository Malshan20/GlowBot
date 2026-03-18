const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

const VIBES = [
  { name: 'Deep Focus Mode', emoji: '🎯', color: 0x2D3436, music: 'Lo-fi hip hop', tip: 'Try the Pomodoro technique — 25 min focus, 5 min break.' },
  { name: 'Creative Flow', emoji: '🎨', color: 0xFD79A8, music: 'Ambient / Chillwave', tip: 'Let ideas flow freely before editing. Quantity before quality!' },
  { name: 'Exam Crunch', emoji: '⚡', color: 0xFDCB6E, music: 'Upbeat instrumental', tip: 'Active recall beats re-reading. Test yourself!' },
  { name: 'Cozy Study', emoji: '☕', color: 0xA29BFE, music: 'Jazz / Café sounds', tip: 'The best study session is a consistent one. Show up every day.' },
  { name: 'Stress Recovery', emoji: '🌿', color: 0x55EFC4, music: 'Nature sounds / Meditation', tip: 'Rest IS productive. Your brain consolidates memory during breaks.' },
  { name: 'Late Night Grind', emoji: '🌙', color: 0x2D3436, music: 'Synthwave / Night drive', tip: 'Even 6 hours of quality sleep beats an all-nighter. Your call.' },
  { name: 'Morning Momentum', emoji: '🌅', color: 0xFFD166, music: 'Uplifting pop / Indie', tip: 'Tackle your hardest task first — it\'s downhill from there!' },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vibe')
    .setDescription('🎵 Get today\'s study vibe — music mood, motivation & a tip!'),

  async execute(interaction) {
    await interaction.deferReply();

    const vibe = VIBES[Math.floor(Math.random() * VIBES.length)];
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'late night';

    try {
      const motivation = await generateFocused(
        `Write a 1-2 sentence motivational message for a student in "${vibe.name}" mode during the ${timeOfDay}. 
Make it specific, genuine, and energizing — not generic. Match the vibe: ${vibe.emoji}`,
        'You write brief, punchy, genuine motivational messages. Never generic. Always specific to the vibe.'
      );

      const embed = new EmbedBuilder()
        .setColor(vibe.color)
        .setTitle(`${vibe.emoji} Today's Vibe: ${vibe.name}`)
        .setDescription(`*${motivation}*`)
        .addFields(
          { name: '🎵 Suggested Music', value: vibe.music, inline: true },
          { name: '⏰ Time of Day', value: timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1), inline: true },
          { name: '💡 Power Tip', value: vibe.tip, inline: false },
          { name: '🌟 QuillGlow Boost', value: 'Whatever you\'re working on, [quillglow.com](https://quillglow.com) can help you write, research, and create better!', inline: false },
        )
        .setFooter({ text: 'GlowBot 🎵 | Find your flow and glow!' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply(`${vibe.emoji} **${vibe.name} Vibe!** | 🎵 ${vibe.music} | 💡 ${vibe.tip}`);
    }
  },
};
