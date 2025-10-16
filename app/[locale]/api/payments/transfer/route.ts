import { NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/backend/types"
import { createClient } from "@/lib/supabase/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!

/**
 * POST /[lang]/api/payments/transfer
 * Body: { amount: number, email: string }
 */
export async function POST(req: NextRequest) {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined")
    }

    const supabase = await createClient()

    // Authenticate user via Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get access token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = session.access_token

    // Parse incoming JSON body
    const body = await req.json()
    const { amount, email } = body

    if (!amount || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: amount or email" },
        { status: 400 }
      )
    }

    // Forward request to backend API
    const backendUrl = `${BACKEND_BASE_URL}/api/v1/secured/deposit/transfers`

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        email: email, // ✅ Use the backend's expected field name
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Backend transfer failed: ${response.status} ${errText}`)
    }

    const result = await response.json()
    const { data } = result

    const responseData: ApiResponse = {
      success: true,
      data,
      error: null,
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error("Transfer route error:", error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
