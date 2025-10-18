
// import { NextRequest, NextResponse } from "next/server";

// dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN missing');
// if (!process.env.BACKEND_BASE_URL) throw new Error('BACKEND_BASE_URL missing');
// if (!process.env.APP_URL) throw new Error('APP_URL missing');

// const API_BASE_URL = process.env.BACKEND_BASE_URL;
// const APP_URL = process.env.APP_URL;
// const ROOMS_PER_PAGE = 10;
// const currency = "Birr";

// const bot = new Telegraf(process.env.BOT_TOKEN);

// // ---------------- Language state ----------------
// const availableLanguages = ['en', 'am'];
// const userLanguageMap = new Map<number, string>();

// function getUserLanguage(ctx: any) {
//   const userId = ctx.from?.id;
//   return userId ? userLanguageMap.get(userId) || 'en' : 'en';
// }

// // ---------------- Translation Helper ----------------
// const translations: Record<string, Record<string, string>> = {
//   en: {
//     greeting: "Welcome to Bingo Fam!",
//     noRooms: "❌ No rooms available right now.",
//     fetchError: "❌ Failed to load rooms. Please try again later.",
//     chooseRoom: "🎲 Choose a Bingo room:",
//     openingWebview: "🌐 Opening Web View Lobby",
//     startGame: "🎮 Start Game selected!",
//     deposit: "💰 Deposit here:",
//     transfer: "🔁 Transfer here:",
//     withdraw: "💸 Withdraw here:",
//     instructions: "📖 Instructions:",
//     support: "🧑‍💻 Contact support:",
//     languageChanged: "🌐 Language changed to",
//     btnWebview: "🌐 Web View Lobby",
//     btnGameRooms: "🎲 Game Rooms",
//     btnStartGame: "🎮 Start Game",
//     btnDeposit: "💰 Deposit Fund",
//     btnTransfer: "🔁 Transfer Fund",
//     btnWithdraw: "💸 Withdraw Money",
//     btnInstructions: "📖 Instructions",
//     btnSupport: "🧑‍💻 Support",
//     btnLanguage: "🌐 Language",
//     prev: "⬅️ Prev",
//     next: "Next ➡️"
//   },
//   am: {
//     greeting: "በቤንጎ ቤተሰብ ወደ እንኳን በደህና መጡ!",
//     noRooms: "❌ አሁን ክፍሎች የሉም።",
//     fetchError: "❌ ክፍሎችን ማስገባት አልተቻለም። እባክዎ ከፍ ያድርጉ።",
//     chooseRoom: "🎲 ክፍሎችን ይምረጡ:",
//     openingWebview: "🌐 የድህረገፅ እይታ እየተከፈተ ነው",
//     startGame: "🎮 ጨዋታ መጀመር ተጀምሯል!",
//     deposit: "💰 ተቀማጭ ያድርጉ:",
//     transfer: "🔁 ገንዘብ ይከፍሉ:",
//     withdraw: "💸 ገንዘብ ይወስዱ:",
//     instructions: "📖 መመሪያዎች:",
//     support: "🧑‍💻 ድጋፍ ያግኙ:",
//     languageChanged: "🌐 ቋንቋ ተቀይሯል",
//     btnWebview: "🌐 የድህረገፅ እይታ",
//     btnGameRooms: "🎲 የጨዋታ ክፍሎች",
//     btnStartGame: "🎮 ጨዋታ ጀምር",
//     btnDeposit: "💰 ተቀማጭ",
//     btnTransfer: "🔁 ክፍያ ላክ",
//     btnWithdraw: "💸 ገንዘብ ውሰድ",
//     btnInstructions: "📖 መመሪያ",
//     btnSupport: "🧑‍💻 ድጋፍ",
//     btnLanguage: "🌐 ቋንቋ",
//     prev: "⬅️ ቀድሞ",
//     next: "ቀጣይ ➡️"
//   }
// };

// function t(ctx: any, key: string): string {
//   const lang = getUserLanguage(ctx);
//   return translations[lang]?.[key] || translations['en'][key] || key;
// }

// // ---------------- Set localized commands ----------------
// async function setLocalizedCommands() {
//   await bot.telegram.setMyCommands([
//     { command: 'gamerooms', description: '🎲 Game Rooms' },
//     { command: 'startgame', description: '🎮 Start Game' },
//     { command: 'webview', description: '🌐 Open Web View' },
//     { command: 'wallet', description: '💰 See Your Wallet' },
//     { command: 'deposit', description: '💰 Deposit Fund' },
//     { command: 'transfer', description: '🔁 Transfer Fund' },
//     { command: 'withdraw', description: '💸 Withdraw Money' },
//     { command: 'instructions', description: '📖 Instructions' },
//     { command: 'support', description: '🧑‍💻 Support' },
//     { command: 'language', description: '🌐 Change Language' },
//   ], { language_code: 'en' });

