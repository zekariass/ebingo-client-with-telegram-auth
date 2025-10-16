// import { type NextRequest, NextResponse } from "next/server"
// // import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session?.user || session.user.role !== "admin") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get analytics data
//     const [totalRevenue, totalPlayers, totalGames, revenueByTier, popularPatterns] = await Promise.all([
//       prisma.transaction.aggregate({
//         where: { type: "game_entry", status: "completed" },
//         _sum: { amount: true },
//       }),
//       prisma.user.count({ where: { role: "player" } }),
//       prisma.game.count(),
//       prisma.gameEntry.groupBy({
//         by: ["fee"],
//         _count: { id: true },
//         _sum: { fee: true },
//       }),
//       prisma.room.groupBy({
//         by: ["pattern"],
//         _count: { id: true },
//       }),
//     ])

//     // Calculate revenue by tier with percentages
//     const totalRevenueAmount = totalRevenue._sum.amount || 0
//     const revenueByTierWithPercentage = revenueByTier.map((tier) => ({
//       fee: tier.fee,
//       games: tier._count.id,
//       revenue: tier._sum.fee || 0,
//       percentage: totalRevenueAmount > 0 ? Math.round(((tier._sum.fee || 0) / totalRevenueAmount) * 100) : 0,
//     }))

//     // Calculate popular patterns with percentages
//     const totalPatterns = popularPatterns.reduce((sum, pattern) => sum + pattern._count.id, 0)
//     const popularPatternsWithPercentage = popularPatterns.map((pattern) => ({
//       name: pattern.pattern,
//       games: pattern._count.id,
//       percentage: totalPatterns > 0 ? Math.round((pattern._count.id / totalPatterns) * 100) : 0,
//     }))

//     const analytics = {
//       totalRevenue: totalRevenueAmount,
//       revenueGrowth: 15.2, // Mock - would calculate from historical data
//       totalPlayers,
//       playerGrowth: 8.5, // Mock - would calculate from historical data
//       gamesPlayed: totalGames,
//       gamesDecline: 2.1, // Mock - would calculate from historical data
//       avgPrizePool: 450, // Mock - would calculate from actual prize data
//       prizePoolGrowth: 12.3, // Mock - would calculate from historical data
//       revenueByTier: revenueByTierWithPercentage,
//       popularPatterns: popularPatternsWithPercentage,
//     }

//     return NextResponse.json({ success: true, data: analytics })
//   } catch (error) {
//     console.error("Admin analytics error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
