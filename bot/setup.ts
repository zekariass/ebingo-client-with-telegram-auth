// import { Telegraf } from 'telegraf';


// const availableLanguages = ['en', 'am'];


// export async function setLocalizedCommands() {
// // separate for testability
// return await (global as any).telegraf?.telegram?.setMyCommands?.([
//     { command: 'menu', description: '📋 Menu | ምርጫዎች' },
//     { command: 'startgame', description: '🎮 Start Game | ጨዋታ ጀምር' },
//     { command: 'gamerooms', description: '🎲 Game Rooms | የጨዋታ ክፍሎች' },
//     { command: 'webview', description: '🌐 Web View | ድረገጽ' },
//     { command: 'wallet', description: '💰 Check Balance | ቀሪ ገንዘብ' },
//     { command: 'deposit', description: '💰 Deposit Fund | ገንዘብ አስቀምጥ' },
//     { command: 'withdraw', description: '💸 Withdraw Money | ገንዘብ አውጣ' },
//     { command: 'transfer', description: '🔁 Transfer To A Friend | ለጓደኛ ገንዘብ ላክ' },
//     { command: 'invite', description: '🔗 Invite A Friend | ጓደኛ ይጋብዙ'},
//     { command: 'instructions', description: '📖 Instructions | የጨዋታ መመሪያዎች' },
//     { command: 'support', description: '🧑‍💻 Support | ድጋፍ ያግኙ' },
//     { command: 'language', description: '🌐 Change Language | ቋንቋ ቀይር' },
// ]);
// }


// let webhookSet = false;


// export async function setCommandsAndWebhooks(bot: Telegraf) {
// // set commands
// await bot.telegram.setMyCommands([
//     { command: 'menu', description: '📋 Menu | ምርጫዎች' },
//     { command: 'startgame', description: '🎮 Start Game | ጨዋታ ጀምር' },
//     { command: 'gamerooms', description: '🎲 Game Rooms | የጨዋታ ክፍሎች' },
//     { command: 'webview', description: '🌐 Web View | ድረገጽ' },
//     { command: 'wallet', description: '💰 Check Balance | ቀሪ ገንዘብ' },
//     { command: 'deposit', description: '💰 Deposit Fund | ገንዘብ አስቀምጥ' },
//     { command: 'withdraw', description: '💸 Withdraw Money | ገንዘብ አውጣ' },
//     { command: 'transfer', description: '🔁 Transfer To A Friend| ለጓደኛ ገንዘብ ላክ' },
//     { command: 'invite', description: '🔗 Invite A Friend | ጓደኛ ይጋብዙ'},
//     { command: 'instructions', description: '📖 Instructions | የጨዋታ መመሪያዎች' },
//     { command: 'support', description: '🧑‍💻 Support | ድጋፍ ያግኙ' },
//     { command: 'language', description: '🌐 Change Language | ቋንቋ ቀይር' },
// ]);


// if (webhookSet) return;
// webhookSet = true;


// const APP_URL = process.env.APP_URL!;
// // for (const locale of availableLanguages) {
// const webhookUrl = `${APP_URL}/en/api/telegram`;
// await bot.telegram.setWebhook(webhookUrl);
// // console.log(`✅ Webhook set for locale: ${locale} -> ${webhookUrl}`);
// // }
// }


import { Telegraf } from "telegraf";

const ADMIN_IDS = (process.env.ADMIN_IDS || "")
  .split(",")
  .map((id) => Number(id));

let webhookSet = false;

export async function setCommandsAndWebhooks(bot: Telegraf) {
  // --------------------------
  // Normal commands for everyone
  // --------------------------
  const normalCommands = [
    { command: "register", description: "📋 Register | ተመዝገብ" },
    { command: "menu", description: "📋 Menu | ምርጫዎች" },
    { command: "startgame", description: "🎮 Start Game | ጨዋታ ጀምር" },
    { command: "gamerooms", description: "🎲 Game Rooms | የጨዋታ ክፍሎች" },
    { command: "webview", description: "🌐 Web View | ድረገጽ" },
    { command: "wallet", description: "💰 Check Balance | ቀሪ ገንዘብ" },
    { command: "deposit", description: "💰 Deposit Fund | ገንዘብ አስቀምጥ" },
    { command: "withdraw", description: "💸 Withdraw Money | ገንዘብ አውጣ" },
    { command: "transfer", description: "🔁 Transfer To A Friend | ለጓደኛ ገንዘብ ላክ" },
    { command: "invite", description: "🔗 Invite A Friend | ጓደኛ ይጋብዙ" },
    { command: "instructions", description: "📖 Instructions | የጨዋታ መመሪያዎች" },
    { command: "support", description: "🧑‍💻 Support | ድጋፍ ያግኙ" },
    { command: "language", description: "🌐 Change Language | ቋንቋ ቀይር" },
  ];

  // Set global commands for everyone
  await bot.telegram.setMyCommands(normalCommands);

  // --------------------------
  // Admin commands (normal + broadcast)
  // --------------------------
  const adminCommands = [...normalCommands, { command: "broadcast", description: "📡 Broadcast Message | Admin Only" }];

  for (const adminId of ADMIN_IDS) {
    await bot.telegram.setMyCommands(adminCommands, {
      scope: { type: "chat", chat_id: adminId },
    });
  }

  // --------------------------
  // Set webhook once
  // --------------------------
  if (!webhookSet) {
    const APP_URL = process.env.APP_URL!;
    await bot.telegram.setWebhook(`${APP_URL}/en/api/telegram`);
    webhookSet = true;
  }
}