//   await bot.telegram.setMyCommands([
//     { command: 'gamerooms', description: '🎲 የጨዋታ ክፍሎች' },
//     { command: 'startgame', description: '🎮 ጨዋታ ጀምር' },
//     { command: 'webview', description: '🌐 የድህረገፅ እይታ' },
//     { command: 'wallet', description: '💰 ዋሌትዎን ይመልከቱ' },
//     { command: 'deposit', description: '💰 ተቀማጭ' },
//     { command: 'transfer', description: '🔁 ክፍያ ላክ' },
//     { command: 'withdraw', description: '💸 ገንዘብ ውሰድ' },
//     { command: 'instructions', description: '📖 መመሪያ' },
//     { command: 'support', description: '🧑‍💻 ድጋፍ' },
//     { command: 'language', description: '🌐 ቋንቋ ለውጥ' },
//   ], { language_code: 'am' });
// }


// // function getFooterKeyboard(selectedLanguage = 'en') {
// //   const langTrans = translations[selectedLanguage];
// //   return {
// //     reply_markup: {
// //       keyboard: [
// //         [{ text: langTrans.btnWebview }],
// //         [{ text: langTrans.btnGameRooms }, { text: langTrans.btnStartGame }],
// //         [{ text: langTrans.btnDeposit }, { text: langTrans.btnTransfer }],
// //         [{ text: langTrans.btnWithdraw }, { text: langTrans.btnInstructions }],
// //         [{ text: langTrans.btnSupport }],
// //         [{ text: `${langTrans.btnLanguage}: ${selectedLanguage.toUpperCase()}` }]
// //       ],
// //       resize_keyboard: true,
// //       one_time_keyboard: false
// //     }
// //   };
// // }


// // ---------------- Show Rooms ----------------
// async function showRooms(ctx: any, page = 1) {
//   try {
//     const response = await axios.get<{ data: Room[] }>(`${API_BASE_URL}/api/v1/public/rooms`);
//     const rooms = response.data.data;
//     if (!rooms || rooms.length === 0) {
//       await ctx.reply(t(ctx, 'noRooms'));
//       return;
//     }

//     const startIdx = (page - 1) * ROOMS_PER_PAGE;
//     const pagedRooms = rooms.slice(startIdx, startIdx + ROOMS_PER_PAGE);

//     const roomButtons = pagedRooms.map(room =>
//       Markup.button.webApp(`(${room.entryFee} ${currency})`, `${APP_URL}/${getUserLanguage(ctx)}/rooms/${room.id}`)
//     );

//     const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
//     const navButtons: any[] = [];
//     if (page > 1) navButtons.push(Markup.button.callback(t(ctx, 'prev'), `show_rooms_${page - 1}`));
//     if (page < totalPages) navButtons.push(Markup.button.callback(t(ctx, 'next'), `show_rooms_${page + 1}`));

//     const inlineButtons = [...roomButtons, ...navButtons];
//     await ctx.reply(t(ctx, 'chooseRoom'), Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
//   } catch (err) {
//     console.error('[ERROR] Failed to fetch rooms:', err);
//     await ctx.reply(t(ctx, 'fetchError'));
//   }
// }

// // ---------------- Start Menu ----------------
// async function showStartMenu(ctx: any) {
//   const lang = getUserLanguage(ctx);
//   const firstName = ctx.from.first_name || 'Player';
//   const greeting =
//     lang === 'en' ? `👋 Hello ${firstName}!` :
//     lang === 'am' ? `👋 ሰላም ${firstName}!` :
//     `👋 Hello!`;

//   await ctx.reply('📋 Choose a command:', getInlineMenu(lang));

// }


// function getInlineMenu(lang: string) {
//   const langTrans = translations[lang];
//   return Markup.inlineKeyboard([
//     [Markup.button.callback(langTrans.btnWebview, 'cmd_webview')],
//     [Markup.button.callback(langTrans.btnGameRooms, 'cmd_gamerooms')],
//     [Markup.button.callback(langTrans.btnStartGame, 'cmd_startgame')],
//     [Markup.button.callback(langTrans.btnDeposit, 'cmd_deposit')],
//     [Markup.button.callback(langTrans.btnTransfer, 'cmd_transfer')],
//     [Markup.button.callback(langTrans.btnWithdraw, 'cmd_withdraw')],
//     [Markup.button.callback(langTrans.btnInstructions, 'cmd_instructions')],
//     [Markup.button.callback(langTrans.btnSupport, 'cmd_support')],
//     [Markup.button.callback(`${langTrans.btnLanguage}`, 'cmd_language')],
//   ]);
// }


