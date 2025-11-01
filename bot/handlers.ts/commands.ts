import { Markup } from 'telegraf';
import type { Telegraf } from 'telegraf';
import { getUserLang, setUserLang } from '../userLangMap';


const languageFullName = {
  "en": "English",
  "am": "Amharic"
}

function getTranslationForLang(lang: string, key: string) {
  return translations[lang]?.[key] || translations['en'][key] || key;
}

function getUserLangFromCtx(ctx: any) {
  return getUserLang(ctx.from?.id) || 'en';
}

export function registerCommandHandlers(bot: Telegraf) {
  bot.action('cmd_webview', async (ctx: any) => {
    await ctx.answerCbQuery();
    const lang = getUserLangFromCtx(ctx);
    await ctx.reply(getTranslationForLang(lang, 'openingWebview'), Markup.inlineKeyboard([
      Markup.button.webApp('Open Web', `${process.env.APP_URL}/${lang}`)
    ]));
  });

  bot.action('cmd_gamerooms', async (ctx: any) => { await ctx.answerCbQuery(); await showRooms(ctx); });
  bot.action('cmd_startgame', async (ctx: any) => { await ctx.answerCbQuery(); await showStartMenu(ctx); });

  bot.action('cmd_deposit', async (ctx: any) => {
    await ctx.answerCbQuery();
    const lang = getUserLangFromCtx(ctx);
    await ctx.reply(getTranslationForLang(lang, 'deposit'), Markup.inlineKeyboard([
      Markup.button.webApp('Deposit Fund', `${process.env.APP_URL}/${lang}/deposit`)
    ]));
  });

  bot.action('cmd_transfer', async (ctx: any) => {
    await ctx.answerCbQuery();
    const lang = getUserLangFromCtx(ctx);
    await ctx.reply(getTranslationForLang(lang, 'transfer'), Markup.inlineKeyboard([
      Markup.button.webApp('Transfer Fund', `${process.env.APP_URL}/${lang}/transfer`)
    ]));
  });

  bot.action('cmd_withdraw', async (ctx: any) => {
    await ctx.answerCbQuery();
    const lang = getUserLangFromCtx(ctx);
    await ctx.reply(getTranslationForLang(lang, 'withdraw'), Markup.inlineKeyboard([
      Markup.button.webApp('Withdraw Money', `${process.env.APP_URL}/${lang}/withdraw`)
    ]));
  });

  bot.action('cmd_instructions', async (ctx: any) => {
    await ctx.answerCbQuery();
    const lang = getUserLangFromCtx(ctx);
    await ctx.reply(getTranslationForLang(lang, 'instructions'), Markup.inlineKeyboard([
      Markup.button.webApp('How to Play', `${process.env.APP_URL}/${lang}/instructions`)
    ]));
  });

  bot.action('cmd_support', async (ctx: any) => {
    await ctx.answerCbQuery();
    const lang = getUserLangFromCtx(ctx);
    await ctx.reply(getTranslationForLang(lang, 'support'), Markup.inlineKeyboard([
      Markup.button.webApp('Get Support', `${process.env.APP_URL}/${lang}/support`)
    ]));
  });

  bot.action('cmd_language', async (ctx: any) => {
    await ctx.answerCbQuery();
    const inlineButtons = ['en','am'].map(lang => Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`));
    await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
  });

  // bot.action(/set_language_(.+)/, async (ctx: any) => {
  //   await ctx.answerCbQuery();
  //   const selectedLang = ctx.match?.[1];
  //   const userId = ctx.from?.id;
  //   if (!userId || !selectedLang) return;
  //   setUserLang(userId, selectedLang);
  //   await ctx.reply(`${getTranslationForLang(selectedLang, 'languageChanged')} ${selectedLang.toUpperCase()}`);
  // });

  bot.action(/set_language_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const selectedLang = ctx.match?.[1];
  const userId = ctx.from?.id;
  if (!userId || !selectedLang) return;
  setUserLang(userId, selectedLang);
  const langKey = selectedLang as keyof typeof languageFullName;
  await ctx.reply(`${t(ctx, 'languageChanged')} ${languageFullName[langKey]}`);
  await showStartMenu(ctx);
});

  // Slash commands
  // bot.command('webview', async (ctx: any) => {
  //   const lang = getUserLangFromCtx(ctx);
  //   await ctx.reply(getTranslationForLang(lang, 'openingWebview'), Markup.inlineKeyboard([
  //     Markup.button.webApp('Open Lobby', `${process.env.APP_URL}/${lang}`)
  //   ]));
  // });

  // bot.command('gamerooms', async (ctx: any) => await showRooms(ctx));
  // bot.command('startgame', async (ctx: any) => await showStartMenu(ctx));

  // bot.command('deposit', async (ctx: any) => {
  //   const lang = getUserLangFromCtx(ctx);
  //   await ctx.reply(getTranslationForLang(lang, 'deposit'), Markup.inlineKeyboard([
  //     Markup.button.webApp('Deposit Fund', `${process.env.APP_URL}/${lang}/deposit`)
  //   ]));
  // });

  // bot.command('wallet', async (ctx: any) => {
  //   const lang = getUserLangFromCtx(ctx);
  //   await ctx.reply(getTranslationForLang(lang, 'wallet'), Markup.inlineKeyboard([
  //     Markup.button.webApp('Your Wallet', `${process.env.APP_URL}/${lang}/wallet`)
  //   ]));
  // });

  // bot.command('transfer', async (ctx: any) => {
  //   const lang = getUserLangFromCtx(ctx);
  //   await ctx.reply(getTranslationForLang(lang, 'transfer'), Markup.inlineKeyboard([
  //     Markup.button.webApp('Transfer Fund', `${process.env.APP_URL}/${lang}/transfer`)
  //   ]));
  // });

  // bot.command('withdraw', async (ctx: any) => {
  //   const lang = getUserLangFromCtx(ctx);
  //   await ctx.reply(getTranslationForLang(lang, 'withdraw'), Markup.inlineKeyboard([
  //     Markup.button.webApp('Withdraw Money', `${process.env.APP_URL}/${lang}/withdraw`)
  //   ]));
  // });

  // bot.command('instructions', async (ctx: any) => {
  //   const lang = getUserLangFromCtx(ctx);
  //   await ctx.reply(getTranslationForLang(lang, 'instructions'), Markup.inlineKeyboard([
  //     Markup.button.webApp('How to Play', `${process.env.APP_URL}/${lang}/instructions`)
  //   ]));
  // });

  // bot.command('support', async (ctx: any) => {
  //   const lang = getUserLangFromCtx(ctx);
  //   await ctx.reply(getTranslationForLang(lang, 'support'), Markup.inlineKeyboard([
  //     Markup.button.webApp('Get Support', `${process.env.APP_URL}/${lang}/support`)
  //   ]));
  // });

  // bot.command('language', async (ctx: any) => {
  //   const inlineButtons = ['en','am'].map(lang => Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`));
  //   await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
  // });

  bot.command('menu', async (ctx) => await showStartMenu(ctx));
  
  bot.command('webview', async (ctx) => {
    await ctx.reply(t(ctx, 'openingWebview'), Markup.inlineKeyboard([
      Markup.button.webApp('Open Web', `${process.env.APP_URL}/${getUserLangFromCtx(ctx)}`)
    ]));
  });
  bot.command('gamerooms', async (ctx) => await showRooms(ctx));
  bot.command('startgame', async (ctx) => await showRooms(ctx));
  bot.command('deposit', async (ctx) => await ctx.reply(t(ctx, 'deposit'), Markup.inlineKeyboard([
    Markup.button.webApp('Deposit Fund', `${process.env.APP_URL}/${getUserLangFromCtx(ctx)}/deposit`)
  ])));
  bot.command('wallet', async (ctx) => await ctx.reply(t(ctx, 'wallet'), Markup.inlineKeyboard([
    Markup.button.webApp('Your Wallet', `${process.env.APP_URL}/${getUserLangFromCtx(ctx)}/wallet`)
  ])));
  bot.command('transfer', async (ctx) => await ctx.reply(t(ctx, 'transfer'), Markup.inlineKeyboard([
    Markup.button.webApp('Transfer Fund', `${process.env.APP_URL}/${getUserLangFromCtx(ctx)}/transfer`)
  ])));
  bot.command('withdraw', async (ctx) => await ctx.reply(t(ctx, 'withdraw'), Markup.inlineKeyboard([
    Markup.button.webApp('Withdraw Money', `${process.env.APP_URL}/${getUserLangFromCtx(ctx)}/withdraw`)
  ])));
  bot.command('instructions', async (ctx) => await ctx.reply(t(ctx, 'instructions'), Markup.inlineKeyboard([
    Markup.button.webApp('How to Play', `${process.env.APP_URL}/${getUserLangFromCtx(ctx)}/instructions`)
  ])));
  bot.command('support', async (ctx) => await ctx.reply(t(ctx, 'support'), Markup.inlineKeyboard([
    Markup.button.webApp('Get Support', `${process.env.APP_URL}/${getUserLangFromCtx(ctx)}/support`)
  ])));
  bot.command('language', async (ctx) => {
    const inlineButtons = availableLanguages.map(lang =>
      Markup.button.callback(lang.toUpperCase(), `set_language_${lang}`)
    );
    await ctx.reply('🌐 Select your language:', Markup.inlineKeyboard(inlineButtons, { columns: 2 }));
  });
  
}

// helper exported for start handlers to show the menu
import { availableLanguages, translations } from '../translations';
import { showRooms } from './rooms';
import { t } from '../utils';
export async function showStartMenu(ctx: any) {
  const lang = getUserLang(ctx.from?.id) || 'en';
  const tr = translations[lang];
  await ctx.reply('📋 Choose a command:', Markup.inlineKeyboard([
    // [Markup.button.callback(tr.btnWebview, 'cmd_webview')],
    // [Markup.button.callback(tr.btnGameRooms, 'cmd_gamerooms')],
    // [Markup.button.callback(tr.btnStartGame, 'cmd_startgame')],
    // [Markup.button.callback(tr.btnDeposit, 'cmd_deposit')],
    // [Markup.button.callback(tr.btnTransfer, 'cmd_transfer')],
    // [Markup.button.callback(tr.btnWithdraw, 'cmd_withdraw')],
    // [Markup.button.callback(tr.btnInstructions, 'cmd_instructions')],
    // [Markup.button.callback(tr.btnSupport, 'cmd_support')],
    // [Markup.button.callback(tr.btnLanguage, 'cmd_language')],


    // Row 1 (single button)
        [Markup.button.callback(tr.btnStartGame, 'cmd_startgame')],
    
        // Row 2 (two buttons side by side)
        [
          Markup.button.callback(tr.btnGameRooms, 'cmd_gamerooms'),
          Markup.button.webApp(tr.btnWebview, `${process.env.APP_URL}/${lang}`)
        ],
    
        // Row 3 (three buttons)
        [
        //   Markup.button.callback(tr.btnDeposit, 'cmd_deposit'),
        //   Markup.button.callback(tr.btnTransfer, 'cmd_transfer'),
        //   Markup.button.callback(tr.btnWithdraw, 'cmd_withdraw'),
          Markup.button.webApp(tr.btnDeposit, `${process.env.APP_URL}/${lang}/deposit`),
          Markup.button.webApp(tr.btnWithdraw, `${process.env.APP_URL}/${lang}/withdraw`),
          Markup.button.webApp(tr.btnTransfer, `${process.env.APP_URL}/${lang}/transfer`),
          
        ],
    
        // Row 4
        [
            Markup.button.webApp(tr.btnBalance, `${process.env.APP_URL}/${lang}/wallet`)
        ],
    
        // Row 5
        [
            // Markup.button.callback(tr.btnInstructions, 'cmd_instructions')
            Markup.button.webApp(tr.btnInstructions, `${process.env.APP_URL}/${lang}/instructions`),
            Markup.button.callback(tr.changeNickname, `change_name`)
    
        ],
    
        // Row 6 (two buttons)
        [
          Markup.button.callback(tr.btnSupport, 'cmd_support'),
          Markup.button.callback(tr.btnLanguage, 'cmd_language'),
        ],
  ]));
}
