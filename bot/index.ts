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

export const BOT_TOKEN = process.env.BOT_TOKEN!;
export const API_BASE_URL = process.env.BACKEND_BASE_URL!;
export const APP_URL = process.env.APP_URL!;
export const ROOMS_PER_PAGE = 10;
export const currency = 'Birr';

export const bot = new Telegraf(BOT_TOKEN);

// ---------------- State ----------------
const awaitingNickname = new Map<number, boolean>();
const userLanguageMap = new Map<number, string>();
const registeredUsersCache = new Map<number, boolean>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const availableLanguages = ['en', 'am'];
const languageFullName = { en: 'English', am: 'አማርኛ' };

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

function t(ctx: any, key: string) {
  const lang = getUserLanguage(ctx);
  return translations[lang]?.[key] || translations['en'][key] || key;
}

// ---------------- Registration Cache ----------------
function cacheUser(userId: number) {
  registeredUsersCache.set(userId, true);
  setTimeout(() => registeredUsersCache.delete(userId), CACHE_TTL_MS);
}

// ---------------- Middleware: Registration ----------------
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
    } catch {
      isRegistered = false;
    }
  }

  if (!isRegistered && !isStart && !isContact) {
    await ctx.reply(
      '📌 Please share your phone number first to register.',
      Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number To Register')]]).resize().oneTime()
    );
    return;
  }

  await next();
});

// ---------------- Start ----------------
bot.start(async (ctx) => {
  const userId = ctx.from?.id!;
  let isRegistered = registeredUsersCache.has(userId);

  if (!isRegistered) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/public/user-profile/${userId}`);
      isRegistered = response.data?.success && response.data?.data?.telegramId === userId;
      if (isRegistered) cacheUser(userId);
    } catch {
      isRegistered = false;
    }
  }

  if (!isRegistered) {
    await ctx.reply(
      '👋 Welcome! Please share your phone number to continue.',
      Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number')]]).resize().oneTime(false)
    );
    return;
  }

  await showStartMenu(ctx);
});

// ---------------- Contact ----------------
bot.on(message('contact'), async (ctx) => {
  const contact = ctx.message.contact;
  if (!contact) return;
  const userId = ctx.from?.id!;
  const firstName = contact.first_name || ctx.from?.first_name;
  if (!firstName) return await ctx.reply('❌ Please set a first name in Telegram.');

  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/public/user-profile/register`, {
      telegramId: userId,
      firstName,
      lastName: contact.last_name || ctx.from?.last_name,
      phoneNumber: contact.phone_number
    });
    if (!response.data.success) return await ctx.reply('❌ Registration failed');
    cacheUser(userId);
    await ctx.reply(`✅ Registration complete! Welcome, ${firstName}.`, Markup.removeKeyboard());
    await showStartMenu(ctx);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    await ctx.reply('❌ Failed to register. Please try again.');
  }
});

// ---------------- Change Nickname ----------------
bot.action('change_name', async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from?.id;
  if (!userId) return;
  awaitingNickname.set(userId, true);
  await ctx.reply('👤 Please enter your new nickname:');
  setTimeout(() => awaitingNickname.delete(userId), 120_000);
});

bot.on(message('text'), async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return next();
  if (!awaitingNickname.get(userId)) return next();

  awaitingNickname.delete(userId);
  const newNickname = ctx.message.text.trim();
  if (!newNickname) return await ctx.reply('❌ Invalid nickname. Please try again.');

  try {
    const response = await axios.put(`${API_BASE_URL}/api/v1/secured/user-profile/update-nickname?telegramId=${userId}&nickName=${newNickname}`);
    if (response.data.success) {
      await ctx.reply(`✅ Your nickname has been changed to "${newNickname}".`);
    } else {
      await ctx.reply('❌ Failed to update nickname.');
    }
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    await ctx.reply('❌ There was an error updating your nickname.');
  }

  await showStartMenu(ctx);
});

// ---------------- Rooms ----------------
export async function showRooms(ctx: any, page = 1) {
  try {
    const response = await axios.get<{ data: Room[] }>(`${API_BASE_URL}/api/v1/public/rooms`);
    const rooms = response.data.data;
    if (!rooms || !rooms.length) return await ctx.reply(t(ctx, 'noRooms'));

    const startIdx = (page - 1) * ROOMS_PER_PAGE;
    const pagedRooms = rooms.slice(startIdx, startIdx + ROOMS_PER_PAGE);

    const roomButtons = pagedRooms.map(r => Markup.button.webApp(`(${r.entryFee} ${currency})`, `${APP_URL}/${getUserLanguage(ctx)}/rooms/${r.id}`));
    const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
    const navButtons: any[] = [];
    if (page > 1) navButtons.push(Markup.button.callback(t(ctx, 'prev'), `show_rooms_${page - 1}`));
    if (page < totalPages) navButtons.push(Markup.button.callback(t(ctx, 'next'), `show_rooms_${page + 1}`));

    await ctx.reply(t(ctx, 'chooseRoom'), Markup.inlineKeyboard([...roomButtons, ...navButtons], { columns: 2 }));
  } catch (err) {
    console.error(err);
    await ctx.reply(t(ctx, 'fetchError'));
  }
}