// bot.start(async (ctx) => {
//   const userId = ctx.from?.id;
//   if (!userLanguageMap.has(userId)) {
//     userLanguageMap.set(userId, 'en'); // default language
//   }

//   const lang = getUserLanguage(ctx);

//   // Send a welcome image from a local file
//   const imageUrl = `${APP_URL}/bot_hero.png`;
//     await ctx.replyWithPhoto(imageUrl, {
//     caption: `${t(ctx, 'greeting')}\n👋 Hello ${ctx.from?.first_name || 'Player'}!`,
//     });

//   // Then show the start menu (keyboard or inline buttons)
//   await showStartMenu(ctx);
// });



// // ------------------ Inline command handlers ------------------
// bot.action('cmd_webview', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'openingWebview'), Markup.inlineKeyboard([
//     Markup.button.webApp('Open Lobby', `${APP_URL}/${getUserLanguage(ctx)}`)
//   ]));
// });

// bot.action('cmd_gamerooms', async (ctx) => {
//   await ctx.answerCbQuery();
//   await showRooms(ctx);
// });

// bot.action('cmd_startgame', async (ctx) => {
//   await ctx.answerCbQuery();
//   const lang = getUserLanguage(ctx);
//   await ctx.reply(t(ctx, 'startGame'), getInlineMenu(lang));
//   // await showStartMenu(ctx)
// });

// bot.action('cmd_wallet', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'wallet'), Markup.inlineKeyboard([
//     Markup.button.webApp('Your Wallet', `${APP_URL}/${getUserLanguage(ctx)}/wallet`)
//   ]));
// });

// bot.action('cmd_deposit', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'deposit'), Markup.inlineKeyboard([
//     Markup.button.webApp('Deposit Fund', `${APP_URL}/${getUserLanguage(ctx)}/deposit`)
//   ]));
// });

// bot.action('cmd_transfer', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'transfer'), Markup.inlineKeyboard([
//     Markup.button.webApp('Transfer Fund', `${APP_URL}/${getUserLanguage(ctx)}/transfer`)
//   ]));
// });

// bot.action('cmd_withdraw', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'withdraw'), Markup.inlineKeyboard([
//     Markup.button.webApp('Withdraw Money', `${APP_URL}/${getUserLanguage(ctx)}/withdraw`)
//   ]));
// });

// bot.action('cmd_instructions', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'instructions'), Markup.inlineKeyboard([
//     Markup.button.webApp('How to Play', `${APP_URL}/${getUserLanguage(ctx)}/instructions`)
//   ]));
// });

// bot.action('cmd_support', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'support'), Markup.inlineKeyboard([
//     Markup.button.webApp('Get Support', `${APP_URL}/${getUserLanguage(ctx)}/support`)
//   ]));
// });

// bot.action('cmd_language', async (ctx) => {
//   await ctx.answerCbQuery();
//   const inlineButtons = availableLanguages.map(lang =>
//     Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`)
//   );
//   await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
// });



// // ------------------ Command Handlers ------------------
// bot.command('webview', async (ctx) => {
//   await ctx.reply(t(ctx, 'openingWebview'), Markup.inlineKeyboard([
//     Markup.button.webApp('Open Lobby', `${APP_URL}/${getUserLanguage(ctx)}`)
//   ]));
// });

// bot.command('gamerooms', async (ctx) => await showRooms(ctx));

// bot.command('startgame', async (ctx) => await showStartMenu(ctx));

// bot.command('deposit', async (ctx) => await ctx.reply(t(ctx, 'deposit'), Markup.inlineKeyboard([
//   Markup.button.webApp('Deposit Fund', `${APP_URL}/${getUserLanguage(ctx)}/deposits`)
// ])));

// bot.command('wallet', async (ctx) => await ctx.reply(t(ctx, 'wallet'), Markup.inlineKeyboard([
//   Markup.button.webApp('Your Wallet', `${APP_URL}/${getUserLanguage(ctx)}/wallet`)
// ])));

