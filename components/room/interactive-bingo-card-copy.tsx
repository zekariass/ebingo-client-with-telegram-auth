// // "use client"

// // import type { BingoCard } from "@/lib/types"
// // import { useRoomStore } from "@/lib/stores/room-store"
// // import { useWebSocketEvents } from "@/lib/hooks/use-websocket-events"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// // import { cn } from "@/lib/utils"
// // import { checkWinningPattern } from "@/lib/utils/bingo"

// // interface InteractiveBingoCardProps {
// //   card: BingoCard
// // }

// // export function InteractiveBingoCard({ card }: InteractiveBingoCardProps) {
// //   const { calledNumbers, pattern, markNumber, room } = useRoomStore()
// //   const {
// //     markNumber: wsMarkNumber,
// //     claimBingo,
// //     connected,
// //   } = useWebSocketEvents({
// //     roomId: room?.id || "",
// //     enabled: !!room,
// //   })

// //   if (!card || !Array.isArray(card.numbers) || !Array.isArray(card.marked)) {
// //     return (
// //       <div className="border rounded-lg p-4 text-center text-red-500">
// //         <p>Invalid card data</p>
// //         <p className="text-sm text-muted-foreground">Card #{card?.id || "Unknown"}</p>
// //       </div>
// //     )
// //   }

// //   const cardNumbers =
// //     card.numbers.length === 5 && card.numbers.every((row) => Array.isArray(row) && row.length === 5)
// //       ? card.numbers
// //       : Array(5)
// //           .fill(null)
// //           .map(() => Array(5).fill(0))

// //   const cardMarked =
// //     card.marked.length === 5 && card.marked.every((row) => Array.isArray(row) && row.length === 5)
// //       ? card.marked
// //       : Array(5)
// //           .fill(null)
// //           .map(() => Array(5).fill(false))

// //   const hasWinningPattern = pattern
// //     ? checkWinningPattern({ ...card, numbers: cardNumbers, marked: cardMarked }, pattern)
// //     : false

// //   const getPatternProgress = () => {
// //     if (!pattern || !pattern.positions) return 0

// //     let totalCells = 0
// //     let markedCells = 0

// //     for (let row = 0; row < 5; row++) {
// //       for (let col = 0; col < 5; col++) {
// //         if (pattern.positions.some((pos) => pos.row === row && pos.col === col)) {
// //           totalCells++
// //           if (cardMarked[row][col]) {
// //             markedCells++
// //           }
// //         }
// //       }
// //     }

// //     return totalCells > 0 ? (markedCells / totalCells) * 100 : 0
// //   }

// //   const patternProgress = getPatternProgress()

// //   const handleCellClick = (number: number) => {
// //     if (number === 0) return // FREE space

// //     if (!calledNumbers.includes(number)) {
// //       console.error("Invalid Number: You can only mark numbers that have been called out")
// //       return
// //     }

// //     markNumber(card.id, number)

// //     if (connected) {
// //       wsMarkNumber(card.id, number)
// //     }
// //   }

// //   const isCellMarkable = (number: number) => {
// //     if (number === 0) return false // FREE space
// //     return calledNumbers.includes(number)
// //   }

// //   const COLUMN_HEADERS = ["B", "I", "N", "G", "O"]

// //   const handleBingoClaim = () => {
// //     if (!hasWinningPattern) return

// //     if (connected) {
// //       claimBingo(card.id)
// //       console.log(`Bingo Claimed! You've claimed bingo for Card #${card.id}`)
// //     } else {
// //       console.error("Connection Required: You need to be connected to claim bingo")
// //     }
// //   }

