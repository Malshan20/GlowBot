require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, ActivityType } = require('discord.js');
const { loadCommands, handleSlashCommand } = require('./commandHandler');
const { handleMessage } = require('./messageHandler');
const logger = require('./logger');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

// Load slash commands
loadCommands(client);

client.once(Events.ClientReady, (c) => {
  logger.info(`✨ QuillGlow Bot is online as ${c.user.tag}`);

  const statuses = [
    { name: '📚 Helping students glow!', type: ActivityType.Playing },
    { name: '💬 Ask me anything!', type: ActivityType.Listening },
    { name: '🌟 quillglow.com', type: ActivityType.Watching },
    { name: '🧘 Stress? Let\'s chat!', type: ActivityType.Playing },
    { name: '🎮 Play a stress game!', type: ActivityType.Playing },
  ];

  let i = 0;
  c.user.setPresence({ activities: [statuses[0]], status: 'online' });

  setInterval(() => {
    i = (i + 1) % statuses.length;
    c.user.setPresence({ activities: [statuses[i]], status: 'online' });
  }, 30000);
});

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await handleSlashCommand(client, interaction);
});

// Handle regular messages (AI chat)
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  await handleMessage(client, message);
});

client.on('error', (error) => logger.error('Discord client error:', error));
process.on('unhandledRejection', (error) => logger.error('Unhandled rejection:', error));

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  logger.error('Failed to login to Discord:', err.message);
  process.exit(1);
});