// bot.command('transfer', async (ctx) => await ctx.reply(t(ctx, 'transfer'), Markup.inlineKeyboard([
//   Markup.button.webApp('Transfer Fund', `${APP_URL}/${getUserLanguage(ctx)}/transfers`)
// ])));
// bot.command('withdraw', async (ctx) => await ctx.reply(t(ctx, 'withdraw'), Markup.inlineKeyboard([
//   Markup.button.webApp('Withdraw Money', `${APP_URL}/${getUserLanguage(ctx)}/withdraw`)
// ])));
// bot.command('instructions', async (ctx) => await ctx.reply(t(ctx, 'instructions'), Markup.inlineKeyboard([
//   Markup.button.webApp('How to Play', `${APP_URL}/${getUserLanguage(ctx)}/instructions`)
// ])));
// bot.command('support', async (ctx) => await ctx.reply(t(ctx, 'support'), Markup.inlineKeyboard([
//   Markup.button.webApp('Get Support', `${APP_URL}/${getUserLanguage(ctx)}/support`)
// ])));

// // ------------------ Language Command ------------------
// bot.command('language', async (ctx) => {
//   const inlineButtons = availableLanguages.map(lang =>
//     Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`)
//   );
//   await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
// });


// // bot.hears('🎲 Game Rooms', async (ctx) => await showRooms(ctx));
// // bot.hears('🎲 Game Rooms', async (ctx) => await showRooms(ctx));
// // bot.hears('🎮 Start Game', async (ctx) => await ctx.reply(t(ctx, 'startGame')));
// // bot.hears('💰 Deposit Fund', async (ctx) => await ctx.reply(t(ctx, 'deposit')));
// // bot.hears('🔁 Transfer Fund', async (ctx) => await ctx.reply(t(ctx, 'transfer')));
// // bot.hears('💸 Withdraw Money', async (ctx) => await ctx.reply(t(ctx, 'withdraw')));
// // bot.hears('📖 Instructions', async (ctx) => await ctx.reply(t(ctx, 'instructions')));
// // bot.hears('🧑‍💻 Support', async (ctx) => await ctx.reply(t(ctx, 'support')));
// // bot.hears(/^🌐 Language/, async (ctx) => {
// //   const inlineButtons = availableLanguages.map(lang =>
// //     Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`)
// //   );
// //   await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
// // });


// // bot.hears('📖 መመሪያ', async (ctx) => await ctx.reply(t(ctx, 'instructions')));
// // bot.hears('🎲 የጨዋታ ክፍሎች', async (ctx) => await showRooms(ctx));
// // bot.hears('🎮 ጨዋታ ጀምር', async (ctx) => await ctx.reply(t(ctx, 'startGame')));
// // bot.hears('💰 ተቀማጭ', async (ctx) => await ctx.reply(t(ctx, 'deposit')));
// // bot.hears('🔁 ክፍያ ላክ', async (ctx) => await ctx.reply(t(ctx, 'transfer')));
// // bot.hears('💸 ገንዘብ ውሰድ', async (ctx) => await ctx.reply(t(ctx, 'withdraw')));
// // bot.hears('🧑‍💻 ድጋፍ', async (ctx) => await ctx.reply(t(ctx, 'support')));
// // bot.hears(/^🌐 ቋንቋ/, async (ctx) => {
// //   const inlineButtons = availableLanguages.map(lang =>
// //     Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`)
// //   );
// //   await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
// // });



// // ------------------ Language Action Handler ------------------
// bot.action(/set_language_(.+)/, async (ctx) => {
//   await ctx.answerCbQuery();
//   const selectedLang = ctx.match?.[1];
//   const userId = ctx.from?.id;
//   if (!userId || !selectedLang) return;
//   userLanguageMap.set(userId, selectedLang);
//   await ctx.reply(`${t(ctx, 'languageChanged')} ${selectedLang.toUpperCase()}`);
// });

// // ------------------ Pagination Handler ------------------
// bot.action(/show_rooms_(\d+)/, async (ctx) => {
//   await ctx.answerCbQuery();
//   const page = parseInt(ctx.match?.[1] || '1', 10);
//   await showRooms(ctx, page);
// });
// // ------------------ Webhook handler ----------------
// export async function POST(req: NextRequest) {
//   try {
//     const update = await req.json();
//     await bot.handleUpdate(update);
//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error('Telegram webhook error:', error);
//     return NextResponse.json({ ok: false, error });
//   }
// }


// setLocalizedCommands().then(async () => {
//    const webhookUrl = `${APP_URL}/en/api/telegram`;
//     await bot.telegram.setWebhook(webhookUrl);
// });




// =================================================================================

// import { NextRequest, NextResponse } from "next/server";

