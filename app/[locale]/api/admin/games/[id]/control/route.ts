// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

// export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user || session.user.role !== "admin") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { action, data } = await request.json()

//     let updateData: any = {}

//     switch (action) {
//       case "pause":
//         updateData = { status: "waiting" }
//         break
//       case "resume":
//         updateData = { status: "playing" }
//         break
//       case "stop":
//         updateData = { status: "finished", endedAt: new Date() }
//         break
//       case "reset":
//         updateData = {
//           status: "waiting",
//           numbersCalledCount: 0,
//           calledNumbers: "",
//           startedAt: null,
//           endedAt: null,
//         }
//         break
//       default:
//         return NextResponse.json({ error: "Invalid action" }, { status: 400 })
//     }

//     const game = await prisma.game.update({
//       where: { id: params.id },
//       data: updateData,
//     })

//     return NextResponse.json({ success: true, data: game })
//   } catch (error) {
//     console.error("Game control error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
