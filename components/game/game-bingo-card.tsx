// "use client"

// import { useEffect } from "react"
// import { useRoomStore } from "@/lib/stores/room-store"
// import { useGameStore } from "@/lib/stores/game-store"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { BingoColumn, GamePattern, BingoClaimRequestPayloadType } from "@/lib/types"
// import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
// import { userStore } from "@/lib/stores/user-store"

// const COLUMN_HEADERS = ["B", "I", "N", "G", "O"]

// // Utility: normalize card into 5x5 grid
// function transformCardData(card?: Partial<Record<BingoColumn, number[]>>) {
//   const columns = [BingoColumn.B, BingoColumn.I, BingoColumn.N, BingoColumn.G, BingoColumn.O]

//   if (!card) {
//     return Array.from({ length: 5 }, () => Array(5).fill(0))
//   }

//   const grid = Array.from({ length: 5 }, (_, row) =>
//     columns.map((col) => card[col]?.[row] ?? 0)
//   )

//   // Free space center
//   grid[2][2] = 0
//   return grid
// }

// interface SelectedCardsViewProps {
//   cardInfoId: string
//   index: number
// }

// export function GameBingoCard({ cardInfoId, index }: SelectedCardsViewProps) {
//   const { room, connected } = useRoomStore()
//   const {
//     game: { gameId, drawnNumbers, roomId, started}, claimError, claiming,
//     addMarkedNumberToCard,
//     removeMarkedNumberFromCard,
//     resetClaimError
//   } = useGameStore()


//   // const {user} = userStore()

//   const {markNumber: markNumberInBackend, 
//         unmarkNumber: unMarkNumberInBackend, 
//         claimBingo} = useWebSocketEvents({roomId, enabled: true})

//   // ✅ Subscribe directly so it re-renders when card changes
//   const currentCard = useGameStore((state) =>
//     state.game.userSelectedCards?.find((card) => card.cardId === cardInfoId)
//   )

//   const userId = userStore(state => state.user?.supabaseId)
//   const userName = userStore(state => state.user?.firstName + ' ' + state.user?.lastName)

//   if (!currentCard) return null

//   const cardNumbers = transformCardData(currentCard.numbers)

//   const isNumberDrawn = (num: number) => drawnNumbers.includes(num)
//   const isMarked = (num: number) => currentCard.marked?.includes(num)

//   const handleCellClick = (num: number, row: number, col: number) => {
//     const free = row === 2 && col === 2
//     if (free || num === 0) return
//     if (!isNumberDrawn(num)) return

//     if (isMarked(num)) {
//       removeMarkedNumberFromCard(currentCard.cardId, num)
//       unMarkNumberInBackend(gameId, cardInfoId, num)
//     } else {
//       addMarkedNumberToCard(currentCard.cardId, num)
//       markNumberInBackend(gameId, cardInfoId, num)
//     }
//   }


//   useEffect(()=>{
//   // console.log("=============USER===========>>: ", user?.supabaseId)

//   },[])


//   useEffect(()=>{

//     const timer = setTimeout(()=>{
//       resetClaimError()
//     }, 5000)

//     return () => clearTimeout(timer)

//   }, [claimError])


//   const claimPayload: BingoClaimRequestPayloadType = {
//         gameId: gameId,
//         cardId: cardInfoId,
//         pattern: room?.pattern ?? GamePattern.LINE_AND_CORNERS,
//         playerId: userId ?? "" ,
//         playerName: userName,
//         markedNumbers: currentCard.marked ?? []
//     }

//   const handleBingoClaim = () => {
//     if (!connected) return
//     claimBingo(claimPayload)
//   }

//   return (
//     <div className="border rounded-lg p-1 w-full max-w-xs mx-auto">
//       {/* Header */}
//       <div className="mb-2">
//         <div className="flex items-center justify-center gap-2">
//           <Badge variant="outline" className="font-mono text-xs">
//             Card #{index + 1}
//           </Badge>
//           {/* {!connected && (
//             <Badge variant="destructive" className="text-xs">
//               Offline
//             </Badge>
//           )} */}
//         </div>