// import { Telegraf, Markup, NarrowedContext } from 'telegraf';
// import { message } from 'telegraf/filters';
// // import { Update, ContactMessage } from 'telegraf/types';
// import axios from 'axios';
// import path from 'path';
// import dotenv from 'dotenv';
// import { Room } from '@/lib/types';


// dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN missing');
// if (!process.env.BACKEND_BASE_URL) throw new Error('BACKEND_BASE_URL missing');
// if (!process.env.APP_URL) throw new Error('APP_URL missing');

// const API_BASE_URL = process.env.BACKEND_BASE_URL;
// const APP_URL = process.env.APP_URL;
// const ROOMS_PER_PAGE = 10;
// const currency = "Birr";

// const bot = new Telegraf(process.env.BOT_TOKEN);

// // ---------------- Language state ----------------
// const availableLanguages = ['en', 'am'];
// const userLanguageMap = new Map<number, string>();

// function getUserLanguage(ctx: any) {
//   const userId = ctx.from?.id;
//   return userId ? userLanguageMap.get(userId) || 'en' : 'en';
// }

// // ---------------- Translation Helper ----------------
// const translations: Record<string, Record<string, string>> = {
//   en: {
//     greeting: "Welcome to Bingo Fam!",
//     noRooms: "❌ No rooms available right now.",
//     fetchError: "❌ Failed to load rooms. Please try again later.",
//     chooseRoom: "🎲 Choose a Bingo room:",
//     openingWebview: "🌐 Opening Web View Lobby",
//     startGame: "🎮 Start Game selected!",
//     deposit: "💰 Deposit here:",
//     transfer: "🔁 Transfer here:",
//     withdraw: "💸 Withdraw here:",
//     instructions: "📖 Instructions:",
//     support: "🧑‍💻 Contact support:",
//     languageChanged: "🌐 Language changed to",
//     wallet: "💰 Your Wallet",
//     btnWebview: "🌐 Web View Lobby",
//     btnGameRooms: "🎲 Game Rooms",
//     btnStartGame: "🎮 Start Game",
//     btnDeposit: "💰 Deposit Fund",
//     btnTransfer: "🔁 Transfer Fund",
//     btnWithdraw: "💸 Withdraw Money",
//     btnInstructions: "📖 Instructions",
//     btnSupport: "🧑‍💻 Support",
//     btnLanguage: "🌐 Language",
//     prev: "⬅️ Prev",
//     next: "Next ➡️"
//   },
//   am: {
//     greeting: "በቤንጎ ቤተሰብ ወደ እንኳን በደህና መጡ!",
//     noRooms: "❌ አሁን ክፍሎች የሉም።",
//     fetchError: "❌ ክፍሎችን ማስገባት አልተቻለም። እባክዎ ከፍ ያድርጉ።",
//     chooseRoom: "🎲 ክፍሎችን ይምረጡ:",
//     openingWebview: "🌐 የድህረገፅ እይታ እየተከፈተ ነው",
//     startGame: "🎮 ጨዋታ መጀመር ተጀምሯል!",
//     deposit: "💰 ተቀማጭ ያድርጉ:",
//     transfer: "🔁 ገንዘብ ይከፍሉ:",
//     withdraw: "💸 ገንዘብ ይወስዱ:",
//     instructions: "📖 መመሪያዎች:",
//     support: "🧑‍💻 ድጋፍ ያግኙ:",
//     languageChanged: "🌐 ቋንቋ ተቀይሯል",
//     wallet: "💰 ዋሌትዎን ይመልከቱ",
//     btnWebview: "🌐 የድህረገፅ እይታ",
//     btnGameRooms: "🎲 የጨዋታ ክፍሎች",
//     btnStartGame: "🎮 ጨዋታ ጀምር",
//     btnDeposit: "💰 ተቀማጭ",
//     btnTransfer: "🔁 ክፍያ ላክ",
//     btnWithdraw: "💸 ገንዘብ ውሰድ",
//     btnInstructions: "📖 መመሪያ",
//     btnSupport: "🧑‍💻 ድጋፍ",
//     btnLanguage: "🌐 ቋንቋ",
//     prev: "⬅️ ቀድሞ",
//     next: "ቀጣይ ➡️"
//   }
// };

// function t(ctx: any, key: string): string {
//   const lang = getUserLanguage(ctx);
//   return translations[lang]?.[key] || translations['en'][key] || key;
// }