// //   return (
// //     <div
// //       className={cn(
// //         "border rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-300 w-full max-w-xs mx-auto",
// //         hasWinningPattern ? "border-green-500 bg-green-50 dark:bg-green-950 shadow-lg" : "border-border",
// //       )}
// //     >
// //       {/* <div className="block lg:hidden mb-2">
// //         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
// //           <div
// //             className={cn(
// //               "h-1.5 rounded-full transition-all duration-500",
// //               hasWinningPattern ? "bg-green-500" : "bg-blue-500",
// //             )}
// //             style={{ width: `${patternProgress}%` }}
// //           />
// //         </div>
// //         <div className="flex justify-between items-center mt-1">
// //           <span className="text-xs text-muted-foreground">{pattern?.name || "No Pattern"}</span>
// //           <span className="text-xs text-muted-foreground">{Math.round(patternProgress)}%</span>
// //         </div>
// //       </div> */}

// //       <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
// //         <Badge variant="outline" className="font-mono text-xs sm:text-sm">
// //           Card #{card.id}
// //         </Badge>
// //         {hasWinningPattern && (
// //           <Badge variant="default" className="bg-green-500 text-white text-xs sm:text-sm">
// //             BINGO!
// //           </Badge>
// //         )}
// //         {!connected && (
// //           <Badge variant="destructive" className="text-xs">
// //             Offline
// //           </Badge>
// //         )}
// //       </div>

// //       <div className="space-y-1 sm:space-y-2">
// //         {/* Column Headers */}
// //         <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
// //           {COLUMN_HEADERS.map((letter) => (
// //             <div
// //               key={letter}
// //               className="h-6 sm:h-7 md:h-8 flex items-center justify-center font-bold text-sm sm:text-base md:text-lg bg-primary text-primary-foreground rounded"
// //             >
// //               {letter}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Bingo Grid */}
// //         <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
// //           {cardNumbers.map((row, rowIndex) =>
// //             row.map((number, colIndex) => {
// //               const isMarked = cardMarked[rowIndex][colIndex]
// //               const isFree = rowIndex === 2 && colIndex === 2
// //               const isMarkable = isCellMarkable(number)
// //               const canClick = !isFree && !isMarked && connected

// //               return (
// //                 <TooltipProvider key={`${rowIndex}-${colIndex}`}>
// //                   <Tooltip>
// //                     <TooltipTrigger asChild>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         className={cn(
// //                           "h-8 sm:h-10 md:h-12 w-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 p-0 min-w-0 rounded-xs",
// //                           isFree && "bg-yellow-200 dark:bg-yellow-800 border-yellow-400",
// //                           isMarked && !isFree && "bg-blue-500 text-white border-blue-600",
// //                           !isMarked &&
// //                             !isFree &&
// //                             isMarkable &&
// //                             connected &&
// //                             "hover:bg-green-100 dark:hover:bg-green-900 border-green-300",
// //                           !isMarked && !isFree && (!isMarkable || !connected) && "opacity-50 cursor-not-allowed",
// //                         )}
// //                         onClick={() => canClick && handleCellClick(number)}
// //                         disabled={!canClick}
// //                       >
// //                         {isFree ? <span className="text-xs sm:text-sm">⭐</span> : number}
// //                         {isMarked && !isFree && (
// //                           <span className="absolute inset-0 flex items-center justify-center text-white text-sm sm:text-base md:text-lg">
// //                             ✓
// //                           </span>
// //                         )}
// //                       </Button>
// //                     </TooltipTrigger>
// //                     <TooltipContent>
// //                       {isFree
// //                         ? "Free space - automatically marked"
// //                         : isMarked
// //                           ? "Number marked"
// //                           : !connected
// //                             ? "Connection required to mark numbers"
// //                             : isMarkable
// //                               ? "Click to mark this number"
// //                               : "Wait for this number to be called"}
// //                     </TooltipContent>
// //                   </Tooltip>
// //                 </TooltipProvider>
// //               )
// //             }),
// //           )}
// //         </div>