//         {claimError && cardInfoId === claimError?.cardId && (
//           <div className="text-center text-xs text-red-500 mt-1">
//             {claimError?.message}
//           </div>
//         )}
//       </div>


//       {/* Column headers */}
//       <div className="grid grid-cols-5 gap-0.5 mb-2">
//         {COLUMN_HEADERS.map((letter) => (
//           <div
//             key={letter}
//             className="h-4 md:h-8 flex items-center justify-center font-bold bg-primary text-primary-foreground rounded"
//           >
//             {letter}
//           </div>
//         ))}
//       </div>

//       {/* Numbers */}
//       <div className="grid grid-cols-5 gap-0.5">
//         {cardNumbers.map((row, rowIndex) =>
//           row.map((num, colIndex) => {
//             const free = rowIndex === 2 && colIndex === 2
//             const marked = isMarked(num) || free
//             const clickable = connected && !free && isNumberDrawn(num)

//             // console.log(`=========================>>>${num} IS MARKED =========>>: `, marked)

//             return (
//               <Button
//                 key={`${rowIndex}-${colIndex}`}
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handleCellClick(num, rowIndex, colIndex)}
//                 disabled={!clickable}
//                 className={`
//                     h-6 md:h-10 w-full text-xs sm:text-sm font-semibold relative rounded-xs cursor-pointer
//                     ${free ? "bg-yellow-200 dark:bg-yellow-800 border-yellow-400 cursor-default" : ""}
//                     ${!marked && clickable ? "bg-green-300 hover:bg-green-300 dark:hover:bg-green-900 border-green-300" : ""}
//                     ${!marked && !clickable ? "opacity-50 cursor-not-allowed" : ""}
//                     ${marked && !free ? "!bg-violet-950 !text-white !border-blue-600" : ""}
//                   `}
//               >
//                 {free ? "⭐" : num}
//               </Button>
//             )
//           })
//         )}
//       </div>
//       {/* Claim button */}
//        <div className="mt-3">
//          <Button
//           onClick={handleBingoClaim}
//           disabled={!connected || !started}
//           className="h-8 w-full font-bold text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white cursor-pointer"
//         >
//           {!claiming? `Claim Bingo`: "Claiming..." }
//         </Button>
//       </div>
//     </div>
//   )
// }




"use client"

import { useEffect } from "react"
import { useRoomStore } from "@/lib/stores/room-store"
import { useGameStore } from "@/lib/stores/game-store"
import { Button } from "@/components/ui/button"
import { BingoColumn, GamePattern, BingoClaimRequestPayloadType } from "@/lib/types"
import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
import { userStore } from "@/lib/stores/user-store"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

const COLUMN_HEADERS = ["B", "I", "N", "G", "O"]

// Utility: normalize card into 5x5 grid
function transformCardData(card?: Partial<Record<BingoColumn, number[]>>) {
  const columns = [BingoColumn.B, BingoColumn.I, BingoColumn.N, BingoColumn.G, BingoColumn.O]

  if (!card) {
    return Array.from({ length: 5 }, () => Array(5).fill(0))
  }

  const grid = Array.from({ length: 5 }, (_, row) =>
    columns.map((col) => card[col]?.[row] ?? 0)
  )

  // Force free space in the middle
  grid[2][2] = 0
  return grid
}

interface GameBingoCardProps {
  cardInfoId: string
  index: number
}