// // ---------------- Set localized commands ----------------
// async function setLocalizedCommands() {
//   await bot.telegram.setMyCommands([
//     { command: 'gamerooms', description: '🎲 Game Rooms' },
//     { command: 'startgame', description: '🎮 Start Game' },
//     { command: 'webview', description: '🌐 Open Web View' },
//     { command: 'wallet', description: '💰 See Your Wallet' },
//     { command: 'deposit', description: '💰 Deposit Fund' },
//     { command: 'transfer', description: '🔁 Transfer Fund' },
//     { command: 'withdraw', description: '💸 Withdraw Money' },
//     { command: 'instructions', description: '📖 Instructions' },
//     { command: 'support', description: '🧑‍💻 Support' },
//     { command: 'language', description: '🌐 Change Language' },
//   ]);
// }

// // ---------------- Registered Users Cache ----------------
// const registeredUsersCache = new Map<number, boolean>();
// const CACHE_TTL_MS = 5 * 60 * 0; //  minutes cache

// function cacheUser(userId: number) {
//   registeredUsersCache.set(userId, true);
//   setTimeout(() => registeredUsersCache.delete(userId), CACHE_TTL_MS);
// }

// // ---------------- Middleware: block unregistered users ----------------
// bot.use(async (ctx, next) => {
//   const userId = ctx.from?.id;
//   if (!userId) return;

//   const isStart = ctx.message?.text === '/start';
//   const isContact = ctx.message?.contact !== undefined;

//   // Check cache first
//   let isRegistered = registeredUsersCache.has(userId);



//   if (!isRegistered) {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/v1/secured/user-profile/${userId}`);
//       console.log("========>>>> User profile response:", response.data);
//       isRegistered = response.data?.success && response.data?.data?.telegramId === userId;
//         // await ctx.reply(`Response data: ${JSON.stringify(response.data)}`);
//       if (isRegistered) cacheUser(userId);
//     } catch {
//       isRegistered = false;
//     }
//   }

//   if (!isRegistered && !isStart && !isContact) {
//     await ctx.reply(
//       '📌 Please share your phone number first to register.',
//       Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number To Register')]])
//         .resize()
//         .oneTime()
//     );
//     return;
//   }

//   await next();
// });

// // ---------------- Start command ----------------
// bot.command('start', async (ctx) => {
//   const userId = ctx.from?.id!;
//   let isRegistered = registeredUsersCache.has(userId);

//   if (!isRegistered) {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/v1/public/user-profile/${userId}`);
//       isRegistered = response.data?.success && response.data?.data?.telegramId === userId;

//       if (isRegistered) cacheUser(userId);
//     } catch {
//       isRegistered = false;
//     }
//   }

//   if (!isRegistered) {
//     await ctx.reply(
//       '👋 Welcome! Please share your phone number to continue.',
//       Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number')]])
//         .resize()
//         .oneTime(false)
//     );
//     return;
//   }

//   await showStartMenu(ctx);
// });

// // ---------------- Contact handler ----------------
// bot.on(message('contact'), async (ctx: any) => {
//   if (!ctx.message?.contact) return;

//   const contact = ctx.message.contact;
//   const userId = ctx.from?.id!;
//   if (!contact.phone_number) {
//     return await ctx.reply('❌ Could not get your phone number. Please try again.');
//   }

//   const firstName = contact.first_name || ctx.from?.first_name;
//   if (!firstName) return await ctx.reply('❌ Please set a first name in your Telegram profile and try again.');

//   const payload = {
//     telegramId: userId,
//     firstName,
//     lastName: contact.last_name || ctx.from?.last_name,
//     phoneNumber: contact.phone_number,
//   };

//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/v1/public/user-profile/register`, payload);

//     if (!response.data.success) {
//       const errors = response.data.errors;
//       if (errors && typeof errors === 'object') {
//         const errorMessages = Object.entries(errors)
//           .map(([field, msg]) => `❌ ${field}: ${msg}`)
//           .join('\n');
//         return await ctx.reply(`Registration failed:\n${errorMessages}`);
//       }
//       return await ctx.reply(`❌ Registration failed: ${response.data.message || 'Unknown error'}`);
//     }

//     // Success
//     cacheUser(userId);
//     await ctx.reply(
//       `✅ Registration complete! Welcome, ${firstName}.`,
//       Markup.removeKeyboard()
//     );

//     // 🎯 Directly show start menu
//     await showStartMenu(ctx);

//   } catch (err: any) {
//     console.error('Registration error:', err.response?.data || err.message);

//     const errorMsg = err.response?.data?.message || '❌ Failed to register. Please try again.';
//     await ctx.reply(errorMsg);

//     const errors = err.response?.data?.errors;
//     if (errors && typeof errors === 'object') {
//       const errorMessages = Object.entries(errors)
//         .map(([field, msg]) => `❌ ${field}: ${msg}`)
//         .join('\n');
//       return await ctx.reply(`Details:\n${errorMessages}`);
//     }
//   }
// });




