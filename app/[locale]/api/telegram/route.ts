// ==================================================================================
// import { NextRequest, NextResponse } from 'next/server';
// import { bot } from '@/bot/index-oldProd';

// export async function POST(req: NextRequest, { params }: { params: { locale: string } }) {
//   try {
//     const update = await req.json();
//     // handle update safely
//     await bot.handleUpdate(update).catch(err => console.error('handleUpdate error:', err));
//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error('Telegram webhook error:', error);
//     return NextResponse.json({ ok: false, error: (error as Error).message });
//   }
// }




// app/en/api/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bot from '@/bot';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body); // forward Telegram update to bot
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: false, error: err });
  }
}
