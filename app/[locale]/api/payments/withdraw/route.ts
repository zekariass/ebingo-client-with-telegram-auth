import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/backend/types";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

/**
 * POST /[lang]/api/payments/shop
 * Body: { amount: number, paymentMethodId: number, bankName?: string, accountName?: string, accountNumber?: string }
 * Description: Initiates a payment request for the Ethiopian shop
 */
export async function POST(req: NextRequest) {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined");
    }

    // Read initData from headers
    const initData = req.headers.get("x-init-data");
    if (!initData) {
      return NextResponse.json(
        { success: false, error: "Missing x-init-data header" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { amount, paymentMethodId, bankName, accountName, accountNumber } = body;

    if (!amount || !paymentMethodId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: amount or paymentMethodId" },
        { status: 400 }
      );
    }

    // Forward request to backend with x-init-data
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/secured/transactions/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-init-data": initData, // verification
      },
      body: JSON.stringify({ amount, paymentMethodId, bankName, accountName, accountNumber }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result?.error || "Backend payment failed" },
        { status: response.status }
      );
    }

    const responseData: ApiResponse = {
      success: true,
      data: result.data,
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
