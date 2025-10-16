// import { type NextRequest, NextResponse } from "next/server"
// import { gameState } from "@/lib/backend/game-state"

// export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
//   try {
//     const { roomId } = params
//     const { cardId, position } = await request.json()

//     console.log("[Backend] Mark card request:", { roomId, cardId, position })

//     const game = gameState.getGame(roomId)
//     if (!game) {
//       return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 })
//     }

//     // Update player's card marking
//     const player = game.players.find((p) => p.cards.some((c) => c.id === cardId))
//     if (!player) {
//       return NextResponse.json({ success: false, error: "Player or card not found" }, { status: 404 })
//     }

//     const card = player.cards.find((c) => c.id === cardId)
//     if (!card) {
//       return NextResponse.json({ success: false, error: "Card not found" }, { status: 404 })
//     }

//     // Parse position (e.g., "2-3" -> row 2, col 3)
//     const [row, col] = position.split("-").map(Number)
//     if (row >= 0 && row < 5 && col >= 0 && col < 5) {
//       card.marked[row][col] = !card.marked[row][col]
//       console.log("[Backend] Card marked:", { cardId, position, marked: card.marked[row][col] })
//     }

//     return NextResponse.json({
//       success: true,
//       data: { cardId, position, marked: card.marked[row][col] },
//     })
//   } catch (error) {
//     console.error("[Backend] Error marking card:", error)
//     return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
//   }
// }
