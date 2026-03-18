# 🚀 How to Keep GlowBot Running 24/7 — For Free

This guide covers the best **free** options to host your Discord bot around the clock.
No credit card required for any of these.

---

## ⭐ Best Option: Railway (Recommended)

**Railway** is the easiest, most reliable free host for Discord bots in 2024.

### Why Railway?
- ✅ 500 free hours/month (enough for 24/7 on one bot)
- ✅ Deploys directly from GitHub in minutes
- ✅ Persistent — never sleeps, no cold starts
- ✅ Free logs, environment variables, and restarts
- ✅ No credit card needed

### Step-by-Step Setup

**1. Push your bot to GitHub**
```bash
cd quillglow-bot
git init
git add .
git commit -m "Initial GlowBot commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/quillglow-bot.git
git push -u origin main
```

**2. Create a Railway account**
- Go to [railway.app](https://railway.app)
- Sign up with your GitHub account

**3. Deploy**
- Click **New Project** → **Deploy from GitHub repo**
- Select your `quillglow-bot` repository
- Railway auto-detects Node.js and runs `npm start`

**4. Add environment variables**
- In Railway dashboard → your project → **Variables** tab
- Add each variable from your `.env` file:
  ```
  DISCORD_TOKEN = your_token
  DISCORD_CLIENT_ID = your_client_id
  DISCORD_GUILD_ID = your_guild_id
  GROQ_API_KEY = your_groq_key
  GROQ_MODEL = llama-3.3-70b-versatile
  BOT_NAME = GlowBot
  MAX_CONVERSATION_HISTORY = 10
  RATE_LIMIT_PER_USER = 10
  ```

**5. Done!** 🎉
Your bot deploys automatically and stays online 24/7.
Any `git push` to GitHub auto-redeploys.

---

## 🥈 Option 2: Render (Also Great)

**Render** is another solid free option.

### Setup
1. Go to [render.com](https://render.com) → sign up with GitHub
2. **New** → **Web Service** → connect your GitHub repo
3. Configure:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add your environment variables in the **Environment** tab
5. Deploy!

### ⚠️ Important: Prevent Sleep
Render free tier sleeps after 15 min of inactivity. To prevent this, add this to your `src/index.js`:

```javascript
// Add this after client.login() — keeps Render awake
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end('GlowBot is alive! 🌟')).listen(PORT);
```

Then set up a free ping service:
- Go to [cron-job.org](https://cron-job.org) → create free account
- Add a cron job that pings your Render URL every 14 minutes
- This keeps your bot awake permanently

---

## 🥉 Option 3: Fly.io (Technical but Powerful)

**Fly.io** gives you a small free VM that never sleeps.

### Setup
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# In your bot directory:
fly launch   # Follow prompts, choose free tier
fly secrets set DISCORD_TOKEN=xxx GROQ_API_KEY=xxx  # etc.
fly deploy
```

Create a `Dockerfile` in your project:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["node", "src/index.js"]
```

---

## 🆓 Option 4: Oracle Cloud Always Free (Most Powerful)

Oracle Cloud gives you a **truly free forever** VM — no time limits.

- Sign up at [cloud.oracle.com](https://cloud.oracle.com) (requires credit card for verification, but never charged)
- Create an **Always Free** VM (ARM shape, 4 CPU + 24GB RAM — incredibly generous)
- SSH in, install Node.js, clone your repo
- Use **PM2** to keep it running forever:

```bash
npm install -g pm2
pm2 start src/index.js --name glowbot
pm2 startup   # Auto-start on reboot
pm2 save
```

---

## 🔄 Keeping the Bot Healthy (All Platforms)

### Add PM2 for local/VPS deployments
```bash
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name glowbot

# Auto-restart on crash
pm2 start src/index.js --name glowbot --max-restarts 10 --restart-delay 5000

# View logs
pm2 logs glowbot

# Monitor
pm2 monit
```

### Add a health check to your bot (optional but recommended)
Add to `src/index.js` after `client.login()`:

```javascript
// Simple HTTP health check — useful for Render/Railway uptime pings
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`GlowBot 🌟 is online! Guilds: ${client.guilds.cache.size}`);
}).listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});
```

---

## 📊 Comparison Table

| Platform | Free Hours | Sleeps? | Difficulty | Best For |
|----------|-----------|---------|------------|----------|
| **Railway** ⭐ | 500/mo | Never | Easy | Most users |
| **Render** | Unlimited* | Yes (fix with ping) | Easy | Backup option |
| **Fly.io** | ~160hrs | Never | Medium | Developers |
| **Oracle Cloud** | Unlimited | Never | Hard | Long-term |
| **Local PC** | Unlimited | When off | Easy | Testing only |

---

## 🔐 Security Reminders

- **Never** commit your `.env` file — `.gitignore` already excludes it ✅
- Add environment variables directly in the hosting platform's dashboard
- Rotate your tokens if you accidentally expose them
- Railway/Render encrypt your env vars at rest

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot offline after deploy | Check platform logs for errors |
| "Invalid token" error | Re-copy token from Discord Dev Portal |
| Bot goes offline randomly | Use Railway (most stable) or add PM2 |
| Render bot sleeping | Set up cron-job.org ping every 14 min |
| Out of Railway hours | Switch to Oracle Cloud Always Free |

---

*Made for the QuillGlow Discord community 🌟 — [quillglow.com](https://quillglow.com)*
