import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";
import axios from "axios";

interface ChangeNicknameOptions {
  API_BASE_URL: string;
  awaitingNickname: Map<number, boolean>;
  getUserLanguage: (ctx: Context) => string;
  showStartMenu: (ctx: Context) => Promise<void>;
}

/**
 * Registers the "Change Nickname" handlers on the bot
 */
export function registerChangeNickname(bot: Telegraf<Context>, options: ChangeNicknameOptions) {
  const { API_BASE_URL, awaitingNickname, getUserLanguage, showStartMenu } = options;

  // Inline button handler
  bot.action('change_name', async (ctx) => {
    await ctx.answerCbQuery();
    const lang = getUserLanguage(ctx);
    const userId = ctx.from?.id;
    if (!userId) return;

    awaitingNickname.set(userId, true);

    await ctx.reply(
      lang === 'am'
        ? "👤 እባክዎን አዲስ ቅጽል ስምዎን ያስገቡ።"
        : "👤 Please enter your new nickname:",
    );

    // Auto-expire after 2 minutes
    setTimeout(() => awaitingNickname.delete(userId), 120_000);
  });

  // Text message handler
  bot.on(message('text'), async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();

    const text = ctx.message.text.trim();

    if (text.startsWith('/')) return next(); // skip commands
    if (!awaitingNickname.get(userId)) return next(); // skip if not in change mode

    awaitingNickname.delete(userId);
    const newNickname = text;
    const lang = getUserLanguage(ctx);

    if (!newNickname) {
      await ctx.reply(
        lang === 'am'
          ? "❌ ስም ተሳስቷል። እባክዎ ደግመው ይሞክሩ።"
          : "❌ Invalid nickname. Please try again."
      );
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/secured/user-profile/update-nickname?telegramId=${userId}&nickName=${newNickname}`
      );

      if (response.data?.success) {
        await ctx.reply(
          lang === 'am'
            ? `✅ ስምዎ ወደ "${newNickname}" ተቀይሯል።`
            : `✅ Your nickname has been changed to "${newNickname}".`
        );
      } else {
        await ctx.reply(
          lang === 'am'
            ? "❌ ስም መቀየር አልተሳካም።"
            : "❌ Failed to update nickname."
        );
      }
    } catch (err: any) {
      console.error('Nickname change error:', err.response?.data || err.message);
      await ctx.reply(
        lang === 'am'
          ? "❌ የመረጃ ጥያቄ ችግኝ ነበር።"
          : "❌ There was an error updating your nickname."
      );
    }

    await showStartMenu(ctx);
  });
}