// //         <div className="mt-3 sm:mt-4">
// //           <Button
// //             onClick={handleBingoClaim}
// //             disabled={!hasWinningPattern || !connected}
// //             className={cn(
// //               "w-full font-bold text-sm sm:text-base transition-all duration-300",
// //               hasWinningPattern && connected
// //                 ? "bg-green-500 hover:bg-green-600 text-white animate-pulse"
// //                 : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed",
// //             )}
// //             size="sm"
// //           >
// //             {hasWinningPattern ? "CLAIM BINGO!" : "BINGO"}
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// "use client"

// import type { BingoCard } from "@/lib/types"
// import { useRoomStore } from "@/lib/stores/room-store"
// import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import { checkWinningPattern } from "@/lib/utils/bingo"

// interface InteractiveBingoCardProps {
//   card: BingoCard
// }

// export function InteractiveBingoCard({ card }: InteractiveBingoCardProps) {
//   const { calledNumbers, pattern, markNumber, room } = useRoomStore()
//   const {
//     markNumber: wsMarkNumber,
//     claimBingo,
//     connected,
//   } = useWebSocketEvents({
//     roomId: room?.id || "",
//     enabled: !!room,
//   })

//   if (!card || !Array.isArray(card.numbers) || !Array.isArray(card.marked)) {
//     return (
//       <div className="border rounded-lg p-4 text-center text-red-500">
//         <p>Invalid card data</p>
//         <p className="text-sm text-muted-foreground">Card #{card?.id || "Unknown"}</p>
//       </div>
//     )
//   }

//   const cardNumbers =
//     card.numbers.length === 5 && card.numbers.every((row) => Array.isArray(row) && row.length === 5)
//       ? card.numbers
//       : Array(5)
//           .fill(null)
//           .map(() => Array(5).fill(0))

//   const cardMarked =
//     card.marked.length === 5 && card.marked.every((row) => Array.isArray(row) && row.length === 5)
//       ? card.marked
//       : Array(5)
//           .fill(null)
//           .map(() => Array(5).fill(false))

//   const hasWinningPattern = pattern
//     ? checkWinningPattern({ ...card, numbers: cardNumbers, marked: cardMarked }, pattern)
//     : false

//   const getPatternProgress = () => {
//     if (!pattern || !pattern.positions) return 0

//     let totalCells = 0
//     let markedCells = 0

//     for (let row = 0; row < 5; row++) {
//       for (let col = 0; col < 5; col++) {
//         if (pattern.positions.some((pos) => pos.row === row && pos.col === col)) {
//           totalCells++
//           if (cardMarked[row][col]) {
//             markedCells++
//           }
//         }
//       }
//     }

//     return totalCells > 0 ? (markedCells / totalCells) * 100 : 0
//   }

//   const patternProgress = getPatternProgress()

//   const handleCellClick = (number: number) => {
//     if (number === 0) return // FREE space

//     if (!calledNumbers.includes(number)) {
//       console.error("Invalid Number: You can only mark numbers that have been called out")
//       return
//     }

//     markNumber(card.id, number)

//     if (connected) {
//       wsMarkNumber(card.id, number)
//     }
//   }

//   const isCellMarkable = (number: number) => {
//     if (number === 0) return false // FREE space
//     return calledNumbers.includes(number)
//   }

//   const COLUMN_HEADERS = ["B", "I", "N", "G", "O"]

//   const handleBingoClaim = () => {
//     if (!hasWinningPattern) return

//     if (connected) {
//       claimBingo(card.id)
//       console.log(`Bingo Claimed! You've claimed bingo for Card #${card.id}`)
//     } else {
//       console.error("Connection Required: You need to be connected to claim bingo")
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "border rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-300 w-full max-w-xs mx-auto",
//         hasWinningPattern ? "border-green-500 bg-green-50 dark:bg-green-950 shadow-lg" : "border-border",
//       )}
//     >
//       <div className="block lg:hidden mb-2">
//         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
//           <div
//             className={cn(
//               "h-1.5 rounded-full transition-all duration-500",
//               hasWinningPattern ? "bg-green-500" : "bg-blue-500",
//             )}
//             style={{ width: `${patternProgress}%` }}
//           />
//         </div>
//         <div className="flex justify-between items-center mt-1">
//           <span className="text-xs text-muted-foreground">{pattern?.name || "No Pattern"}</span>
//           <span className="text-xs text-muted-foreground">{Math.round(patternProgress)}%</span>
//         </div>
//       </div>

