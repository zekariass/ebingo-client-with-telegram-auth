// import axios from 'axios';
// import { Markup } from 'telegraf';
// import { Telegraf } from 'telegraf';


// const registeredUsersCache = new Map<number, boolean>();
// const CACHE_TTL_MS = 5 * 60 * 0; // 5 minutes


// export function registerMiddleware(bot: Telegraf) {
// bot.use(async (ctx: any, next: any) => {
// const userId = ctx.from?.id;
// if (!userId) return;


// const isStart = ctx.message?.text === '/start';
// const isContact = ctx.message?.contact !== undefined;


// let isRegistered = registeredUsersCache.has(userId);


// if (!isRegistered) {
// try {
// const response = await axios.get(`${process.env.BACKEND_BASE_URL}/api/v1/secured/user-profile/${userId}`);
// isRegistered = response.data?.success && response.data?.data?.telegramId === userId;
// if (isRegistered) {
// registeredUsersCache.set(userId, true);
// setTimeout(() => registeredUsersCache.delete(userId), CACHE_TTL_MS);
// }
// } catch (err) {
// isRegistered = false;
// }
// }


// if (!isRegistered && !isStart && !isContact) {
// await ctx.reply(
// '📌 Please share your phone number first to register.',
// Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number To Register')]]).resize().oneTime()
// );
// return;
// }


// await next();
// });
// }



import axios from 'axios';
import { Markup, Telegraf, session } from 'telegraf';

const registeredUsersCache = new Map<number, boolean>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function registerMiddleware(bot: Telegraf) {
  // ✅ Add session middleware first
  bot.use(session());

  bot.use(async (ctx: any, next: any) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const isStart = ctx.message?.text?.startsWith('/start');
    const isContact = ctx.message?.contact !== undefined;

    let isRegistered = registeredUsersCache.has(userId);

    if (!isRegistered) {
      try {
        const response = await axios.get(`${process.env.BACKEND_BASE_URL}/api/v1/secured/user-profile/${userId}`);
        isRegistered = response.data?.success && response.data?.data?.telegramId === userId;
        if (isRegistered) {
          registeredUsersCache.set(userId, true);
          setTimeout(() => registeredUsersCache.delete(userId), CACHE_TTL_MS);
        }
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

    // Ensure session object exists
    ctx.session = ctx.session || {};

    await next();
  });
}
