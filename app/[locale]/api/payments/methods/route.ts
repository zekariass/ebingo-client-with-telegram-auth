import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/backend/types";
import { createClient } from "@/lib/supabase/server";
import { PaymentMethod } from "@/lib/types";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

export async function GET() {
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

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/secured/payment-methods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
    }

    const result = await response.json();

     // Use result.data if your API wraps it in a success object
    const methods: PaymentMethod[] = Array.isArray(result.data) ? result.data : []

    const responseData: ApiResponse = {
      success: true,
      data: methods,
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
