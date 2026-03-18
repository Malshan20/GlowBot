const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

const GAMES = [
  {
    id: 'wordchain',
    name: '🔤 Word Chain',
    description: 'I give you a category — you reply with 3 words that fit it! Simple and oddly satisfying.',
    play: async () => {
      const categories = [
        'things that are soft', 'animals that can swim', 'things in a kitchen',
        'things that make you happy', 'words that sound funny', 'things you find at the beach',
        'things that are round', 'things you can eat with a spoon',
      ];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      return `**Your category:** *${cat}*\n\nReply in chat with 3 things that fit! No wrong answers — just go with your gut! 🎯`;
    },
  },
  {
    id: 'trivia',
    name: '🧠 Fun Trivia',
    description: 'A random fun fact + a trivia question. Feeds your brain while giving it a break!',
    play: async () => {
      const response = await generateFocused(
        'Generate 1 surprising fun fact and 1 trivia question (with the answer). Format: FACT: [fact] | QUESTION: [question] | ANSWER: [answer]. Keep it light and fun!',
        'You are a fun trivia host. Be concise and entertaining.'
      );
      return response;
    },
  },
  {
    id: 'gratitude',
    name: '💛 Gratitude Spark',
    description: 'A tiny but powerful exercise. Name 3 small things you\'re grateful for right now.',
    play: async () => {
      const prompts = [
        'Name 3 things that made you smile this week (they can be tiny!)',
        'What are 3 things your body did for you today that you\'re grateful for?',
        'Name 3 things in your life that younger-you would be amazed by',
        'What are 3 sounds, smells, or textures you secretly love?',
        'Name 3 people (real or fictional) who make your world brighter',
      ];
      const p = prompts[Math.floor(Math.random() * prompts.length)];
      return `✨ **Today's Gratitude Spark:**\n\n*${p}*\n\nShare in chat or keep it in your heart — either way, your brain just got a mood boost! 🧠💛`;
    },
  },
  {
    id: 'silly',
    name: '🎨 Silly Creative Challenge',
    description: 'A weird, funny creative prompt to snap you out of your head!',
    play: async () => {
      const response = await generateFocused(
        'Give me one funny, creative, slightly absurd challenge for a stressed student. Examples: "Design the world\'s worst pizza topping combo and justify it", "Write a 3-sentence story where a pencil saves the day". Make it original, fun, and harmless.',
        'You are a quirky creative coach. Be original and funny.'
      );
      return `🎨 **Your Silly Challenge:**\n\n${response}\n\n*Share your answer in chat if you dare! 😄*`;
    },
  },
  {
    id: 'mindfulness',
    name: '🌿 5-4-3-2-1 Grounding',
    description: 'A mindfulness technique to anchor you in the present moment.',
    play: async () => {
      return `🌿 **5-4-3-2-1 Grounding Exercise**\n\nLook around and notice:\n\n**5** things you can *see* 👀\n**4** things you can *touch* ✋\n**3** things you can *hear* 👂\n**2** things you can *smell* 👃\n**1** thing you can *taste* 👅\n\nTake your time. There's no rush. This technique is used by therapists to calm anxiety — and it works! 🧘`;
    },
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('🎮 Play a stress-busting mini-game to take a mental break!')
    .addStringOption(opt =>
      opt.setName('type')
        .setDescription('Choose a game type (or skip for a random one!)')
        .setRequired(false)
        .addChoices(
          { name: '🔤 Word Chain', value: 'wordchain' },
          { name: '🧠 Fun Trivia', value: 'trivia' },
          { name: '💛 Gratitude Spark', value: 'gratitude' },
          { name: '🎨 Silly Creative Challenge', value: 'silly' },
          { name: '🌿 5-4-3-2-1 Grounding', value: 'mindfulness' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const gameId = interaction.options.getString('type');
    const game = gameId
      ? GAMES.find(g => g.id === gameId)
      : GAMES[Math.floor(Math.random() * GAMES.length)];

    try {
      const content = await game.play();

      const embed = new EmbedBuilder()
        .setColor(0xFFD166)
        .setTitle(game.name)
        .setDescription(`*${game.description}*\n\n${content}`)
        .setFooter({ text: 'GlowBot Game Mode 🎮 | Take a breath, you deserve this break!' })
        .setTimestamp();

      // Add "Play Again" button
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('game_again')
          .setLabel('🎲 Random Game Again')
          .setStyle(ButtonStyle.Primary),
      );

      const response = await interaction.editReply({ embeds: [embed], components: [row] });

      // Handle button click
      const collector = response.createMessageComponentCollector({ time: 120000 });
      collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) {
          await i.reply({ content: 'Start your own game with `/game`! 😄', ephemeral: true });
          return;
        }
        await i.deferUpdate();
        const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
        const newContent = await randomGame.play();
        const newEmbed = new EmbedBuilder()
          .setColor(0xFFD166)
          .setTitle(randomGame.name)
          .setDescription(`*${randomGame.description}*\n\n${newContent}`)
          .setFooter({ text: 'GlowBot Game Mode 🎮 | Keep going, you\'re doing great!' })
          .setTimestamp();
        await interaction.editReply({ embeds: [newEmbed], components: [row] });
      });

    } catch (err) {
      await interaction.editReply('🎮 Couldn\'t load the game right now. Try `/breathe` instead!');
    }
  },
};
