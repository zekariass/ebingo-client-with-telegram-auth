// import { type NextRequest, NextResponse } from "next/server"
// import type { ApiResponse } from "@/lib/backend/types"

// export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
//   try {
//     const body = await request.json()
//     const { userBalance, selectedCards, totalCost } = body

//     const isPracticeRoom = params.roomId === "test-room-1"

//     if (!isPracticeRoom && userBalance < totalCost) {
//       const response: ApiResponse = {
//         success: false,
//         error: `Insufficient balance. Required: $${totalCost}, Available: $${userBalance}`,
//       }
//       return NextResponse.json(response, { status: 400 })
//     }

//     if (!selectedCards || selectedCards.length === 0) {
//       const response: ApiResponse = {
//         success: false,
//         error: "No cards selected. Please select at least one card to play.",
//       }
//       return NextResponse.json(response, { status: 400 })
//     }

//     const game = gameState.startGame(params.roomId)

//     if (!game) {
//       const response: ApiResponse = {
//         success: false,
//         error: "Failed to start game. Room may not exist or not be ready.",
//       }
//       return NextResponse.json(response, { status: 400 })
//     }

//     const response: ApiResponse = {
//       success: true,
//       data: {
//         gameId: game.gameId,
//         startedAt: game.startedAt,
//         newBalance: isPracticeRoom ? userBalance : userBalance - totalCost,
//         isPracticeRoom,
//       },
//       error: null,
//     }

//     return NextResponse.json(response)
//   } catch (error) {
//     const response: ApiResponse = {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error",
//     }
//     return NextResponse.json(response, { status: 500 })
//   }
// }
