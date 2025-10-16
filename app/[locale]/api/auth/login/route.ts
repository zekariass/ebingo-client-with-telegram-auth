import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/backend/types"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    const response: ApiResponse = {
      success: false,
      error: "Email and password are required",
    }
    return NextResponse.json(response, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error || !data.user) {
      const response: ApiResponse = {
        success: false,
        error: error?.message || "Authentication failed",
      }
      return NextResponse.json(response, { status: 401 })
    }

    console.log("Login response:", data)


    const response: ApiResponse = {
      success: true,
      data: {
        user: data.user,
        token: data.session?.access_token,
      },
      error: null,
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
    return NextResponse.json(response, { status: 500 })
  }
}