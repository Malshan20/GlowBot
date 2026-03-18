const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Load all command files from the commands directory
 */
function loadCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands');

  if (!fs.existsSync(commandsPath)) {
    logger.warn('Commands directory not found, skipping command loading');
    return;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsPath, file));
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        logger.info(`Loaded command: /${command.data.name}`);
      }
    } catch (err) {
      logger.error(`Failed to load command ${file}:`, err.message);
    }
  }
}

/**
 * Handle an incoming slash command interaction
 */
async function handleSlashCommand(client, interaction) {
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`Unknown command: ${interaction.commandName}`);
    await interaction.reply({ content: '❓ Unknown command!', ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    logger.error(`Error executing /${interaction.commandName}:`, error.message);
    const msg = { content: '✨ Something went wrong with that command. Try again!', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => {});
    } else {
      await interaction.reply(msg).catch(() => {});
    }
  }
}

module.exports = { loadCommands, handleSlashCommand };
