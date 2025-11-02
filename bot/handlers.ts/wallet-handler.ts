// import { Telegraf, Context } from 'telegraf';
// import axios from 'axios';
// import { t } from '../utils';
// import { showStartMenu } from './commands';

// const API_BASE_URL = process.env.BACKEND_BASE_URL!;
// const currency = "Birr"

// function escapeMarkdownV2(text: string) {
//   return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
// }

// export function registerWalletHandlers(bot: Telegraf<Context>) {
//   // Action: user clicks "My Wallet"
//   bot.action('my_wallet', async (ctx) => {
//     await ctx.answerCbQuery();
//     const userId = ctx.from?.id;
//     if (!userId) return;

//     try {
//       // Fetch wallet data from backend
//       const response = await axios.get(`${API_BASE_URL}/api/v1/secured/wallet/by-telegram-id?telegramId=${userId}`);

//       const apiResponse = response.data;
//       if (!apiResponse?.success || !apiResponse?.data) {
//         await ctx.reply(t(ctx, 'walletFetchFailed'));
//         await showStartMenu(ctx);
//         return;
//       }

//       const wallet = apiResponse.data;

//       // Extract relevant fields
//       const totalAvailable = wallet.totalAvailableBalance ?? 0;
//       const withdrawable = wallet.availableToWithdraw ?? 0;

//       const messageText = t(ctx, 'walletInfo')
//         .replace('{total}', totalAvailable.toFixed(2))
//         .replace('{withdrawable}', withdrawable.toFixed(2));

//       await ctx.replyWithMarkdown(messageText);
//     } catch (err: any) {
//       console.error('Wallet fetch error:', err.response?.data || err.message);
//       await ctx.reply(t(ctx, 'walletFetchError'));
//     }

//   });
// }




import { Telegraf, Context } from 'telegraf';
import axios from 'axios';
import { t } from '../utils';
import { showStartMenu } from './commands';
import 'dotenv/config';

const API_BASE_URL = process.env.BACKEND_BASE_URL!;
const currency = "Birr"

export function registerWalletHandlers(bot: Telegraf<Context>) {
  bot.action('my_wallet', async (ctx) => {
    await ctx.answerCbQuery();
    const userId = ctx.from?.id;
    if (!userId) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/secured/wallet/by-telegram-id?telegramId=${userId}`);

      const apiResponse = response.data;
      if (!apiResponse?.success || !apiResponse?.data) {
        await ctx.reply(t(ctx, 'walletFetchFailed'));
        await showStartMenu(ctx);
        return;
      }

      const wallet = apiResponse.data;
      const totalAvailable = wallet.totalAvailableBalance ?? 0;
      const withdrawable = wallet.availableToWithdraw ?? 0;

      const messageText = t(ctx, 'walletInfo')
        .replace(`{total} ${currency}`, totalAvailable.toFixed(2))
        .replace(`{withdrawable} ${currency}`, withdrawable.toFixed(2));

      await ctx.reply(messageText); // Safe for all characters
    } catch (err: any) {
      console.error('Wallet fetch error:', err.response?.data || err.message);
      await ctx.reply(t(ctx, 'walletFetchError'));
    }

    // await showStartMenu(ctx);
  });
}
