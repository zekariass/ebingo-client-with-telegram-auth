// import { type NextRequest, NextResponse } from "next/server"
// import { gameState } from "@/lib/backend/game-state"
// import type { ApiResponse } from "@/lib/backend/types"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { roomId, playerId, cardId, pattern } = body

//     if (!roomId || !playerId || !cardId || !pattern) {
//       const response: ApiResponse = {
//         success: false,
//         error: "Missing required fields: roomId, playerId, cardId, pattern",
//       }
//       return NextResponse.json(response, { status: 400 })
//     }

//     const isPracticeRoom = roomId === "test-room-1"

//     const result = gameState.claimBingo(roomId, playerId, cardId, pattern)

//     const response: ApiResponse = {
//       success: true,
//       data: {
//         verified: result.valid,
//         prize: isPracticeRoom ? 0 : result.prize || 0,
//         isPracticeRoom,
//         message: isPracticeRoom ? "BINGO! Great job practicing!" : undefined,
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
