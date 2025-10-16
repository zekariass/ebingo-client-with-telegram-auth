import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll skip authentication and return mock data directly

    const mockGames = [
      {
        id: "game-1",
        roomId: "test-room-1",
        roomName: "Test Room 1",
        status: "playing",
        currentNumber: 42,
        calledNumbers: JSON.stringify([15, 23, 42, 67, 8]),
        numbersCalledCount: 5,
        players: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "game-2",
        roomId: "premium-room",
        roomName: "Premium Room",
        status: "waiting",
        currentNumber: null,
        calledNumbers: JSON.stringify([]),
        numbersCalledCount: 0,
        players: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "game-3",
        roomId: "vip-room",
        roomName: "VIP Room",
        status: "playing",
        currentNumber: 73,
        calledNumbers: JSON.stringify([12, 34, 56, 73, 9, 45]),
        numbersCalledCount: 6,
        players: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ success: true, data: mockGames })
  } catch (error) {
    console.error("Admin games error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
