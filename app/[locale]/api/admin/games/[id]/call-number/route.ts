import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // For demo purposes, we'll skip authentication and use mock data

    const { number } = await request.json()

    if (!number || number < 1 || number > 75) {
      return NextResponse.json({ error: "Invalid number. Must be between 1-75" }, { status: 400 })
    }

    // Mock game data - in a real app this would come from database
    const mockGame = {
      id: params.id,
      roomName: "Test Room 1",
      status: "playing",
      calledNumbers: JSON.stringify([15, 23, 42, 67, 8]), // Mock existing called numbers
      numbersCalledCount: 5,
    }

    // Parse current called numbers
    const calledNumbers = mockGame.calledNumbers ? JSON.parse(mockGame.calledNumbers) : []

    // Check if number already called
    if (calledNumbers.includes(number)) {
      return NextResponse.json({ error: "Number already called" }, { status: 400 })
    }

    // Add new number
    calledNumbers.push(number)

    // Mock updated game data
    const updatedGame = {
      ...mockGame,
      calledNumbers: JSON.stringify(calledNumbers),
      numbersCalledCount: calledNumbers.length,
      status: "playing",
    }

    // TODO: Broadcast to WebSocket clients
    // This would be implemented with a WebSocket server

    return NextResponse.json({
      success: true,
      data: {
        game: updatedGame,
        calledNumber: number,
        totalCalled: calledNumbers.length,
      },
    })
  } catch (error) {
    console.error("Call number error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
