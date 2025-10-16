// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user || session.user.role !== "admin") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get dashboard statistics
//     const [totalUsers, activeUsers, totalGames, activeGames, totalRevenue, todayRevenue] = await Promise.all([
//       prisma.user.count(),
//       prisma.user.count({ where: { status: "active" } }),
//       prisma.game.count(),
//       prisma.game.count({ where: { status: "playing" } }),
//       prisma.transaction.aggregate({
//         where: { type: "game_entry", status: "completed" },
//         _sum: { amount: true },
//       }),
//       prisma.transaction.aggregate({
//         where: {
//           type: "game_entry",
//           status: "completed",
//           createdAt: {
//             gte: new Date(new Date().setHours(0, 0, 0, 0)),
//           },
//         },
//         _sum: { amount: true },
//       }),
//     ])

//     const stats = {
//       activePlayers: activeUsers,
//       playersToday: totalUsers, // Mock - would need daily tracking
//       revenueToday: todayRevenue._sum.amount || 0,
//       revenueGrowth: 15.2, // Mock - would calculate from historical data
//       activeGames,
//       gamesCompleted: totalGames - activeGames,
//       avgGameDuration: 18, // Mock - would calculate from game data
//     }

//     return NextResponse.json({ success: true, data: stats })
//   } catch (error) {
//     console.error("Admin stats error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
