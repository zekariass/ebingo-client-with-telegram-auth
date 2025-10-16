// "use client"

// import { useRoomStore } from "@/lib/stores/room-store"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { getPatternCompletion, getWinningPatterns } from "@/lib/utils/bingo-patterns"
// import { Trophy, Target } from "lucide-react"

// export function PatternProgress() {
//   const { userCards, pattern } = useRoomStore()

//   if (!pattern || userCards.length === 0) {
//     return null
//   }

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg flex items-center gap-2">
//           <Target className="h-4 w-4" />
//           Pattern Progress
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {userCards.map((card) => {
//           const completion = getPatternCompletion(card, pattern)
//           const winningPatterns = getWinningPatterns(card)
//           const hasWon = winningPatterns.length > 0

//           return (
//             <div key={card.id} className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Card #{card.id}</span>
//                 <div className="flex items-center gap-2">
//                   {hasWon && (
//                     <Badge variant="default" className="bg-green-500 text-white">
//                       <Trophy className="h-3 w-3 mr-1" />
//                       BINGO!
//                     </Badge>
//                   )}
//                   <span className="text-xs text-muted-foreground">{Math.round(completion * 100)}%</span>
//                 </div>
//               </div>

//               <Progress value={completion * 100} className={`h-2 ${hasWon ? "bg-green-100 dark:bg-green-900" : ""}`} />

//               {hasWon && (
//                 <div className="text-xs text-green-600 dark:text-green-400">
//                   Winning patterns: {winningPatterns.join(", ")}
//                 </div>
//               )}
//             </div>
//           )
//         })}
//       </CardContent>
//     </Card>
//   )
// }