//       <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
//         <Badge variant="outline" className="font-mono text-xs sm:text-sm">
//           Card #{card.id}
//         </Badge>
//         {hasWinningPattern && (
//           <Badge variant="default" className="bg-green-500 text-white text-xs sm:text-sm">
//             BINGO!
//           </Badge>
//         )}
//         {!connected && (
//           <Badge variant="destructive" className="text-xs">
//             Offline
//           </Badge>
//         )}
//       </div>

//       <div className="space-y-1 sm:space-y-2">
//         {/* Column Headers */}
//         <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
//           {COLUMN_HEADERS.map((letter) => (
//             <div
//               key={letter}
//               className="h-6 sm:h-7 md:h-8 flex items-center justify-center font-bold text-sm sm:text-base md:text-lg bg-primary text-primary-foreground rounded"
//             >
//               {letter}
//             </div>
//           ))}
//         </div>

//         {/* Bingo Grid */}
//         <div className="grid grid-cols-5 gap-0.5 sm:gap-1">
//           {cardNumbers.map((row, rowIndex) =>
//             row.map((number, colIndex) => {
//               const isMarked = cardMarked[rowIndex][colIndex]
//               const isFree = rowIndex === 2 && colIndex === 2
//               const isMarkable = isCellMarkable(number)
//               const canClick = !isFree && !isMarked && connected

//               return (
//                 <TooltipProvider key={`${rowIndex}-${colIndex}`}>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className={cn(
//                           "h-8 sm:h-10 md:h-12 w-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 p-0 min-w-0",
//                           isFree && "bg-yellow-200 dark:bg-yellow-800 border-yellow-400",
//                           isMarked && !isFree && "bg-blue-500 text-white border-blue-600",
//                           !isMarked &&
//                             !isFree &&
//                             isMarkable &&
//                             connected &&
//                             "hover:bg-green-100 dark:hover:bg-green-900 border-green-300",
//                           !isMarked && !isFree && (!isMarkable || !connected) && "opacity-50 cursor-not-allowed",
//                         )}
//                         onClick={() => canClick && handleCellClick(number)}
//                         disabled={!canClick}
//                       >
//                         {isFree ? <span className="text-xs sm:text-sm">⭐</span> : number}
//                         {isMarked && !isFree && (
//                           <span className="absolute inset-0 flex items-center justify-center text-white text-sm sm:text-base md:text-lg">
//                             ✓
//                           </span>
//                         )}
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       {isFree
//                         ? "Free space - automatically marked"
//                         : isMarked
//                           ? "Number marked"
//                           : !connected
//                             ? "Connection required to mark numbers"
//                             : isMarkable
//                               ? "Click to mark this number"
//                               : "Wait for this number to be called"}
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               )
//             }),
//           )}
//         </div>

//         <div className="mt-3 sm:mt-4">
//           <Button
//             onClick={handleBingoClaim}
//             disabled={!hasWinningPattern || !connected}
//             className={cn(
//               "w-full font-bold text-sm sm:text-base transition-all duration-300",
//               hasWinningPattern && connected
//                 ? "bg-green-500 hover:bg-green-600 text-white animate-pulse"
//                 : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed",
//             )}
//             size="sm"
//           >
//             {hasWinningPattern ? "CLAIM BINGO!" : "BINGO"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useRoomStore } from "@/lib/stores/room-store"
import { useGameStore } from "@/lib/stores/game-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { CardInfo, BingoColumn } from "@/lib/types"