export function GameBingoCard({ cardInfoId, index }: GameBingoCardProps) {
  const { room, connected: isConnected } = useRoomStore()
  const {
    game: { gameId, drawnNumbers, roomId, started },
    claimError,
    claiming,
    addMarkedNumberToCard,
    removeMarkedNumberFromCard,
    resetClaimError
  } = useGameStore()

  const { markNumber: markNumberInBackend, unmarkNumber: unMarkNumberInBackend, claimBingo } =
    useWebSocketEvents({ roomId, enabled: true })

  const currentCard = useGameStore((state) =>
    state.game.userSelectedCards?.find((card) => card.cardId === cardInfoId)
  )

  const userId = userStore((state) => state.user?.telegramId)
  const userDbId = userStore((state) => state.user?.id)
  const userName = userStore(
    (state) => `${state.user?.firstName ?? ""} ${state.user?.lastName ?? ""}`.trim()
  )

  if (!currentCard) return null

  const cardNumbers = transformCardData(currentCard.numbers)

  const isNumberDrawn = (num: number) => drawnNumbers.includes(num)
  const isMarked = (num: number) => currentCard.marked?.includes(num)

  const handleCellClick = (num: number, row: number, col: number) => {
    const free = row === 2 && col === 2
    if (free || num === 0) return
    if (!isNumberDrawn(num)) return

    if (isMarked(num)) {
      removeMarkedNumberFromCard(currentCard.cardId, num)
      unMarkNumberInBackend(gameId, cardInfoId, num)
    } else {
      addMarkedNumberToCard(currentCard.cardId, num)
      markNumberInBackend(gameId, cardInfoId, num)
    }
  }

  // Auto clear claim error after 5s
  useEffect(() => {
    if (!claimError) return
    const timer = setTimeout(() => resetClaimError(), 5000)
    return () => clearTimeout(timer)
  }, [claimError, resetClaimError])

  const claimPayload: BingoClaimRequestPayloadType = {
    gameId,
    cardId: cardInfoId,
    pattern: room?.pattern ?? GamePattern.LINE_AND_CORNERS,
    playerId: userId?.toString() ?? "",
    userProfileId: userDbId, 
    playerName: userName,
    markedNumbers: currentCard.marked ?? []
  }

  const handleBingoClaim = () => {
    if (!isConnected || !started || !userId) return
    claimBingo(claimPayload)
  }

  const colors = ["green", "red", "yellow", "green", "red"]

  return (
    <div className="border rounded-lg p-1 w-full max-w-xs mx-auto">
      {/* Header */}
      <div className="mb-2">
        {/* <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            Card #{index + 1}
          </Badge>
        </div> */}
        {claimError && cardInfoId === claimError?.cardId && (
          <div className="text-center text-xs text-red-500 mt-1">
            {claimError?.message}
          </div>
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-5 gap-0.5 mb-2">
        {COLUMN_HEADERS.map((letter, index) => (
          <div
            key={letter}
            className={`h-4 md:h-8 flex items-center justify-center font-bold text-primary-foreground rounded bg-${colors[index]}-600`}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Card numbers */}
      <div className="grid grid-cols-5 gap-0.5">
        {cardNumbers.map((row, rowIndex) =>
          row.map((num, colIndex) => {
            const free = rowIndex === 2 && colIndex === 2
            const marked = isMarked(num) || free
            const clickable = isConnected && !free && isNumberDrawn(num)

            return (
              <Button
                key={`${rowIndex}-${colIndex}`}
                // variant="outline"
                size="sm"
                disabled={free || !clickable}
                onClick={!free ? () => handleCellClick(num, rowIndex, colIndex) : undefined}
                className={cn(
                  "h-6 md:h-10 w-full text-xs sm:text-sm font-semibold relative rounded-xs text-white",
                  free && "bg-yellow-500 border-yellow-400 cursor-default",
                  !marked && clickable && "bg-green-500 border-green-300",
                  !marked && !clickable && "opacity-50 cursor-not-allowed",
                  marked && !free && "!bg-violet-950 border-2 border-white-600"
                )}
              >
                {/* {free ? "⭐" : num} */}
                {free ? <Star fill="currentColor" strokeWidth="0" className="text-white" /> : num}

              </Button>
            )
          })
        )}
      </div>

      {/* Claim button */}
      <div className="mt-3">
        <Button
          onClick={handleBingoClaim}
          disabled={!isConnected || !started || !userId}
          className="h-8 w-full font-bold text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        >
          {!claiming ? "Claim Bingo" : "Claiming..."}
        </Button>
      </div>
    </div>
  )
}