// ---------------- Start Menu ----------------
export function getUserLanguage(ctx: any) {
  const userId = ctx.from?.id;
  return userId ? userLanguageMap.get(userId) || 'en' : 'en';
}

export function getInlineMenu(lang: string) {
  const l = translations[lang];
  return Markup.inlineKeyboard([
    [Markup.button.callback(l.btnStartGame, 'cmd_startgame')],
    [Markup.button.callback(l.btnGameRooms, 'cmd_gamerooms'), Markup.button.webApp(l.btnWebview, `${APP_URL}/${lang}`)],
    [
      Markup.button.webApp(l.btnDeposit, `${APP_URL}/${lang}/deposit`),
      Markup.button.webApp(l.btnWithdraw, `${APP_URL}/${lang}/withdraw`),
      Markup.button.webApp(l.btnTransfer, `${APP_URL}/${lang}/transfer`)
    ],
    [Markup.button.webApp(l.btnBalance, `${APP_URL}/${lang}/wallet`)],
    [Markup.button.webApp(l.btnInstructions, `${APP_URL}/${lang}/instructions`), Markup.button.callback(l.changeNickname, 'change_name')],
    [Markup.button.callback(l.btnSupport, 'cmd_support'), Markup.button.callback(l.btnLanguage, 'cmd_language')]
  ]);
}

export async function showStartMenu(ctx: any) {
  const lang = getUserLanguage(ctx);
  await ctx.reply(translations[lang].chooseCommand, getInlineMenu(lang));
}

// ---------------- Inline Handlers ----------------
bot.action('cmd_gamerooms', async (ctx) => { await ctx.answerCbQuery(); await showRooms(ctx); });
bot.action('cmd_startgame', async (ctx) => { await ctx.answerCbQuery(); await showRooms(ctx); });
bot.action('cmd_language', async (ctx) => {
  await ctx.answerCbQuery();
  const buttons = availableLanguages.map(l => Markup.button.callback(l.toUpperCase(), `set_language_${l}`));
  await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(buttons, { columns: 2 }));
});
bot.action(/set_language_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const lang = ctx.match?.[1];
  const userId = ctx.from?.id;
  if (!userId || !lang) return;
  userLanguageMap.set(userId, lang);
  await ctx.reply(`${translations[lang].languageChanged} ${languageFullName[lang as keyof typeof languageFullName]}`);
  await showStartMenu(ctx);
});
bot.action(/show_rooms_(\d+)/, async (ctx) => { await ctx.answerCbQuery(); const page = parseInt(ctx.match?.[1] || '1'); await showRooms(ctx, page); });

// ---------------- Commands ----------------
bot.command('menu', async (ctx) => await showStartMenu(ctx));
bot.command('gamerooms', async (ctx) => await showRooms(ctx));
bot.command('startgame', async (ctx) => await showRooms(ctx));
bot.command('webview', async (ctx) => await ctx.reply(t(ctx, 'openingWebview'), Markup.inlineKeyboard([Markup.button.webApp('Open Web', `${APP_URL}/${getUserLanguage(ctx)}`)])));
bot.command('wallet', async (ctx) => await ctx.reply(t(ctx, 'wallet'), Markup.inlineKeyboard([Markup.button.webApp('Your Wallet', `${APP_URL}/${getUserLanguage(ctx)}/wallet`)])));
bot.command('deposit', async (ctx) => await ctx.reply(t(ctx, 'deposit'), Markup.inlineKeyboard([Markup.button.webApp('Deposit Fund', `${APP_URL}/${getUserLanguage(ctx)}/deposit`)])));
bot.command('transfer', async (ctx) => await ctx.reply(t(ctx, 'transfer'), Markup.inlineKeyboard([Markup.button.webApp('Transfer Fund', `${APP_URL}/${getUserLanguage(ctx)}/transfer`)])));
bot.command('withdraw', async (ctx) => await ctx.reply(t(ctx, 'withdraw'), Markup.inlineKeyboard([Markup.button.webApp('Withdraw Money', `${APP_URL}/${getUserLanguage(ctx)}/withdraw`)])));
bot.command('instructions', async (ctx) => await ctx.reply(t(ctx, 'instructions'), Markup.inlineKeyboard([Markup.button.webApp('How to Play', `${APP_URL}/${getUserLanguage(ctx)}/instructions`)])));
bot.command('support', async (ctx) => await ctx.reply(t(ctx, 'support'), Markup.inlineKeyboard([Markup.button.webApp('Get Support', `${APP_URL}/${getUserLanguage(ctx)}/support`)])));
bot.command('language', async (ctx) => {
  const buttons = availableLanguages.map(l => Markup.button.callback(l.toUpperCase(), `set_language_${l}`));
  await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(buttons, { columns: 2 }));
});