function transformCardData(card?: Partial<Record<BingoColumn, number[]>>) {
  if (!card) return Array(5).fill(null).map(() => Array(5).fill(0))

  const columns = [BingoColumn.B, BingoColumn.I, BingoColumn.N, BingoColumn.G, BingoColumn.O]

  const grid = Array.from({ length: 5 }, (_, rowIndex) =>
    columns.map((col) => card[col]?.[rowIndex] ?? 0)
  )

  // Free space in the middle
  grid[2][2] = 0
  return grid
}

interface InteractiveBingoCardProps {
  cardInfoId: string
  index: number
}

export function InteractiveBingoCard({ cardInfoId, index }: InteractiveBingoCardProps) {
  const { room, connected } = useRoomStore()
  const {
    game: { drawnNumbers },
    getCurrentCardById,
    addMarkedNumberToCard,
    removeMarkedNumberFromCard,
  } = useGameStore()

  console.log("========================>> Rendering InteractiveBingoCard for cardInfoId:", cardInfoId)

  const [currentCard, setCurrentCard] = useState<CardInfo | null>(null)

  useEffect(() => {
    setCurrentCard(getCurrentCardById(cardInfoId))
  }, [cardInfoId, getCurrentCardById])

  if (!currentCard) return null

  const cardNumbers = transformCardData(currentCard.numbers)
  const COLUMN_HEADERS = ["B", "I", "N", "G", "O"]

  const isNumberDrawn = (num: number) => drawnNumbers.includes(num)
  const isMarked = (num: number) => currentCard?.markedNumbers?.includes(num)

  const handleCellClick = (number: number, row: number, col: number) => {
    const isFree = row === 2 && col === 2
    if (isFree || number === 0) return
    if (!isNumberDrawn(number)) return

    if (isMarked(number)) {
      removeMarkedNumberFromCard(currentCard.cardId, number)
    } else {
      addMarkedNumberToCard(currentCard.cardId, number)
    }
  }


  const handleBingoClaim = () => {
    if (!connected) return
    // ✅ Send claim to backend (validation happens server-side)
    console.log(`Claiming Bingo for card ${currentCard.cardId}`)
    // TODO: integrate with WebSocket or API
  }

  return (
    <div className="border rounded-lg p-3 w-full max-w-xs mx-auto">
      {/* Card Header */}
      <div className="flex items-center justify-center mb-2">
        <Badge variant="outline" className="font-mono text-xs">
          Card #{index + 1}
        </Badge>
        {!connected && (
          <Badge variant="destructive" className="text-xs">
            Offline
          </Badge>
        )}
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {COLUMN_HEADERS.map((letter) => (
          <div
            key={letter}
            className="h-8 flex items-center justify-center font-bold bg-primary text-primary-foreground rounded"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 gap-1">
        {cardNumbers.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const free = rowIndex === 2 && colIndex === 2
            const marked = isMarked(number) || free
            const clickable = connected && !free && isNumberDrawn(number)

            return (
              <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-10 w-full text-sm font-semibold relative",
                        free && "bg-yellow-200 dark:bg-yellow-800 border-yellow-400 cursor-default",
                        marked && !free && "bg-blue-500 text-white border-blue-600",
                        !marked && clickable && "hover:bg-green-100 dark:hover:bg-green-900 border-green-300",
                        !marked && !clickable && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => clickable && handleCellClick(number, rowIndex, colIndex)}
                      disabled={free || !clickable}
                    >
                      {free ? "⭐" : number}
                      {marked && !free && (
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                          ✓
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {free
                      ? "Free space"
                      : marked
                      ? "Marked"
                      : !connected
                      ? "Not connected"
                      : isNumberDrawn(number)
                      ? "Click to mark"
                      : "Not called yet"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })
        )}
      </div>

      {/* Claim Bingo Button */}
      <div className="mt-3">
        <Button
          onClick={handleBingoClaim}
          disabled={!connected}
          className="w-full font-bold text-sm bg-green-500 hover:bg-green-600 text-white"
        >
          CLAIM BINGO
        </Button>
      </div>
    </div>
  )
}

