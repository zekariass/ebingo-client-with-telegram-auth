import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/backend/types";
import { createClient } from "@/lib/supabase/server";
import { use } from "i18next";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

export async function GET() {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined");
    }

    const supabase = await createClient();

    // ✅ Authenticate securely
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current access token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.access_token;

    console.log("=====================USER==============>>>>: ", user.id)

    // ✅ Call backend with verified user ID
    const response = await fetch(
      `${BACKEND_BASE_URL}/api/v1/secured/wallet?userSupabaseId=${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch wallet balance: ${response.statusText}`);
    }

    const result = await response.json();

    const {data} = result

    const responseData: ApiResponse = {
      success: true,
      data,
      error: null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
