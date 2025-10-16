import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/backend/types";
import { createClient } from "@/lib/supabase/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

/**
 * POST /[lang]/api/payments/shop
 * Body: { amount: number, paymentMethodId: number, orderId?: string }
 * Description: Initiates a payment request for the Ethiopian shop
 */
export async function POST(req: NextRequest) {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined");
    }

    const supabase = await createClient();

    // Authenticate user via Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get access token for backend authorization
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = session.access_token;

    // Parse request body
    const body = await req.json();

    const { amount, paymentMethodId, bankName, accountName, accountNumber } = body;

    if (!amount || !paymentMethodId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: amount or paymentMethodId" },
        { status: 400 }
      );
    }

    // Forward request to your Ethiopian shop backend
    const backendUrl = `${BACKEND_BASE_URL}/api/v1/secured/transactions/withdraw`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount, paymentMethodId, bankName, accountName, accountNumber
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ethiopian shop payment failed: ${response.status} ${errText}`);
    }

    const result = await response.json();
    const { data } = result;

    const responseData: ApiResponse = {
      success: true,
      data,
      error: null,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Ethiopian shop payment route error:", error);
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
