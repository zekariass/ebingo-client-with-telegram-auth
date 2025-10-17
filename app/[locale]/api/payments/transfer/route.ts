import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/backend/types";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

/**
 * POST /[lang]/api/payments/transfer
 * Body: { amount: number, email: string }
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

    // Parse incoming JSON body
    const { amount, email } = await req.json();

    if (!amount || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: amount or email" },
        { status: 400 }
      );
    }

    // Forward request to backend API with x-init-data
    const backendUrl = `${BACKEND_BASE_URL}/api/v1/secured/deposit/transfers`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-init-data": initData, // pass initData for verification
      },
      body: JSON.stringify({ amount, email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result?.error || "Backend transfer failed" },
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
    console.error("Transfer route error:", error);
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
