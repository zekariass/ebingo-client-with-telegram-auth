import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

export async function GET(req: NextRequest) {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined");
    }

    const supabase = await createClient();

    // ✅ Get verified user info from Supabase Auth server
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get session to retrieve access token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.access_token;

    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/secured/user-profile/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: res.status }
      );
    }

    const result = await res.json();
    const { data } = result;

    return NextResponse.json({ success: true, data, error: null });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
