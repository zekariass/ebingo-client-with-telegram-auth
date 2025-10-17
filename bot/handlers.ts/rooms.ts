import axios from 'axios';
import { Markup } from 'telegraf';
import { getUserLang } from '../userLangMap';
import { translations } from '../translations';

export function registerRoomHandlers(bot: any) {
  bot.action(/show_rooms_(\d+)/, async (ctx: any) => {
    await ctx.answerCbQuery();
    const page = parseInt(ctx.match?.[1] || '1', 10);
    await showRooms(ctx, page);
  });
}

export async function showRooms(ctx: any, page = 1) {
  const ROOMS_PER_PAGE = 10;
  const currency = 'Birr';
  try {
    const response = await axios.get(`${process.env.BACKEND_BASE_URL}/api/v1/public/rooms`);
    const rooms = response.data.data;
    if (!rooms || rooms.length === 0) {
      return await ctx.reply(getTranslation(ctx, 'noRooms'));
    }

    const startIdx = (page - 1) * ROOMS_PER_PAGE;
    const pagedRooms = rooms.slice(startIdx, startIdx + ROOMS_PER_PAGE);

    const roomButtons = pagedRooms.map((room: any) =>
      Markup.button.webApp(`(${room.entryFee} ${currency})`, `${process.env.APP_URL}/${getUserLang(ctx.from?.id)}/rooms/${room.id}`)
    );

    const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
    const navButtons: any[] = [];
    if (page > 1) navButtons.push(Markup.button.callback(getTranslation(ctx, 'prev'), `show_rooms_${page - 1}`));
    if (page < totalPages) navButtons.push(Markup.button.callback(getTranslation(ctx, 'next'), `show_rooms_${page + 1}`));

    await ctx.reply(getTranslation(ctx, 'chooseRoom'), Markup.inlineKeyboard([...roomButtons, ...navButtons], { columns: 2 }));
  } catch (err) {
    console.error('[ERROR] Failed to fetch rooms:', err);
    await ctx.reply(getTranslation(ctx, 'fetchError'));
  }
}

function getTranslation(ctx: any, key: string) {
  const lang = getUserLang(ctx.from?.id);
  return translations[lang]?.[key] || translations['en'][key] || key;
}
