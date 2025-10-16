import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/backend/types"
import { createClient } from "@/lib/supabase/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!

/**
 * PATCH /[lang]/api/admin/transactions/:txnRef/status
 * Query: ?status=COMPLETED
 */
export async function PATCH(request: NextRequest, context: { params: Promise<{ txnRef: string }> }) {
  try {
    if (!BACKEND_BASE_URL) {
      throw new Error("BACKEND_BASE_URL is not defined")
    }

    // Must await params in Next.js 15+
    const { txnRef } = await context.params

    if (!txnRef) {

      return NextResponse.json(
        { success: false, error: "Transaction reference is required" },
        { status: 400 }
      )
    }

    // Get `status` from query parameters (not body)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    if (!status) {

      return NextResponse.json(
        { success: false, error: "Status query parameter is required" },
        { status: 400 }
      )
    }

    // Supabase authentication
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

    // Build backend URL safely
    const backendUrl = `${BACKEND_BASE_URL}/api/v1/secured/transactions/${encodeURIComponent(
      txnRef
    )}/change-status?${new URLSearchParams({ status }).toString()}`

    // Call backend
    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Backend update failed: ${response.status} ${errText}`)
    }

    const result = await response.json()

    const responseData: ApiResponse = {
      success: result.success ?? true,
      data: result.data ?? null,
      error: result.success ? null : result.message || "Failed to update transaction status",
    }

    console.log(">>>>>>>>>>>>>>>>>>>SUCCESS>>>>>>>>>>>>>>>>>>>>>>>: ", response)

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error("Change transaction status error:", error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
