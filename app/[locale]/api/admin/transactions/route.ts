import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/backend/types"
import { createClient } from "@/lib/supabase/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!

/**
 * GET /[lang]/api/admin/transactions/by-status
 * Query Params: status, type, page, size, sortBy
 */
export async function GET(request: NextRequest) {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined")
    }

    // Supabase auth
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = session.access_token

    // Extract and forward query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""
    const page = searchParams.get("page") || "0"
    const size = searchParams.get("size") || "10"
    const sortBy = searchParams.get("sortBy") || "createdat"

    // Construct backend URL with encoded params
    const backendUrl = `${BACKEND_BASE_URL}/api/v1/secured/transactions/by-status?` +
      new URLSearchParams({
        status,
        type,
        page,
        size,
        sortBy,
      }).toString()

    // Fetch from backend
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Backend transactions fetch failed: ${response.status} ${errText}`)
    }

    const result = await response.json()

    const responseData: ApiResponse = {
      success: true,
      data: result.data,
      error: null,
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error("Admin transactions error:", error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