// // ---------------- Show Rooms ----------------
// async function showRooms(ctx: any, page = 1) {
//   try {
//     const response = await axios.get<{ data: Room[] }>(`${API_BASE_URL}/api/v1/public/rooms`);
//     const rooms = response.data.data;
//     if (!rooms || rooms.length === 0) {
//       await ctx.reply(t(ctx, 'noRooms'));
//       return;
//     }

//     const startIdx = (page - 1) * ROOMS_PER_PAGE;
//     const pagedRooms = rooms.slice(startIdx, startIdx + ROOMS_PER_PAGE);

//     const roomButtons = pagedRooms.map(room =>
//       Markup.button.webApp(`(${room.entryFee} ${currency})`, `${APP_URL}/${getUserLanguage(ctx)}/rooms/${room.id}`)
//     );

//     const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
//     const navButtons: any[] = [];
//     if (page > 1) navButtons.push(Markup.button.callback(t(ctx, 'prev'), `show_rooms_${page - 1}`));
//     if (page < totalPages) navButtons.push(Markup.button.callback(t(ctx, 'next'), `show_rooms_${page + 1}`));

//     await ctx.reply(t(ctx, 'chooseRoom'), Markup.inlineKeyboard([...roomButtons, ...navButtons], { columns: 2 }));
//   } catch (err) {
//     console.error('[ERROR] Failed to fetch rooms:', err);
//     await ctx.reply(t(ctx, 'fetchError'));
//   }
// }

// // ---------------- Start Menu ----------------
// function getInlineMenu(lang: string) {
//   const langTrans = translations[lang];
//   return Markup.inlineKeyboard([
//     [Markup.button.callback(langTrans.btnWebview, 'cmd_webview')],
//     [Markup.button.callback(langTrans.btnGameRooms, 'cmd_gamerooms')],
//     [Markup.button.callback(langTrans.btnStartGame, 'cmd_startgame')],
//     [Markup.button.callback(langTrans.btnDeposit, 'cmd_deposit')],
//     [Markup.button.callback(langTrans.btnTransfer, 'cmd_transfer')],
//     [Markup.button.callback(langTrans.btnWithdraw, 'cmd_withdraw')],
//     [Markup.button.callback(langTrans.btnInstructions, 'cmd_instructions')],
//     [Markup.button.callback(langTrans.btnSupport, 'cmd_support')],
//     [Markup.button.callback(langTrans.btnLanguage, 'cmd_language')],
//   ]);
// }

// async function showStartMenu(ctx: any) {
//   const lang = getUserLanguage(ctx);
//   await ctx.reply('📋 Choose a command:', getInlineMenu(lang));
// }

// // ---------------- Inline handlers ----------------
// bot.action('cmd_webview', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'openingWebview'), Markup.inlineKeyboard([
//     Markup.button.webApp('Open Lobby', `${APP_URL}/${getUserLanguage(ctx)}`)
//   ]));
// });

// bot.action('cmd_gamerooms', async (ctx) => {
//   await ctx.answerCbQuery();
//   await showRooms(ctx);
// });

// bot.action('cmd_startgame', async (ctx) => {
//   await ctx.answerCbQuery();
//   await showStartMenu(ctx);
// });

// bot.action('cmd_wallet', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'wallet'), Markup.inlineKeyboard([
//     Markup.button.webApp('Your Wallet', `${APP_URL}/${getUserLanguage(ctx)}/wallet`)
//   ]));
// });

// bot.action('cmd_deposit', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'deposit'), Markup.inlineKeyboard([
//     Markup.button.webApp('Deposit Fund', `${APP_URL}/${getUserLanguage(ctx)}/deposit`)
//   ]));
// });

// bot.action('cmd_transfer', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'transfer'), Markup.inlineKeyboard([
//     Markup.button.webApp('Transfer Fund', `${APP_URL}/${getUserLanguage(ctx)}/transfer`)
//   ]));
// });

// bot.action('cmd_withdraw', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'withdraw'), Markup.inlineKeyboard([
//     Markup.button.webApp('Withdraw Money', `${APP_URL}/${getUserLanguage(ctx)}/withdraw`)
//   ]));
// });

// bot.action('cmd_instructions', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'instructions'), Markup.inlineKeyboard([
//     Markup.button.webApp('How to Play', `${APP_URL}/${getUserLanguage(ctx)}/instructions`)
//   ]));
// });

