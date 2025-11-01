// ==================================================================================
import { NextRequest, NextResponse } from 'next/server';
import { bot } from '@/bot/index-oldProd';

export async function POST(req: NextRequest, { params }: { params: { locale: string } }) {
  try {
    const update = await req.json();
    // handle update safely
    await bot.handleUpdate(update).catch(err => console.error('handleUpdate error:', err));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
