import { Telegraf, Markup } from 'telegraf';
import { generateInviteLink } from './generate-invite-link';

export function registerInviteHandler(bot: Telegraf) {
  bot.command('invite', async (ctx: any) => {
  try {
    const userId = ctx.from.id;
    if (!userId) return ctx.reply('❌ Could not get your user ID.');

    const botInfo = await bot.telegram.getMe();
    const inviteLink = generateInviteLink(botInfo.username, userId);

    const shareMessage = `🎉 Join me on Family Bingo!\n\nClick here to start: ${inviteLink}`;

    await ctx.reply(
      `🎉 Invite your friends to Family Bingo!\n\n${inviteLink}`,
      Markup.inlineKeyboard([
        [Markup.button.switchToChat('📤 Share', shareMessage)]
      ])
    );
  } catch (err: any) {
    console.error('Error generating invite link:', err);
    await ctx.reply('❌ Failed to generate invite link. Please try again later.');
  }
});


}