// bot.action('cmd_support', async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(t(ctx, 'support'), Markup.inlineKeyboard([
//     Markup.button.webApp('Get Support', `${APP_URL}/${getUserLanguage(ctx)}/support`)
//   ]));
// });

// bot.action('cmd_language', async (ctx) => {
//   await ctx.answerCbQuery();
//   const inlineButtons = availableLanguages.map(lang =>
//     Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`)
//   );
//   await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
// });

// bot.action(/set_language_(.+)/, async (ctx) => {
//   await ctx.answerCbQuery();
//   const selectedLang = ctx.match?.[1];
//   const userId = ctx.from?.id;
//   if (!userId || !selectedLang) return;
//   userLanguageMap.set(userId, selectedLang);
//   await ctx.reply(`${t(ctx, 'languageChanged')} ${selectedLang.toUpperCase()}`);
// });

// // ---------------- Command Handlers ----------------
// bot.command('webview', async (ctx) => {
//   await ctx.reply(t(ctx, 'openingWebview'), Markup.inlineKeyboard([
//     Markup.button.webApp('Open Lobby', `${APP_URL}/${getUserLanguage(ctx)}`)
//   ]));
// });
// bot.command('gamerooms', async (ctx) => await showRooms(ctx));
// bot.command('startgame', async (ctx) => await showStartMenu(ctx));
// bot.command('deposit', async (ctx) => await ctx.reply(t(ctx, 'deposit'), Markup.inlineKeyboard([
//   Markup.button.webApp('Deposit Fund', `${APP_URL}/${getUserLanguage(ctx)}/deposit`)
// ])));
// bot.command('wallet', async (ctx) => await ctx.reply(t(ctx, 'wallet'), Markup.inlineKeyboard([
//   Markup.button.webApp('Your Wallet', `${APP_URL}/${getUserLanguage(ctx)}/wallet`)
// ])));
// bot.command('transfer', async (ctx) => await ctx.reply(t(ctx, 'transfer'), Markup.inlineKeyboard([
//   Markup.button.webApp('Transfer Fund', `${APP_URL}/${getUserLanguage(ctx)}/transfer`)
// ])));
// bot.command('withdraw', async (ctx) => await ctx.reply(t(ctx, 'withdraw'), Markup.inlineKeyboard([
//   Markup.button.webApp('Withdraw Money', `${APP_URL}/${getUserLanguage(ctx)}/withdraw`)
// ])));
// bot.command('instructions', async (ctx) => await ctx.reply(t(ctx, 'instructions'), Markup.inlineKeyboard([
//   Markup.button.webApp('How to Play', `${APP_URL}/${getUserLanguage(ctx)}/instructions`)
// ])));
// bot.command('support', async (ctx) => await ctx.reply(t(ctx, 'support'), Markup.inlineKeyboard([
//   Markup.button.webApp('Get Support', `${APP_URL}/${getUserLanguage(ctx)}/support`)
// ])));
// bot.command('language', async (ctx) => {
//   const inlineButtons = availableLanguages.map(lang =>
//     Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`)
//   );
//   await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
// });

// // ---------------- Pagination ----------------
// bot.action(/show_rooms_(\d+)/, async (ctx) => {
//   await ctx.answerCbQuery();
//   const page = parseInt(ctx.match?.[1] || '1', 10);
//   await showRooms(ctx, page);
// });

// // // ---------------- Launch ----------------
// // setLocalizedCommands().then(() => {
// //   bot.launch().then(() => console.log('🤖 Telegram bot running!'));
// // });

// // // Graceful shutdown
// // process.once('SIGINT', () => bot.stop('SIGINT'));
// // process.once('SIGTERM', () => bot.stop('SIGTERM'));


// // ------------------ Webhook handler ----------------
// export async function POST(req: NextRequest) {
//   try {
//     const update = await req.json();
//     await bot.handleUpdate(update);
//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error('Telegram webhook error:', error);
//     return NextResponse.json({ ok: false, error });
//   }
// }


// setLocalizedCommands().then(async () => {
//    const webhookUrl = `${APP_URL}/en/api/telegram`;
//     await bot.telegram.setWebhook(webhookUrl);
// });



// ==================================================================================
// import { NextRequest, NextResponse } from 'next/server';
// import { bot } from '@/bot';

// export async function POST(req: NextRequest, { params }: { params: { locale: string } }) {
//   try {
//     const update = await req.json();
//     // handle update safely
//     await bot.handleUpdate(update).catch(err => console.error('handleUpdate error:', err));
//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error('Telegram webhook error:', error);
//     return NextResponse.json({ ok: false, error: (error as Error).message });
//   }
// }
