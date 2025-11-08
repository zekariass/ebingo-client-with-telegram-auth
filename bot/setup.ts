import { Description } from '@radix-ui/react-toast';
import { Telegraf } from 'telegraf';


const availableLanguages = ['en', 'am'];


export async function setLocalizedCommands() {
// separate for testability
return await (global as any).telegraf?.telegram?.setMyCommands?.([
// { command: 'gamerooms', description: '🎲 Game Rooms' },
// { command: 'startgame', description: '🎮 Start Game' },
// { command: 'webview', description: '🌐 Open Web View' },
// { command: 'wallet', description: '💰 See Your Wallet' },
// { command: 'deposit', description: '💰 Deposit Fund' },
// { command: 'transfer', description: '🔁 Transfer Fund' },
// { command: 'withdraw', description: '💸 Withdraw Money' },
// { command: 'instructions', description: '📖 Instructions' },
// { command: 'support', description: '🧑‍💻 Support' },
// { command: 'language', description: '🌐 Change Language' },

    { command: 'menu', description: '📋 Menu | ምርጫዎች' },
    { command: 'startgame', description: '🎮 Start Game | ጨዋታ ጀምር' },
    { command: 'gamerooms', description: '🎲 Game Rooms | የጨዋታ ክፍሎች' },
    { command: 'webview', description: '🌐 Web View | ድረገጽ' },
    { command: 'wallet', description: '💰 Check Balance | ቀሪ ገንዘብ' },
    { command: 'deposit', description: '💰 Deposit Fund | ገንዘብ አስቀምጥ' },
    { command: 'withdraw', description: '💸 Withdraw Money | ገንዘብ አውጣ' },
    { command: 'transfer', description: '🔁 Transfer To A Friend | ለጓደኛ ገንዘብ ላክ' },
    { command: 'invite', description: '🔗 Invite A Friend | ጓደኛ ይጋብዙ'},
    { command: 'instructions', description: '📖 Instructions | የጨዋታ መመሪያዎች' },
    { command: 'support', description: '🧑‍💻 Support | ድጋፍ ያግኙ' },
    { command: 'language', description: '🌐 Change Language | ቋንቋ ቀይር' },
]);
}


let webhookSet = false;


export async function setCommandsAndWebhooks(bot: Telegraf) {
// set commands
await bot.telegram.setMyCommands([
// { command: 'gamerooms', description: '🎲 Game Rooms' },
// { command: 'startgame', description: '🎮 Start Game' },
// { command: 'webview', description: '🌐 Open Web View' },
// { command: 'wallet', description: '💰 See Your Wallet' },
// { command: 'deposit', description: '💰 Deposit Fund' },
// { command: 'transfer', description: '🔁 Transfer Fund' },
// { command: 'withdraw', description: '💸 Withdraw Money' },
// { command: 'instructions', description: '📖 Instructions' },
// { command: 'support', description: '🧑‍💻 Support' },
// { command: 'language', description: '🌐 Change Language' },

    { command: 'menu', description: '📋 Menu | ምርጫዎች' },
    { command: 'startgame', description: '🎮 Start Game | ጨዋታ ጀምር' },
    { command: 'gamerooms', description: '🎲 Game Rooms | የጨዋታ ክፍሎች' },
    { command: 'webview', description: '🌐 Web View | ድረገጽ' },
    { command: 'wallet', description: '💰 Check Balance | ቀሪ ገንዘብ' },
    { command: 'deposit', description: '💰 Deposit Fund | ገንዘብ አስቀምጥ' },
    { command: 'withdraw', description: '💸 Withdraw Money | ገንዘብ አውጣ' },
    { command: 'transfer', description: '🔁 Transfer To A Friend| ለጓደኛ ገንዘብ ላክ' },
    { command: 'invite', description: '🔗 Invite A Friend | ጓደኛ ይጋብዙ'},
    { command: 'instructions', description: '📖 Instructions | የጨዋታ መመሪያዎች' },
    { command: 'support', description: '🧑‍💻 Support | ድጋፍ ያግኙ' },
    { command: 'language', description: '🌐 Change Language | ቋንቋ ቀይር' },
]);


if (webhookSet) return;
webhookSet = true;


const APP_URL = process.env.APP_URL!;
// for (const locale of availableLanguages) {
const webhookUrl = `${APP_URL}/en/api/telegram`;
await bot.telegram.setWebhook(webhookUrl);
// console.log(`✅ Webhook set for locale: ${locale} -> ${webhookUrl}`);
// }
}