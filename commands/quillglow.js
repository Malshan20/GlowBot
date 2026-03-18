const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateFocused } = require('../src/groqClient');

const FEATURES = {
  mindmap: {
    name: '🗺️ AI Mind Map Generator',
    desc: 'Transform any PDF or pasted text into a beautiful interactive mind map. Color-coded branches, collapsible nodes, and PDF export — perfect for visualizing complex topics and spotting connections between concepts.',
    tip: 'Great for: revision before exams, understanding textbook chapters, and organizing essay arguments visually.',
  },
  revision: {
    name: '📝 AI Revision Notes Generator',
    desc: 'Upload your study materials and get exam-oriented revision notes with structured sections, highlighted key points, definitions, and exam tips. Export to PDF and study with confidence.',
    tip: 'Great for: last-minute exam prep, condensing textbooks, and building a clean revision pack.',
  },
  audio: {
    name: '🎧 AI Audio Overview',
    desc: 'Turn any study material into a spoken audio overview — like a personal podcast for your notes! Choose your style (lecture, conversational, or podcast), length, and playback speed. Commute Mode and Night Mode for hands-free studying anywhere.',
    tip: 'Great for: commutes, gym sessions, auditory learners, or falling asleep to content.',
  },
  study_together: {
    name: '👥 Study Together',
    desc: 'Join community channels, create private study rooms with invite codes, share images, and chat with Quilly — QuillGlow\'s AI assistant — for instant help. All in one place.',
    tip: 'Great for: group study sessions, accountability partners, and peer support.',
  },
  smart_notes: {
    name: '🗒️ Smart Notes',
    desc: 'Rich text editor with auto-save, search, tags, and export. AI-powered note-taking that helps you organize your thoughts and study materials effortlessly.',
    tip: 'Great for: lecture notes, research summaries, and building a personal knowledge library.',
  },
  smart_search: {
    name: '🔍 AI Smart Search',
    desc: 'Search with AI-powered summaries, YouTube lesson recommendations, and curated web resources. Get instant answers tailored specifically for students.',
    tip: 'Great for: understanding concepts fast, finding video explanations, and quick research.',
  },
  exam_generator: {
    name: '📋 AI Exam Generator',
    desc: 'Upload study materials and let AI generate practice exams with multiple choice and short answer questions. Test your knowledge before the real exam!',
    tip: 'Great for: self-testing, identifying weak spots, and building exam confidence.',
  },
  flashcards: {
    name: '🃏 Smart Flashcards',
    desc: 'Generate flashcards from PDFs, images, or text with spaced repetition and confidence ratings for highly effective memorization.',
    tip: 'Great for: vocabulary, definitions, dates, formulas, and any fact-based content.',
  },
  tutor: {
    name: '🤖 Multi-Source AI Tutor',
    desc: 'An AI tutor grounded in YOUR own uploaded PDFs, images, and notes — with citations. Get answers that come directly from your actual study materials.',
    tip: 'Great for: understanding confusing textbook sections, personalized Q&A, and cited explanations.',
  },
  pomodoro: {
    name: '⏱️ Pomodoro Timer',
    desc: 'Built-in focus timer with white noise, break tracking, and customizable sessions to maintain peak productivity throughout your study sessions.',
    tip: 'Classic method: 25 min focus → 5 min break × 4 → 20 min long break. Science-backed!',
  },
  planner: {
    name: '📅 Study Planner',
    desc: 'AI-powered task suggestions, calendar view, and schedule builder to help you stay organized and ahead of all your deadlines.',
    tip: 'Great for: semester planning, exam scheduling, and breaking big tasks into daily actions.',
  },
  analytics: {
    name: '📊 Progress Analytics',
    desc: 'Track your study hours, GPA estimation, burnout risk score, and mood over time. Know exactly where you stand and catch burnout early.',
    tip: 'Check your burnout risk score regularly — it\'s a game-changer for sustainable studying.',
  },
  zen_runner: {
    name: '🎮 Zen Runner Game',
    desc: 'Take a mindful break with QuillGlow\'s built-in chill endless runner. Jump obstacles, collect points, and destress between study sessions.',
    tip: 'Use it as a Pomodoro reward — 5 min of Zen Runner = a proper mental reset!',
  },
  stress_relief: {
    name: '🧘 Stress Relief',
    desc: 'Built-in AI stress coach with calming backgrounds and breathing exercises — right inside QuillGlow. No need to switch apps when you need a moment.',
    tip: 'Also use `/breathe` here on Discord anytime for guided breathing exercises from GlowBot!',
  },
  document_upload: {
    name: '📄 Document Upload',
    desc: 'Upload PDFs and documents to instantly generate flashcards and exam questions. Extracts knowledge from textbooks and lecture notes automatically.',
    tip: 'Upload your syllabus + lecture slides to get a full personalized study kit in seconds.',
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quillglow')
    .setDescription('🌟 Get help with any QuillGlow.com feature')
    .addStringOption(opt =>
      opt.setName('question')
        .setDescription('Ask anything about QuillGlow!')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('feature')
        .setDescription('Browse a specific feature')
        .setRequired(false)
        .addChoices(
          { name: '🗺️ AI Mind Map Generator', value: 'mindmap' },
          { name: '📝 AI Revision Notes Generator', value: 'revision' },
          { name: '🎧 AI Audio Overview', value: 'audio' },
          { name: '👥 Study Together', value: 'study_together' },
          { name: '🗒️ Smart Notes', value: 'smart_notes' },
          { name: '🔍 AI Smart Search', value: 'smart_search' },
          { name: '📋 AI Exam Generator', value: 'exam_generator' },
          { name: '🃏 Smart Flashcards', value: 'flashcards' },
          { name: '🤖 Multi-Source AI Tutor', value: 'tutor' },
          { name: '⏱️ Pomodoro Timer', value: 'pomodoro' },
          { name: '📅 Study Planner', value: 'planner' },
          { name: '📊 Progress Analytics', value: 'analytics' },
          { name: '🎮 Zen Runner Game', value: 'zen_runner' },
          { name: '🧘 Stress Relief', value: 'stress_relief' },
          { name: '📄 Document Upload', value: 'document_upload' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString('question');
    const featureKey = interaction.options.getString('feature');

    // No args → full feature overview
    if (!question && !featureKey) {
      const embed = new EmbedBuilder()
        .setColor(0x9B72CF)
        .setTitle('🌟 QuillGlow.com — Everything You Need to Glow')
        .setURL('https://quillglow.com')
        .setDescription('QuillGlow is your all-in-one AI study platform. Here\'s the full toolkit:')
        .addFields(
          { name: '🗺️ AI Mind Map Generator', value: 'PDF/text → interactive visual maps', inline: true },
          { name: '📝 AI Revision Notes', value: 'Exam-ready notes from your materials', inline: true },
          { name: '🎧 AI Audio Overview', value: 'Turn notes into a personal podcast', inline: true },
          { name: '👥 Study Together', value: 'Rooms, community & Quilly AI chat', inline: true },
          { name: '🗒️ Smart Notes', value: 'AI-powered rich text editor', inline: true },
          { name: '🔍 AI Smart Search', value: 'AI summaries + YouTube + web', inline: true },
          { name: '📋 AI Exam Generator', value: 'Practice exams from your materials', inline: true },
          { name: '🃏 Smart Flashcards', value: 'Spaced repetition from PDFs/images', inline: true },
          { name: '🤖 Multi-Source Tutor', value: 'AI tutor from YOUR own notes', inline: true },
          { name: '⏱️ Pomodoro Timer', value: 'Focus timer with white noise', inline: true },
          { name: '📅 Study Planner', value: 'AI tasks + calendar + schedule', inline: true },
          { name: '📊 Progress Analytics', value: 'Hours, GPA, burnout risk & mood', inline: true },
          { name: '🎮 Zen Runner Game', value: 'Chill mindful stress-break game', inline: true },
          { name: '🧘 Stress Relief', value: 'AI coach + breathing + calm vibes', inline: true },
          { name: '📄 Document Upload', value: 'Textbooks → instant flashcards', inline: true },
          {
            name: '\u200b',
            value: '🚀 **[Visit quillglow.com](https://quillglow.com)** to dive in!\nUse `/quillglow feature:` for details on any tool, or ask `/quillglow question:your question`',
            inline: false,
          },
        )
        .setFooter({ text: 'GlowBot 🌟 | quillglow.com' })
        .setTimestamp();

      return await interaction.editReply({ embeds: [embed] });
    }

    // Specific feature detail
    if (featureKey && !question) {
      const f = FEATURES[featureKey];
      const embed = new EmbedBuilder()
        .setColor(0x9B72CF)
        .setTitle(f.name)
        .setDescription(f.desc)
        .addFields(
          { name: '💡 Pro tip', value: f.tip, inline: false },
          { name: '🔗 Try it now', value: '[quillglow.com](https://quillglow.com) → find this in your dashboard!\nHave a specific question? Use `/quillglow question:your question`', inline: false },
        )
        .setFooter({ text: 'GlowBot 🌟 | quillglow.com' })
        .setTimestamp();

      return await interaction.editReply({ embeds: [embed] });
    }

    // AI-powered Q&A
    try {
      const featureContext = featureKey ? `Feature context: ${FEATURES[featureKey].name} — ${FEATURES[featureKey].desc}. ` : '';

      const answer = await generateFocused(
        `${featureContext}A student asks about QuillGlow.com: "${question}"

Answer using the real QuillGlow features: AI Mind Map Generator (PDF/text → interactive mind maps), AI Revision Notes Generator (exam-oriented notes with key points/definitions/tips, PDF export), AI Audio Overview (spoken study material in lecture/conversational/podcast style, Commute Mode, Night Mode), Study Together (community channels, private rooms with invite codes, Quilly AI assistant), Smart Notes (rich text editor, auto-save, search, tags), AI Smart Search (AI summaries, YouTube lessons, curated web), AI Exam Generator (practice exams from uploaded materials), Smart Flashcards (spaced repetition, confidence ratings), Multi-Source AI Tutor (grounded in user's own uploads with citations), Pomodoro Timer (white noise, break tracking), Study Planner (AI task suggestions, calendar, schedule builder), Progress Analytics (study hours, GPA estimation, burnout risk, mood), Zen Runner Game (mindful endless runner), Stress Relief (AI coach, calming backgrounds, breathing), Document Upload (PDF → flashcards + exam questions).

Be accurate, friendly and concise. Under 150 words. Always reference quillglow.com.`,
        'You are a knowledgeable QuillGlow platform expert. Be accurate and friendly.'
      );

      const embed = new EmbedBuilder()
        .setColor(0x9B72CF)
        .setTitle('🌟 QuillGlow Help')
        .addFields(
          { name: '❓ Your question', value: question, inline: false },
          { name: '💡 Answer', value: answer, inline: false },
          { name: '🔗 Explore more', value: '[quillglow.com](https://quillglow.com) — Need more help? Ask in #support or @mention me!', inline: false },
        )
        .setFooter({ text: 'GlowBot 🌟 | quillglow.com' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply('🌟 Check out [quillglow.com](https://quillglow.com) directly, or ask in #support!');
    }
  },
};
