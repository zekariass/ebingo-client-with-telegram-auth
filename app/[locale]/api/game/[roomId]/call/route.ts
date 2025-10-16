// import { type NextRequest, NextResponse } from "next/server"
// import { gameState } from "@/lib/backend/game-state"
// import type { ApiResponse } from "@/lib/backend/types"

// export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
//   try {
//     const result = gameState.callNumber(params.roomId)

//     if (!result) {
//       const response: ApiResponse = {
//         success: false,
//         error: "Failed to call number. Game may not be active or all numbers called.",
//       }
//       return NextResponse.json(response, { status: 400 })
//     }

//     const response: ApiResponse = {
//       success: true,
//       data: result,
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
