import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import axios from 'axios';
import { t } from '../utils'; // <-- use your translation helper
import { showStartMenu } from './commands';

const API_BASE_URL = process.env.BACKEND_BASE_URL!;
const awaitingNickname = new Map<number, boolean>();

export function registerNicknameHandlers(bot: Telegraf<Context>) {
  // 🧩 Action: user clicks "change_name"
  bot.action('change_name', async (ctx) => {
    await ctx.answerCbQuery();
    const userId = ctx.from?.id;
    if (!userId) return;

    awaitingNickname.set(userId, true);

    await ctx.reply(t(ctx, 'changeNickname')); // use translations file
    setTimeout(() => awaitingNickname.delete(userId), 120_000); // expire in 2 min
  });

  // 💬 When user sends text
  bot.on(message('text'), async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();

    const text = ctx.message.text.trim();

    if (text.startsWith('/')) return next();
    if (!awaitingNickname.get(userId)) return next();

    awaitingNickname.delete(userId);
    const newNickname = text;

    if (!newNickname) {
      await ctx.reply(t(ctx, 'invalidNickname'));
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/secured/user-profile/update-nickname`,
        null,
        { params: { telegramId: userId, nickName: newNickname } }
      );

      if (response.data?.success) {
        await ctx.reply(t(ctx, 'nicknameChanged').replace('{name}', newNickname));
      } else {
        await ctx.reply(t(ctx, 'nicknameChangeFailed'));
      }
    } catch (err: any) {
      console.error('Nickname change error:', err.response?.data || err.message);
      await ctx.reply(t(ctx, 'nicknameChangeError'));
    }

    await showStartMenu(ctx);
  });
}
