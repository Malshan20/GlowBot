const { EmbedBuilder } = require('discord.js');
const { chat, detectMode } = require('./groqClient');
const { checkRateLimit } = require('./rateLimiter');
const logger = require('./logger');

// Track typing indicators
const typingChannels = new Set();

/**
 * Split long messages for Discord's 2000 char limit
 */
function splitMessage(text, maxLength = 1900) {
  if (text.length <= maxLength) return [text];

  const parts = [];
  let current = '';
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      if (current) parts.push(current.trim());
      current = sentence;
    } else {
      current += (current ? ' ' : '') + sentence;
    }
  }
  if (current) parts.push(current.trim());
  return parts;
}

/**
 * Get color based on detected mode
 */
function getModeColor(mode) {
  const colors = {
    stress: 0x7ED4D4,   // Calming teal
    emotional: 0xFFB3C6, // Gentle pink
    study: 0xFFD166,     // Warm yellow
    general: 0x9B72CF,   // QuillGlow purple
  };
  return colors[mode] || colors.general;
}

/**
 * Check if bot should respond to this message
 */
function shouldRespond(client, message) {
  // Always respond to DMs
  if (!message.guild) return true;

  // Respond if bot is mentioned
  if (message.mentions.has(client.user)) return true;

  // Respond if message starts with bot name (case-insensitive)
  const botName = (process.env.BOT_NAME || 'GlowBot').toLowerCase();
  if (message.content.toLowerCase().startsWith(botName)) return true;

  // Check if in designated AI channels
  const aiChannelIds = process.env.AI_CHANNEL_IDS?.split(',').map(id => id.trim()).filter(Boolean);
  if (aiChannelIds && aiChannelIds.length > 0) {
    return aiChannelIds.includes(message.channelId);
  }

  // If no channel restriction, respond in any channel when mentioned
  return false;
}

/**
 * Clean the message content (remove bot mention)
 */
function cleanContent(client, content) {
  return content
    .replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '')
    .replace(new RegExp(`^${process.env.BOT_NAME || 'glowbot'}`, 'i'), '')
    .trim();
}

/**
 * Check for crisis keywords and return crisis resources if needed
 */
function hasCrisisKeywords(content) {
  const crisisWords = ['kill myself', 'suicide', 'want to die', 'end my life', 'self harm', 'hurt myself', 'no reason to live'];
  const lower = content.toLowerCase();
  return crisisWords.some(word => lower.includes(word));
}

/**
 * Main message handler
 */
async function handleMessage(client, message) {
  try {
    if (!shouldRespond(client, message)) return;

    const content = cleanContent(client, message.content);
    if (!content || content.length < 1) return;

    // Rate limiting
    const rateCheck = checkRateLimit(message.author.id);
    if (!rateCheck.allowed) {
      await message.reply(`⏳ Slow down a bit! You can send another message in ${rateCheck.retryAfter}s. Take a breath! 🌬️`);
      return;
    }

    // Crisis check - immediate response
    if (hasCrisisKeywords(content)) {
      const crisisEmbed = new EmbedBuilder()
        .setColor(0xFF6B6B)
        .setTitle('💙 I hear you, and I care about you')
        .setDescription(
          "It sounds like you're going through something really painful right now. You're not alone.\n\n" +
          "**Please reach out to someone who can really help:**\n" +
          "🆘 **Crisis Text Line:** Text `HOME` to `741741`\n" +
          "📞 **988 Suicide & Crisis Lifeline:** Call or text `988` (US)\n" +
          "🌍 **International Resources:** [iasp.info/resources](https://www.iasp.info/resources/Crisis_Centres/)\n\n" +
          "I'm an AI and I want to keep talking with you — but please also reach out to a real person. You matter. 💛"
        )
        .setFooter({ text: 'QuillGlow cares about you 🌟' });

      await message.reply({ embeds: [crisisEmbed] });
      return; // Still let the AI respond after showing resources
    }

    // Show typing indicator
    if (!typingChannels.has(message.channelId)) {
      typingChannels.add(message.channelId);
      await message.channel.sendTyping();
      const typingInterval = setInterval(() => message.channel.sendTyping(), 8000);

      try {
        const { content: aiResponse, mode } = await chat(
          message.author.id,
          content,
          message.author.username
        );

        clearInterval(typingInterval);
        typingChannels.delete(message.channelId);

        // Split if too long
        const parts = splitMessage(aiResponse);

        if (parts.length === 1) {
          // Single message — use embed for a nice look
          const embed = new EmbedBuilder()
            .setColor(getModeColor(mode))
            .setDescription(aiResponse)
            .setFooter({
              text: `GlowBot 🌟 | ${getModeLabel(mode)}`,
              iconURL: client.user.displayAvatarURL(),
            });

          await message.reply({ embeds: [embed] });
        } else {
          // Multiple parts — send as plain text to avoid embed spam
          for (let i = 0; i < parts.length; i++) {
            if (i === 0) {
              await message.reply(parts[i]);
            } else {
              await message.channel.send(parts[i]);
            }
          }
        }
      } catch (err) {
        clearInterval(typingInterval);
        typingChannels.delete(message.channelId);
        throw err;
      }
    }
  } catch (error) {
    logger.error('Message handler error:', error.message);
    await message.reply('✨ Oops! My brain had a little glitch. Try again in a moment!').catch(() => {});
  }
}

function getModeLabel(mode) {
  const labels = {
    stress: 'Stress Coach Mode 🧘',
    emotional: 'Support Mode 💙',
    study: 'Study Helper Mode 📚',
    general: 'Chat Mode 💬',
  };
  return labels[mode] || labels.general;
}

module.exports = { handleMessage };
