// bot/index.ts
import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { Room } from '@/lib/types';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN missing');
if (!process.env.BACKEND_BASE_URL) throw new Error('BACKEND_BASE_URL missing');
if (!process.env.APP_URL) throw new Error('APP_URL missing');

const API_BASE_URL = process.env.BACKEND_BASE_URL;
const APP_URL = process.env.APP_URL;
const ROOMS_PER_PAGE = 10;
const currency = "Birr";

const bot = new Telegraf(process.env.BOT_TOKEN);

// ---------------- State ----------------
const awaitingNickname = new Map<number, boolean>();
const availableLanguages = ['en', 'am'];
const languageFullName = { en: "English", am: "አማርኛ" };
const userLanguageMap = new Map<number, string>();
const registeredUsersCache = new Map<number, boolean>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ---------------- Helpers ----------------
function getUserLanguage(ctx: any) {
  const userId = ctx.from?.id;
  return userId ? userLanguageMap.get(userId) || 'en' : 'en';
}

const translations: Record<string, Record<string, string>> = {
  en: {
    greeting: "Welcome to Bingo Family!",
    noRooms: "❌ No rooms available right now.",
    fetchError: "❌ Failed to load rooms. Please try again later.",
    chooseRoom: "🎲 Choose a Bingo game room:",
    openingWebview: "🌐 Opening Web View",
    startGame: "🎮 Start Game selected!",
    deposit: "💰 Deposit here:",
    transfer: "🔁 Transfer here:",
    withdraw: "💸 Withdraw here:",
    instructions: "📖 Instructions:",
    support: "🧑‍💻 Contact support:",
    languageChanged: "🌐 Language changed to",
    wallet: "💰 Your Wallet",
    btnBalance: "💵 Wallet Balance",
    btnWebview: "🌐 Web View",
    btnGameRooms: "🎲 Game Rooms",
    btnStartGame: "🎮 Start Game",
    btnDeposit: "💰 Deposit Fund",
    btnTransfer: "🔁 Transfer Fund",
    btnWithdraw: "💸 Withdraw Money",
    btnInstructions: "📖 Instructions",
    changeNickname: "👤 Change Your Nickname",
    chooseCommand: "Choose:",
    btnSupport: "🧑‍💻 Support",
    btnLanguage: "🌐 Language",
    prev: "⬅️ Prev",
    next: "Next ➡️"
  },
  am: {
    greeting: "እንኳን ወደ ቢንጎ ቤተሰብ በደህና መጡ!",
    noRooms: "❌ አሁን ጨዋታዎች አልተገኙም",
    fetchError: "❌ ጨዋታዎችን ማግኘት አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    chooseRoom: "🎲 ጨዋታዎችን ይምረጡ:",
    openingWebview: "🌐 ድህረገፁ እየተከፈተ ነው",
    startGame: "🎮 ጨዋታ ጀምር",
    deposit: "💰 ገንዘብ አስቀምጥ:",
    transfer: "🔁 ገንዘብ ለጓደኛ ይላኩ:",
    withdraw: "💸 ገንዘብ ያውጡ:",
    instructions: "📖 የጨዋታ መመሪያዎች፡",
    support: "🧑‍💻 ድጋፍ ያግኙ:",
    languageChanged: "🌐 ቋንቋ ተቀይሯል: ",
    wallet: "💰 ቀሪ ገንዘብ",
    btnBalance: "💵 ቀሪ ገንዘብ",
    btnWebview: "🌐 ድህረገፁን ይክፈቱ",
    btnGameRooms: "🎲 ጨዋታዎች",
    btnStartGame: "🎮 ጨዋታ ጀምር",
    btnDeposit: "💰 ገንዘብ አስቀምጥ",
    btnTransfer: "🔁 ገንዘብ ለጓደኛ ላክ",
    btnWithdraw: "💸 ገንዘብ ያውጡ",
    btnInstructions: "📖 የጨዋታ መመሪያዎች",
    changeNickname: "👤 ቅጽል ስም ቀይር",
    btnSupport: "🧑‍💻 ድጋፍ ያግኙ",
    btnLanguage: "🌐 ቋንቋ ይምረጡ",
    chooseCommand: "ይምረጡ፡",
    prev: "⬅️ ቀዳሚ",
    next: "ቀጣይ ➡️"
  }
};

function t(ctx: any, key: string): string {
  const lang = getUserLanguage(ctx);
  return translations[lang]?.[key] || translations['en'][key] || key;
}

