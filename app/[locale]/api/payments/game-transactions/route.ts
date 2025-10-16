import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/backend/types";
import { createClient } from "@/lib/supabase/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

export async function GET(req: NextRequest) {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined");
    }

    const supabase = await createClient();

    // Securely authenticate user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get access token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = session.access_token;
    const userSupabaseId = user.id;

    // Collect query parameters from frontend request
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";
    const sortBy = "createdAt";

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    // Forward query params to backend
    const backendUrl = new URL(`${BACKEND_BASE_URL}/api/v1/secured/game/transaction`);
    // backendUrl.searchParams.append("userSupabaseId", userSupabaseId);
    backendUrl.searchParams.append("page", page);
    backendUrl.searchParams.append("size", size);
    backendUrl.searchParams.append("sortBy", sortBy);

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch game transactions: ${response.statusText}`);
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
