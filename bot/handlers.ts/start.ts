// import axios from 'axios';
// import { Markup } from 'telegraf';
// import type { Telegraf } from 'telegraf';
// import { showStartMenu } from './commands';
// import { message } from 'telegraf/filters';

// export function registerStartHandlers(bot: Telegraf) {
//   bot.command('start', async (ctx: any) => {
//     const userId = ctx.from?.id!;
//     let isRegistered = false;

//     try {
//       const res = await axios.get(`${process.env.BACKEND_BASE_URL}/api/v1/secured/user-profile/${userId}`);
//       isRegistered = res.data?.success && res.data?.data?.telegramId === userId;
//     } catch {
//       isRegistered = false;
//     }

//     // ✅ Add a start image (local file or URL)
//     await ctx.replyWithPhoto(
//       { url: `${process.env.APP_URL}/logo.png` }, // or use { source: 'path/to/local/image.jpg' }
//       { caption: '👋 Welcome to Family Bingo!' }
//     );
//     if (!isRegistered) {
//       await ctx.reply(
//         '👋 Welcome! Please share your phone number to continue.',
//         Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number')]]).resize().oneTime(false)
//       );
//       return;
//     }

//     await showStartMenu(ctx);
//   });

//   bot.on(message('contact'), async (ctx: any) => {
//     if (!ctx.message?.contact) return;
//     const contact = ctx.message.contact;
//     const userId = ctx.from?.id!;
//     if (!contact.phone_number) return await ctx.reply('❌ Could not get your phone number. Please try again.');

//     const firstName = contact.first_name || ctx.from?.first_name;
//     if (!firstName) return await ctx.reply('❌ Please set a first name in your Telegram profile and try again.');

//     const payload = {
//       telegramId: userId,
//       firstName,
//       lastName: contact.last_name || ctx.from?.last_name,
//       phoneNumber: contact.phone_number,
//     };

//     try {
//       const response = await axios.post(`${process.env.BACKEND_BASE_URL}/api/v1/public/user-profile/register`, payload);

//       if (!response.data.success) {
//         const errors = response.data.errors;
//         if (errors && typeof errors === 'object') {
//           const errorMessages = Object.entries(errors)
//             .map(([field, msg]) => `❌ ${field}: ${msg}`)
//             .join('\n');
//           return await ctx.reply(`Registration failed:\n${errorMessages}`);
//         }
//         return await ctx.reply(`❌ Registration failed: ${response.data.message || 'Unknown error'}`);
//       }

//       await ctx.reply(`✅ Registration complete! Welcome, ${firstName}.`, Markup.removeKeyboard());
//       await showStartMenu(ctx);
//     } catch (err: any) {
//       console.error('Registration error:', err.response?.data || err.message);
//       const errorMsg = err.response?.data?.message || '❌ Failed to register. Please try again.';
//       await ctx.reply(errorMsg);
//       const errors = err.response?.data?.errors;
//       if (errors && typeof errors === 'object') {
//         const errorMessages = Object.entries(errors)
//           .map(([field, msg]) => `❌ ${field}: ${msg}`)
//           .join('\n');
//         return await ctx.reply(`Details:\n${errorMessages}`);
//       }
//     }
//   });
// }

import axios from 'axios';
import { Markup } from 'telegraf';
import type { Telegraf } from 'telegraf';
import { showStartMenu } from './commands';
import { message } from 'telegraf/filters';

function getStartPayload(ctx: any): number | null {
  const text = ctx.message?.text || '';
  const parts = text.split(' ');
  if (parts.length > 1) {
    const payload = parseInt(parts[1], 10);
    if (!isNaN(payload)) return payload;
  }
  return null;
}


export function registerStartHandlers(bot: Telegraf) {
  bot.command('start', async (ctx: any) => {
  const userId = ctx.from.id;

  // ✅ Extract referrerId from /start payload
  const referrerId = getStartPayload(ctx);
  ctx.session = ctx.session || {};
  if (referrerId && referrerId !== userId) {
    ctx.session.referrerId = referrerId;
    console.log(`Stored referrerId ${referrerId} for user ${userId}`);
  }

  // Check if user is already registered
  let isRegistered = false;
  try {
    const res = await axios.get(`${process.env.BACKEND_BASE_URL}/api/v1/secured/user-profile/${userId}`);
    isRegistered = res.data?.success && res.data?.data?.telegramId === userId;
  } catch {}

  // Welcome image
  await ctx.replyWithPhoto(
    { url: `${process.env.APP_URL}/logo.png` },
    { caption: '👋 Welcome to Family Bingo!' }
  );

  if (!isRegistered) {
    await ctx.reply(
      '👋 Welcome! Please share your phone number to continue.',
      Markup.keyboard([[Markup.button.contactRequest('📱 Share Phone Number')]]).resize().oneTime(false)
    );
    return;
  }

  await showStartMenu(ctx);
});



  bot.on('contact', async (ctx: any) => {
  const userId = ctx.from.id;
  const contact = ctx.message.contact;
  if (!contact?.phone_number) return ctx.reply('❌ Could not get your phone number.');

  const firstName = contact.first_name || ctx.from.first_name;
  if (!firstName) return ctx.reply('❌ Please set a first name in your Telegram profile.');

  // Include referrerId from session
  const referrerId = ctx.session?.referrerId || null;

  const payload = {
    telegramId: userId,
    firstName,
    lastName: contact.last_name || ctx.from.last_name,
    phoneNumber: contact.phone_number,
    referrerId,
  };

  try {
    const response = await axios.post(
      `${process.env.BACKEND_BASE_URL}/api/v1/public/user-profile/register`,
      payload
    );

    if (!response.data.success) {
      const errors = response.data.errors;
      if (errors && typeof errors === 'object') {
        const errorMessages = Object.entries(errors)
          .map(([field, msg]) => `❌ ${field}: ${msg}`)
          .join('\n');
        return ctx.reply(`Registration failed:\n${errorMessages}`);
      }
      return ctx.reply(`❌ Registration failed: ${response.data.message || 'Unknown error'}`);
    }

    // ✅ Personalized welcome message
    let welcomeMessage = `✅ Registration complete! Welcome, ${firstName}.`;
    if (referrerId) {
      try {
        // Fetch referrer info from your backend
        const referrerRes = await axios.get(`${process.env.BACKEND_BASE_URL}/api/v1/secured/user-profile/${referrerId}`);
        if (referrerRes.data?.success && referrerRes.data?.data?.firstName) {
          const referrerName = referrerRes.data.data.firstName;
          welcomeMessage += ` 🎉 You were referred by ${referrerName}!`;
        }
      } catch {
        // Ignore errors fetching referrer
      }
    }

    // Clear referrer after registration
    ctx.session.referrerId = null;

    await ctx.reply(welcomeMessage, Markup.removeKeyboard());
    await showStartMenu(ctx);
  } catch (err: any) {
    console.error('Registration error:', err.response?.data || err.message);
    const errorMsg = err.response?.data?.message || '❌ Failed to register. Please try again.';
    await ctx.reply(errorMsg);
  }
});


}
