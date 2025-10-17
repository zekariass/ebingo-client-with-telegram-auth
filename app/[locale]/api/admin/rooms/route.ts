import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL!;

/**
 * GET - Fetch all rooms (ADMIN only)
 */
export async function GET(request: NextRequest) {
  try {
    // Read role and initData from headers (sent by frontend)
    const role = request.headers.get("x-user-role");
    const initData = request.headers.get("x-init-data");

    // Check role
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    if (!initData) {
      return NextResponse.json({ error: "Missing initData" }, { status: 400 });
    }

    // Call backend API with initData for verification
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/secured/rooms`, {
      headers: {
        "Content-Type": "application/json",
        "x-init-data": initData, // Pass to backend for verification
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result?.error || "Backend error" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error("Admin rooms error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST - Create a room (ADMIN only)
 */
export async function POST(request: NextRequest) {
  try {
    // Read role and initData from headers
    const role = request.headers.get("x-user-role");
    const initData = request.headers.get("x-init-data");

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    if (!initData) {
      return NextResponse.json({ error: "Missing initData" }, { status: 400 });
    }

    const { name, entryFee, capacity, minPlayers, pattern } = await request.json();

    if (!name || !entryFee || !capacity || !minPlayers || !pattern) {
      return NextResponse.json(
        { error: "Missing required fields or invalid field name" },
        { status: 400 }
      );
    }

    const body = JSON.stringify({ name, entryFee: Number(entryFee), capacity: Number(capacity), minPlayers: Number(minPlayers), pattern })

    // Forward data to backend for verification and room creation
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/secured/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-init-data": initData,
      },
      body:body,
    });


    console.log("=======================>>Create room response:", response);
    console.log("=======================>>Create room body:", body);
    console.log("=======================>>Create room body:", initData);

    const data = await response.json();

    console.log("=======================>>Create room DATA:", data);


    if (!response.ok) {
      return NextResponse.json({ error: data?.error || "Backend error" }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Create room error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
