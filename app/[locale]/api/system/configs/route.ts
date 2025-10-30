import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/backend/types"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!

export async function GET(
  request: NextRequest,
) {

    // console.log("================INITIAL SYSTEM CONFIG=================>>>>: ")

  try {

    const backendRes = await fetch(
      `${BACKEND_BASE_URL}/api/v1/system-configs`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    )

    if (!backendRes.ok) {
      const response: ApiResponse = {
        success: false,
        error: `Backend returned ${backendRes.status}`,
      }
      return NextResponse.json(response, { status: backendRes.status })
    }

    const { data } = await backendRes.json()

    const response: ApiResponse = {
      success: true,
      data,
      error: null,
    }

    // console.log("================SYSTEM CONFIG=================>>>>: ", data)

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