// ---------------- Inline Menu ----------------
function getInlineMenu(lang: string) {
  const langTrans = translations[lang];
  return Markup.inlineKeyboard([
    [Markup.button.callback(langTrans.btnStartGame, 'cmd_startgame')],
    [Markup.button.callback(langTrans.btnGameRooms, 'cmd_gamerooms'), Markup.button.webApp(langTrans.btnWebview, `${APP_URL}/${lang}`)],
    [Markup.button.webApp(langTrans.btnDeposit, `${APP_URL}/${lang}/deposit`),
     Markup.button.webApp(langTrans.btnWithdraw, `${APP_URL}/${lang}/withdraw`),
     Markup.button.webApp(langTrans.btnTransfer, `${APP_URL}/${lang}/transfer`)],
    [Markup.button.webApp(langTrans.btnBalance, `${APP_URL}/${lang}/wallet`)],
    [Markup.button.webApp(langTrans.btnInstructions, `${APP_URL}/${lang}/instructions`),
     Markup.button.callback(langTrans.changeNickname, `change_name`)],
    [Markup.button.callback(langTrans.btnSupport, 'cmd_support'),
     Markup.button.callback(langTrans.btnLanguage, 'cmd_language')]
  ]);
}

// ---------------- Core Functions ----------------
async function showStartMenu(ctx: any) {
  const lang = getUserLanguage(ctx);
  const languageMap = translations[lang];
  await ctx.reply(languageMap.chooseCommand, getInlineMenu(lang));
}

async function showRooms(ctx: any, page = 1) {
  try {
    const response = await axios.get<{ data: Room[] }>(`${API_BASE_URL}/api/v1/public/rooms`);
    const rooms = response.data.data;
    if (!rooms || rooms.length === 0) return await ctx.reply(t(ctx, 'noRooms'));

    const startIdx = (page - 1) * ROOMS_PER_PAGE;
    const pagedRooms = rooms.slice(startIdx, startIdx + ROOMS_PER_PAGE);
    const roomButtons = pagedRooms.map(room => Markup.button.webApp(`(${room.entryFee} ${currency})`, `${APP_URL}/${getUserLanguage(ctx)}/rooms/${room.id}`));
    const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
    const navButtons: any[] = [];
    if (page > 1) navButtons.push(Markup.button.callback(t(ctx, 'prev'), `show_rooms_${page - 1}`));
    if (page < totalPages) navButtons.push(Markup.button.callback(t(ctx, 'next'), `show_rooms_${page + 1}`));

    await ctx.reply(t(ctx, 'chooseRoom'), Markup.inlineKeyboard([...roomButtons, ...navButtons], { columns: 2 }));
  } catch (err) {
    console.error('[ERROR] Failed to fetch rooms:', err);
    await ctx.reply(t(ctx, 'fetchError'));
  }
}

// ---------------- Registration Middleware ----------------
function cacheUser(userId: number) {
  registeredUsersCache.set(userId, true);
  setTimeout(() => registeredUsersCache.delete(userId), CACHE_TTL_MS);
}

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const isStart = ctx.message?.text === '/start';
  const isContact = ctx.message?.contact !== undefined;
  let isRegistered = registeredUsersCache.has(userId);

  if (!isRegistered) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/secured/user-profile/${userId}`);
      isRegistered = response.data?.success && response.data?.data?.telegramId === userId;
      if (isRegistered) cacheUser(userId);
    } catch { isRegistered = false; }
  }

  if (!isRegistered && !isStart && !isContact) {
    await ctx.reply('📌 Please share your phone number first to register.',
      Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number To Register')]]).resize().oneTime()
    );
    return;
  }

  await next();
});

// ---------------- Start Command ----------------
bot.command('start', async (ctx) => {
  const userId = ctx.from?.id!;
  let isRegistered = registeredUsersCache.has(userId);

  if (!isRegistered) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/public/user-profile/${userId}`);
      isRegistered = response.data?.success && response.data?.data?.telegramId === userId;
      if (isRegistered) cacheUser(userId);
    } catch { isRegistered = false; }
  }

  if (!isRegistered) {
    await ctx.reply('👋 Welcome! Please share your phone number to continue.',
      Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number')]]).resize().oneTime(false)
    );
    return;
  }

  await showStartMenu(ctx);
});

