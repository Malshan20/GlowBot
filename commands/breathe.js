const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('breathe')
    .setDescription('🌬️ Start a guided breathing exercise to calm your mind')
    .addStringOption(opt =>
      opt.setName('technique')
        .setDescription('Choose your breathing technique')
        .setRequired(false)
        .addChoices(
          { name: '4-7-8 (Calming)', value: '478' },
          { name: 'Box Breathing (Focus)', value: 'box' },
          { name: '5-5 (Quick Reset)', value: '55' },
        )
    ),

  async execute(interaction) {
    const technique = interaction.options.getString('technique') || '478';

    const techniques = {
      '478': {
        name: '4-7-8 Breathing',
        color: 0x7ED4D4,
        emoji: '🌊',
        description: 'Perfect for reducing anxiety and helping you fall asleep.',
        steps: [
          '**Step 1:** Close your eyes and relax your shoulders',
          '**Step 2:** Breathe IN through your nose for **4 seconds** 🫁',
          '**Step 3:** HOLD your breath for **7 seconds** ⏳',
          '**Step 4:** Breathe OUT through your mouth for **8 seconds** 💨',
          '**Step 5:** Repeat 3–4 times',
        ],
        tip: 'The long exhale activates your parasympathetic nervous system — your body\'s natural calm switch! 🔄',
      },
      'box': {
        name: 'Box Breathing',
        color: 0x74B9FF,
        emoji: '📦',
        description: 'Used by Navy SEALs for focus under pressure. Works for exams too!',
        steps: [
          '**Step 1:** Sit up straight and relax',
          '**Step 2:** Breathe OUT completely to start fresh 💨',
          '**Step 3:** Breathe IN for **4 counts** 🫁',
          '**Step 4:** HOLD for **4 counts** ⏳',
          '**Step 5:** Breathe OUT for **4 counts** 💨',
          '**Step 6:** HOLD for **4 counts** ⏳',
          '**Step 7:** Repeat the box 4 times',
        ],
        tip: 'Visualize drawing a square as you breathe — each side is one phase! 🎨',
      },
      '55': {
        name: '5-5 Quick Reset',
        color: 0x55EFC4,
        emoji: '⚡',
        description: 'Quick 2-minute reset when you\'re on the go.',
        steps: [
          '**Step 1:** Wherever you are, relax your jaw first',
          '**Step 2:** Breathe IN slowly for **5 seconds** 🫁',
          '**Step 3:** Breathe OUT slowly for **5 seconds** 💨',
          '**Step 4:** Do this 6 times (= 1 minute total)',
        ],
        tip: 'Even just 6 rounds of this can significantly lower your heart rate! ❤️',
      },
    };

    const t = techniques[technique];

    const embed = new EmbedBuilder()
      .setColor(t.color)
      .setTitle(`${t.emoji} ${t.name}`)
      .setDescription(`*${t.description}*\n\nFind a comfortable position, and let's begin when you're ready... 🧘`)
      .addFields(
        { name: '📋 How to do it:', value: t.steps.join('\n'), inline: false },
        { name: '💡 Science fact:', value: t.tip, inline: false },
        { name: '✨ Remember', value: 'There\'s no "wrong" way to breathe. Just the intention to pause is already healing. You\'ve got this! 💛', inline: false }
      )
      .setFooter({ text: 'GlowBot Stress Coach 🧘 | quillglow.com' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
