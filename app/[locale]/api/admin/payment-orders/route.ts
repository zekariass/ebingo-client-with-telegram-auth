import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://your-backend-url.com"

export async function GET(req: NextRequest) {
  const initData = req.headers.get("x-init-data")
  const role = req.headers.get("x-user-role")
  const { searchParams } = new URL(req.url)

  const page = searchParams.get("page") || "0"
  const size = searchParams.get("size") || "10"
  const type = searchParams.get("type") || ""
  const status = searchParams.get("status") || ""

  if (!initData || role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
  }

  try {
    const backendUrl = `${BACKEND_URL}/api/admin/payment-orders?type=${type}&status=${status}&page=${page}&size=${size}`

    const res = await fetch(backendUrl, {
      headers: {
        "x-init-data": initData,
        "x-user-role": role,
      },
    })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching payment orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
