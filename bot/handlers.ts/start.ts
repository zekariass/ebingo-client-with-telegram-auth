import axios from 'axios';
import { Markup } from 'telegraf';
import type { Telegraf } from 'telegraf';
import { showStartMenu } from './commands';
import { message } from 'telegraf/filters';

export function registerStartHandlers(bot: Telegraf) {
  bot.command('start', async (ctx: any) => {
    const userId = ctx.from?.id!;
    let isRegistered = false;

    try {
      const res = await axios.get(`${process.env.BACKEND_BASE_URL}/api/v1/secured/user-profile/${userId}`);
      isRegistered = res.data?.success && res.data?.data?.telegramId === userId;
    } catch {
      isRegistered = false;
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
      const response = await axios.post(`${process.env.BACKEND_BASE_URL}/api/v1/public/user-profile/register`, payload);

      if (!response.data.success) {
        const errors = response.data.errors;
        if (errors && typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, msg]) => `❌ ${field}: ${msg}`)
            .join('\n');
          return await ctx.reply(`Registration failed:\n${errorMessages}`);
        }
        return await ctx.reply(`❌ Registration failed: ${response.data.message || 'Unknown error'}`);
      }

      await ctx.reply(`✅ Registration complete! Welcome, ${firstName}.`, Markup.removeKeyboard());
      await showStartMenu(ctx);
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || '❌ Failed to register. Please try again.';
      await ctx.reply(errorMsg);
      const errors = err.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        const errorMessages = Object.entries(errors)
          .map(([field, msg]) => `❌ ${field}: ${msg}`)
          .join('\n');
        return await ctx.reply(`Details:\n${errorMessages}`);
      }
    }
  });
}