// ---------------- Contact Handler ----------------
bot.on(message('contact'), async (ctx: any) => {
  if (!ctx.message?.contact) return;
  const contact = ctx.message.contact;
  const userId = ctx.from?.id!;
  if (!contact.phone_number) return await ctx.reply('❌ Could not get your phone number. Please try again.');

  const firstName = contact.first_name || ctx.from?.first_name;
  if (!firstName) return await ctx.reply('❌ Please set a first name in your Telegram profile and try again.');

  const payload = {
    telegramId: userId,
    firstName,
    lastName: contact.last_name || ctx.from?.last_name,
    phoneNumber: contact.phone_number,
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/public/user-profile/register`, payload);
    if (!response.data.success) {
      const errors = response.data.errors;
      if (errors && typeof errors === 'object') {
        const errorMessages = Object.entries(errors).map(([field, msg]) => `❌ ${field}: ${msg}`).join('\n');
        return await ctx.reply(`Registration failed:\n${errorMessages}`);
      }
      return await ctx.reply(`❌ Registration failed: ${response.data.message || 'Unknown error'}`);
    }

    cacheUser(userId);
    await ctx.reply(`✅ Registration complete! Welcome, ${firstName}.`, Markup.removeKeyboard());
    await showStartMenu(ctx);

  } catch (err: any) {
    console.error('Registration error:', err.response?.data || err.message);
    const errorMsg = err.response?.data?.message || '❌ Failed to register. Please try again.';
    await ctx.reply(errorMsg);
    const errors = err.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      const errorMessages = Object.entries(errors).map(([field, msg]) => `❌ ${field}: ${msg}`).join('\n');
      return await ctx.reply(`Details:\n${errorMessages}`);
    }
  }
});

// ---------------- Change Nickname ----------------
bot.action('change_name', async (ctx) => {
  await ctx.answerCbQuery();
  const lang = getUserLanguage(ctx);
  const userId = ctx.from?.id;
  if (!userId) return;
  awaitingNickname.set(userId, true);
  await ctx.reply(lang === 'am'
    ? "👤 እባክዎን አዲስ ቅጽል ስምዎን ያስገቡ።"
    : "👤 Please enter your new nickname:"
  );
  setTimeout(() => awaitingNickname.delete(userId), 120_000);
});

bot.on(message('text'), async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return next();
  const text = ctx.message.text.trim();
  if (text.startsWith('/')) return next();
  if (!awaitingNickname.get(userId)) return next();

  awaitingNickname.delete(userId);
  const newNickname = text;
  const lang = getUserLanguage(ctx);
  if (!newNickname) return await ctx.reply(lang === 'am' ? "❌ ስም ተሳስቷል። እባክዎ ደግመው ይሞክሩ።" : "❌ Invalid nickname. Please try again.");

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/secured/user-profile/update-nickname?telegramId=${userId}&nickName=${newNickname}`
    );
    if (response.data?.success) {
      await ctx.reply(lang === 'am'
        ? `✅ ስምዎ ወደ "${newNickname}" ተቀይሯል።`
        : `✅ Your nickname has been changed to "${newNickname}".`
      );
    } else {
      await ctx.reply(lang === 'am' ? "❌ ስም መቀየር አልተሳካም።" : "❌ Failed to update nickname.");
    }
  } catch (err: any) {
    console.error('Nickname change error:', err.response?.data || err.message);
    await ctx.reply(lang === 'am' ? "❌ የመረጃ ጥያቄ ችግኝ ነበር።" : "❌ There was an error updating your nickname.");
  }
  await showStartMenu(ctx);
});

// ---------------- Inline Handlers ----------------
bot.action('cmd_webview', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(t(ctx, 'openingWebview'), Markup.inlineKeyboard([Markup.button.webApp('Open Web', `${APP_URL}/${getUserLanguage(ctx)}`)]));
});

bot.action('cmd_gamerooms', async (ctx) => { await ctx.answerCbQuery(); await showRooms(ctx); });
bot.action('cmd_startgame', async (ctx) => { await ctx.answerCbQuery(); await showRooms(ctx); });

bot.action('cmd_wallet', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(t(ctx, 'wallet'), Markup.inlineKeyboard([Markup.button.webApp('Your Wallet', `${APP_URL}/${getUserLanguage(ctx)}/wallet`)])); });
bot.action('cmd_deposit', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(t(ctx, 'deposit'), Markup.inlineKeyboard([Markup.button.webApp('Deposit Fund', `${APP_URL}/${getUserLanguage(ctx)}/deposit`)])); });
bot.action('cmd_transfer', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(t(ctx, 'transfer'), Markup.inlineKeyboard([Markup.button.webApp('Transfer Fund', `${APP_URL}/${getUserLanguage(ctx)}/transfer`)])); });
bot.action('cmd_withdraw', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(t(ctx, 'withdraw'), Markup.inlineKeyboard([Markup.button.webApp('Withdraw Money', `${APP_URL}/${getUserLanguage(ctx)}/withdraw`)])); });
bot.action('cmd_instructions', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(t(ctx, 'instructions'), Markup.inlineKeyboard([Markup.button.webApp('How to Play', `${APP_URL}/${getUserLanguage(ctx)}/instructions`)])); });
bot.action('cmd_support', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply(t(ctx, 'support'), Markup.inlineKeyboard([Markup.button.webApp('Get Support', `${APP_URL}/${getUserLanguage(ctx)}/support`)])); });

bot.action('cmd_language', async (ctx) => {
  await ctx.answerCbQuery();
  const inlineButtons = availableLanguages.map(lang => Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`));
  await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
});


bot.action(/set_language_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();

  const selectedLang = ctx.match?.[1] as 'en' | 'am' | undefined; // assert allowed keys
  const userId = ctx.from?.id;
  if (!userId || !selectedLang || !availableLanguages.includes(selectedLang)) return;

  userLanguageMap.set(userId, selectedLang);

  await ctx.reply(`${translations[selectedLang].languageChanged} ${languageFullName[selectedLang]}`);
  await showStartMenu(ctx);
});


// ---------------- Pagination ----------------
bot.action(/show_rooms_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const page = parseInt(ctx.match[1], 10);
  await showRooms(ctx, page);
});

export default bot;
