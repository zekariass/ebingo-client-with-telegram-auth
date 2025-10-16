import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse } from '@/lib/backend/types'; ``

export async function POST() {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const response: ApiResponse = {
        success: true,
        data: { message: 'Logged out' },
        error: null,
    };

    return NextResponse.json(response, { status: 200 });
}
