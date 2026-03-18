# 🌟 QuillGlow Discord Bot — GlowBot

> Your AI-powered student companion for the QuillGlow Discord server.  
> Powered by **Groq AI (llama-3.3-70b-versatile)** · Built with **Discord.js v14**

---

## ✨ What GlowBot Does

GlowBot wears three hats — seamlessly switching between them based on what you need:

| Role | What it does |
|------|-------------|
| 📚 **QuillGlow Expert** | Answers questions about quillglow.com features, writing tools, study resources |
| 🧘 **Stress Release Coach** | Mini-games, breathing exercises, jokes, vibes, creative challenges |
| 💙 **Emotional Support** | Private venting, daily check-ins, personalized affirmations, crisis resources |

---

## 🚀 Quick Setup (Step-by-Step)

### Step 1 — Prerequisites

Make sure you have:
- [Node.js v18+](https://nodejs.org/) installed
- A [Discord Developer Account](https://discord.com/developers/applications)
- A [Groq API Key](https://console.groq.com/) (free tier available!)

---

### Step 2 — Create Your Discord Bot

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application** → name it `GlowBot` (or anything you like)
3. Go to **Bot** tab → click **Add Bot**
4. Under **Token**, click **Reset Token** → copy and save it (this is your `DISCORD_TOKEN`)
5. Scroll down to **Privileged Gateway Intents** and enable:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
6. Go to **OAuth2 → General** → copy your **Client ID** (this is your `DISCORD_CLIENT_ID`)

**Invite the bot to your server:**
1. Go to **OAuth2 → URL Generator**
2. Select scopes: `bot` + `applications.commands`
3. Select permissions: `Send Messages`, `Read Messages`, `Use Slash Commands`, `Embed Links`, `Read Message History`
4. Copy the generated URL → open it → invite to your QuillGlow server
5. In your server settings, right-click your server name → **Copy Server ID** (this is your `DISCORD_GUILD_ID`)

---

### Step 3 — Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / Log in
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key (this is your `GROQ_API_KEY`)

---

### Step 4 — Install & Configure

```bash
# 1. Clone or download this project
cd quillglow-bot

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_GUILD_ID=your_guild_id_here

GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

BOT_NAME=GlowBot
MAX_CONVERSATION_HISTORY=10
RATE_LIMIT_PER_USER=10
```

---

### Step 5 — Deploy Slash Commands

```bash
npm run deploy-commands
```

This registers all `/commands` with Discord. Since `DISCORD_GUILD_ID` is set, they appear **instantly** in your server.

---

### Step 6 — Start the Bot! 🎉

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

You should see:
```
✨ QuillGlow Bot is online as GlowBot#1234
```

---

## 💬 How to Talk to GlowBot

### Option A — Mention the bot (works in any channel)
```
@GlowBot how do I use the citation tool on quillglow?
@GlowBot I'm really stressed about my exam tomorrow
@GlowBot tell me something funny
```

### Option B — Restrict to specific channels (recommended)
In your `.env`, add the channel IDs where GlowBot should auto-respond:
```env
AI_CHANNEL_IDS=123456789,987654321
```

### Option C — Slash Commands (anywhere in the server)

---

## 📋 All Commands

| Command | Description |
|---------|-------------|
| `/help` | Overview of everything GlowBot can do |
| `/quillglow` | Get help with QuillGlow.com features |
| `/studytip` | Personalized study tips & productivity hacks |
| `/breathe` | Guided breathing exercise (4-7-8, Box, 5-5) |
| `/game` | Stress-busting mini-games (word chain, trivia, gratitude, etc.) |
| `/joke` | Wholesome jokes (student, nerdy, dad, random) |
| `/vibe` | Today's study vibe with music mood & motivation |
| `/affirmation` | Personalized affirmation based on your mood |
| `/vent` | 🔒 Private space to share feelings (ephemeral) |
| `/checkin` | 🔒 Daily mental health check-in with mood buttons |
| `/reset` | Clear conversation history for a fresh start |

---

## 🧠 How the AI Works

GlowBot uses **Groq's llama-3.3-70b-versatile** — one of the fastest and highest-quality open models available.

- **Conversation Memory**: GlowBot remembers the last 10 exchanges per user (stored in memory, resets every 30 min of inactivity)
- **Intent Detection**: Automatically detects if you're stressed, emotional, or asking study questions and adjusts its tone
- **Rate Limiting**: 10 messages per user per minute to prevent abuse
- **Crisis Detection**: Automatically shows mental health crisis resources if concerning keywords are detected

---

## 🔒 Privacy & Safety

- `/vent` and `/checkin` responses are **ephemeral** — only visible to the user
- No conversation data is stored to disk — everything is in-memory
- Crisis keywords trigger immediate resource display
- GlowBot is **not a replacement for professional mental health support** — it always encourages users to seek professional help for serious concerns

---

## 📁 Project Structure

```
quillglow-bot/
├── src/
│   ├── index.js          # Bot entry point
│   ├── groqClient.js     # Groq AI integration + conversation memory
│   ├── messageHandler.js # Handles @mention chat messages
│   ├── commandHandler.js # Loads and routes slash commands
│   ├── rateLimiter.js    # Per-user rate limiting
│   ├── logger.js         # Winston logger
│   └── deployCommands.js # Registers slash commands with Discord
├── commands/
│   ├── help.js           # /help
│   ├── quillglow.js      # /quillglow
│   ├── studytip.js       # /studytip
│   ├── breathe.js        # /breathe
│   ├── game.js           # /game
│   ├── joke.js           # /joke
│   ├── vibe.js           # /vibe
│   ├── affirmation.js    # /affirmation
│   ├── vent.js           # /vent (private)
│   ├── checkin.js        # /checkin (private)
│   └── reset.js          # /reset
├── logs/                 # Auto-created by logger
├── .env.example          # Environment variable template
├── .env                  # Your actual config (never commit this!)
├── package.json
└── README.md
```

---

## 🛠️ Customization

### Change the bot's name / personality
Edit the `SYSTEM_PROMPT` in `src/groqClient.js`

### Add QuillGlow-specific knowledge
In `src/groqClient.js`, expand the **QuillGlow Platform Knowledge** section with real feature details

### Add new commands
1. Create `commands/yourcommand.js`
2. Follow the pattern of existing commands (export `data` + `execute`)
3. Run `npm run deploy-commands`

### Restrict bot to specific channels
```env
AI_CHANNEL_IDS=channelId1,channelId2
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot doesn't respond to messages | Check `Message Content Intent` is enabled in Discord Dev Portal |
| Slash commands don't appear | Run `npm run deploy-commands`, wait a few seconds |
| `DISCORD_TOKEN invalid` error | Regenerate token in Discord Dev Portal |
| Groq API errors | Check your `GROQ_API_KEY` and Groq account quota |
| Bot offline | Check logs in `logs/error.log` |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `discord.js` v14 | Discord bot framework |
| `groq-sdk` | Groq AI API client |
| `dotenv` | Environment variable loading |
| `winston` | Logging |
| `node-cache` | In-memory caching (conversations + rate limits) |

---

## 🌟 Made for QuillGlow

Built with ❤️ for the QuillGlow student community.  
**[quillglow.com](https://quillglow.com)** — Write better. Study smarter. Glow. ✨
