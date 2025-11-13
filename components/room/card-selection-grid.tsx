// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { useGameStore } from "@/lib/stores/game-store"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight, Info, RefreshCcw, RefreshCwIcon } from "lucide-react"
// import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
// import { userStore } from "@/lib/stores/user-store"
// import { useRouter } from "next/navigation"
// import { GameStatus } from "@/lib/types"
// import { CountdownTimer } from "../common/countdown-timer"

// interface CardSelectionGridProps {
//   roomId: number
//   capacity: number
//   disabled: boolean
// }

// export function CardSelectionGrid({ roomId, capacity, disabled }: CardSelectionGridProps) {

//   const userSelectedCardsIds = useGameStore(state => state.game.userSelectedCardsIds)
//   const allSelectedCardsIds = useGameStore(state => state.game.allSelectedCardsIds)
//   const allCardIds = useGameStore(state => state.game.allCardIds)
//   // const gameId = useGameStore(state => state.game.gameId)
//   const status = useGameStore(state => state.game.status)
//   const joinedPlayers = useGameStore(state => state.game.joinedPlayers)
//   const selectCardOptimistically  = useGameStore(state => state.selectCard)
//   const deselectCardOptimistically  = useGameStore(state => state.releaseCard)

//   const {enterRoom, connected} =  useWebSocketEvents({roomId: roomId, enabled: true});

//   const user = userStore(state => state.user)

//   const takenCards = new Set(allSelectedCardsIds)
//   const maxCards = 2

//   const [currentPage, setCurrentPage] = useState(1)
//   const cardsPerPage = 100
//   const totalCards = allCardIds?.length || 0
//   const totalPages = Math.ceil(totalCards / cardsPerPage)


//   const [rotating, setRotating] = useState(false)

//   const handleRefreshClick = () => {
//     setRotating(true)
//     handleRefresh?.()
//     // Stop rotation after 1 second
//     setTimeout(() => setRotating(false), 1000)
//   }

//   useEffect(() => {
//       enterRoom();
//   }, [enterRoom, connected]);

//   // Slice the cards for the current page
//   const paginatedCards = useMemo(() => {
//     const startIndex = (currentPage - 1) * cardsPerPage
//     const endIndex = Math.min(startIndex + cardsPerPage, totalCards)
//     return allCardIds.slice(startIndex, endIndex)
//   }, [allCardIds, currentPage, cardsPerPage, totalCards])

//   // const handleCardClick = (cardId: string) => {

//   //   if (userSelectedCardsIds.includes(cardId) && user?.telegramId) {
//   //     releaseCardBackend(gameId, cardId)
//   //   } else if (!takenCards.has(cardId) && userSelectedCardsIds.length < maxCards && user?.telegramId) {
//   //     selectCardBackend(gameId, cardId)
//   //   }
//   // }

//   const handleCardClick = (cardId: string) => {
//     if (userSelectedCardsIds.includes(cardId) && user?.telegramId) {
//       // releaseCardBackend(gameId, cardId)
//       deselectCardOptimistically(cardId)
//     } else if (!takenCards.has(cardId) && userSelectedCardsIds.length < maxCards && user?.telegramId) {
//       // selectCardBackend(gameId, cardId)
//       selectCardOptimistically(cardId, user.telegramId)
//     }
//   }

//   const getCardStatus = (cardId: string) => {
//     if (userSelectedCardsIds.includes(cardId)) return "selected"
//     if (takenCards.has(cardId)) return "taken"
//     return "available"
//   }


//   const handleRefresh = () => {
//       enterRoom();
//   }


//   useEffect(() => {
//   // Run this only when component mounts or when `paginatedCards` updates
//   if (paginatedCards.length === 0) {
//     const timeout = setTimeout(() => {
//       handleRefresh()
//     }, 1000) // 1 seconds

//     // Cleanup if the component unmounts early
//     return () => clearTimeout(timeout)
//   }
// }, [paginatedCards, handleRefresh])

  

//   return (
//     <Card>
//       <CardHeader className="">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
//           <div className="flex flex-row sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
//             {/* <Badge variant="destructive" className="w-fit">
//               {userSelectedCardsIds.length}/{maxCards} selected
//             </Badge> */}
//             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
//               <div className="flex items-center gap-1">
//                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
//                 <span className="text-muted-foreground text-xs">Available</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full" />
//                 <span className="text-muted-foreground text-xs">Selected</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-2 h-2 sm:w-3 sm:h-3 border-red-300 bg-red-300 dark:bg-red-950 rounded-full" />
//                 <span className="text-muted-foreground text-xs">Taken</span>
//               </div>
//               <div className="">
//                 {joinedPlayers.length > 5 && <p className="text-xs text-blue-500">
//                    | Active: {joinedPlayers.length} Players
//                 </p>}
//               </div>
//               {status === GameStatus.COUNTDOWN ? (
//                   <div className="flex items-center gap-1">
//                     <div className="sm:w-3 sm:h-3 border-red-300 bg-red-300 dark:bg-red-950 rounded-full">
//                       <CountdownTimer gamePage={false} />
//                     </div>
//                   </div>
//                 ) : status === GameStatus.PLAYING ? (
//                   <div>
//                     <h3 className="text-red-500 text-center">Game In Progress...</h3>
//                   </div>
//                 ) : (
//                   ""
//                 )}
//             </div>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="p-1 sm:p-1">
//         {/* {totalPages > 1 && (
//           <div className="mb-3 text-xs text-muted-foreground text-center">
//             Showing cards {(currentPage - 1) * cardsPerPage + 1} –{" "}
//             {Math.min(currentPage * cardsPerPage, totalCards)} of {totalCards}
//           </div>
//         )} */}

//         <div className="grid grid-cols-10 xs:grid-cols-10 sm:grid-cols-10 md:grid-cols-20 lg:grid-cols-20 xl:grid-cols-20 gap-0.5 sm:gap-0.5 max-h-[60vh] overflow-y-auto ">
//           {paginatedCards.map((cardId, index) => {
//             const status = getCardStatus(cardId)
//             const absoluteIndex = (currentPage - 1) * cardsPerPage + index + 1

//             return (
//               <Button
//                 key={cardId}
//                 variant="outline"
//                 className={`
//                   aspect-square w-full relative transition-all duration-200 text-[14px] xs:text-xs font-semibold h-6 xs:h-7 sm:h-8 min-h-0 p-0 rounded-xs cursor-pointer
//                   ${
//                     status === "selected"
//                       ? "border-blue-500 bg-blue-50 dark:bg-blue-950 ring-1 sm:ring-2 ring-blue-500 text-blue-700 dark:text-blue-300"
//                       : status === "taken"
//                       ? "border-2 border-red-950 bg-red-500 dark:bg-red-500 cursor-not-allowed opacity-50 text-white"
//                       : "border-green-500 bg-green-50 dark:bg-green-900 text-white-700 dark:text-white-900 hover:bg-green-100 dark:hover:bg-green-950"
//                   }
//                   ${userSelectedCardsIds.length >= maxCards && status === "available" ? "opacity-50" : ""}
//                 `}
//                 onClick={() => handleCardClick(cardId)}
//                 disabled={(!userSelectedCardsIds.includes(cardId) && (status === "taken" || (userSelectedCardsIds.length >= maxCards && status === "available"))) || disabled}
//               >
//                 {absoluteIndex}
//                 {status === "selected" && (
//                   <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex items-center justify-center">
//                     <span className="text-white text-[8px] sm:text-[10px]">✓</span>
//                   </div>
//                 )}
//               </Button>
//             )
//           })}
         
//         </div>
//             {!paginatedCards.length && (
//               <div className="flex flex-col items-center justify-center py-6">
//                 <RefreshCwIcon
//                   onClick={handleRefreshClick}
//                   size={48} // bigger icon
//                   className={`cursor-pointer text-green-700 transition-transform duration-700 ${
//                     rotating ? "rotate-[360deg]" : ""
//                   }`}
//                 />
//                 <p className="text-center text-green-700 mt-2 text-sm sm:text-base">
//                   Refresh to see cards
//                 </p>
//               </div>
//             )}
          

//         {/* {userSelectedCardsIds.length >= maxCards && (
//           <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-800 rounded-lg flex flex-row">
//             <Info size="16"></Info>
//             <p className="text-xs sm:text-sm text-white ms-1">
//               Max {maxCards} cards selected. To choose another deselect one.
//             </p>
//           </div>
//         )} */}

//         {totalPages > 1 && (
//           <div className="flex items-center gap-2 justify-end mt-1">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
//             </Button>
//             <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//             >
//               <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useEffect, useMemo, useState } from "react"
import { useGameStore } from "@/lib/stores/game-store"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Info, RefreshCcw, RefreshCwIcon } from "lucide-react"
import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
import { userStore } from "@/lib/stores/user-store"
import { useRouter } from "next/navigation"
import { GameStatus } from "@/lib/types"
import { CountdownTimer } from "../common/countdown-timer"

interface CardSelectionGridProps {
  roomId: number
  capacity: number
  disabled: boolean
}

export function CardSelectionGrid({ roomId, capacity, disabled }: CardSelectionGridProps) {

  const userSelectedCardsIds = useGameStore(state => state.game.userSelectedCardsIds)
  const allSelectedCardsIds = useGameStore(state => state.game.allSelectedCardsIds)
  const allCardIds = useGameStore(state => state.game.allCardIds)
  const countdownDuration = useGameStore(state => state.game.countdownDurationSeconds)
  // const gameId = useGameStore(state => state.game.gameId)
  const status = useGameStore(state => state.game.status)
  const joinedPlayers = useGameStore(state => state.game.joinedPlayers)
  const selectCardOptimistically  = useGameStore(state => state.selectCardOptimistically)
  const deselectCardOptimistically  = useGameStore(state => state.releaseCardOptimistically)

  const {enterRoom, connected} =  useWebSocketEvents({roomId: roomId, enabled: true});

  const user = userStore(state => state.user)

  const takenCards = new Set(allSelectedCardsIds)
  const maxCards = 2

  const [currentPage, setCurrentPage] = useState(1)
  const cardsPerPage = 100
  const totalCards = allCardIds?.length || 0
  const totalPages = Math.ceil(totalCards / cardsPerPage)
  const joinNotAllowed = countdownDuration > 0 && countdownDuration < 10


  const [rotating, setRotating] = useState(false)

  const handleRefreshClick = () => {
    setRotating(true)
    handleRefresh?.()
    // Stop rotation after 1 second
    setTimeout(() => setRotating(false), 1000)
  }

  useEffect(() => {
      enterRoom();
  }, [enterRoom, connected]);

  // Slice the cards for the current page
  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * cardsPerPage
    const endIndex = Math.min(startIndex + cardsPerPage, totalCards)
    return allCardIds.slice(startIndex, endIndex)
  }, [allCardIds, currentPage, cardsPerPage, totalCards])

  // const handleCardClick = (cardId: string) => {

  //   if (userSelectedCardsIds.includes(cardId) && user?.telegramId) {
  //     releaseCardBackend(gameId, cardId)
  //   } else if (!takenCards.has(cardId) && userSelectedCardsIds.length < maxCards && user?.telegramId) {
  //     selectCardBackend(gameId, cardId)
  //   }
  // }

  const handleCardClick = (cardId: string) => {
    if (userSelectedCardsIds.includes(cardId) && user?.telegramId) {
      // releaseCardBackend(gameId, cardId)
      deselectCardOptimistically(cardId)
    } else if (!takenCards.has(cardId) && userSelectedCardsIds.length < maxCards && user?.telegramId) {
      // selectCardBackend(gameId, cardId)
      selectCardOptimistically(cardId)
    }
  }

  const getCardStatus = (cardId: string) => {
    if (userSelectedCardsIds.includes(cardId)) return "selected"
    if (takenCards.has(cardId)) return "taken"
    return "available"
  }


  const handleRefresh = () => {
      enterRoom();
  }


  useEffect(() => {
  // Run this only when component mounts or when `paginatedCards` updates
  if (paginatedCards.length === 0) {
    const timeout = setTimeout(() => {
      handleRefresh()
    }, 1000) // 1 seconds

    // Cleanup if the component unmounts early
    return () => clearTimeout(timeout)
  }
}, [paginatedCards, handleRefresh])

  

  return (
    <Card>
      <CardHeader className="">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex flex-row sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            {/* <Badge variant="destructive" className="w-fit">
              {userSelectedCardsIds.length}/{maxCards} selected
            </Badge> */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                <span className="text-muted-foreground text-xs">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full" />
                <span className="text-muted-foreground text-xs">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 border-red-300 bg-red-300 dark:bg-red-950 rounded-full" />
                <span className="text-muted-foreground text-xs">Taken</span>
              </div>
              <div className="">
                {joinedPlayers.length > 5 && <p className="text-xs text-blue-500">
                   | Active: {joinedPlayers.length} Players
                </p>}
              </div>
              {status === GameStatus.COUNTDOWN ? (
                  <div className="flex items-center gap-1">
                    <div className="sm:w-3 sm:h-3 border-red-300 bg-red-300 dark:bg-red-950 rounded-full">
                      <CountdownTimer gamePage={false} />
                    </div>
                  </div>
                ) : status === GameStatus.PLAYING ? (
                  <div>
                    <h3 className="text-red-500 text-center">Game In Progress...</h3>
                  </div>
                ) : (
                  ""
                )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-1 sm:p-1">
        {/* {totalPages > 1 && (
          <div className="mb-3 text-xs text-muted-foreground text-center">
            Showing cards {(currentPage - 1) * cardsPerPage + 1} –{" "}
            {Math.min(currentPage * cardsPerPage, totalCards)} of {totalCards}
          </div>
        )} */}

        <div className="grid grid-cols-10 xs:grid-cols-10 sm:grid-cols-10 md:grid-cols-20 lg:grid-cols-20 xl:grid-cols-20 gap-0.5 sm:gap-0.5 max-h-[60vh] overflow-y-auto ">
          {paginatedCards.map((cardId, index) => {
            const status = getCardStatus(cardId)
            const absoluteIndex = (currentPage - 1) * cardsPerPage + index + 1

            return (
              <Button
                key={cardId}
                variant="outline"
                className={`
                  aspect-square w-full relative transition-all duration-200 text-[14px] xs:text-xs font-semibold h-6 xs:h-7 sm:h-8 min-h-0 p-0 rounded-xs cursor-pointer
                  ${
                    status === "selected"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 ring-1 sm:ring-2 ring-blue-500 text-blue-700 dark:text-blue-300"
                      : status === "taken"
                      ? "border-2 border-red-950 bg-red-500 dark:bg-red-500 cursor-not-allowed opacity-50 text-white"
                      : "border-green-500 bg-green-50 dark:bg-green-900 text-white-700 dark:text-white-900 hover:bg-green-100 dark:hover:bg-green-950"
                  }
                  ${userSelectedCardsIds.length >= maxCards && status === "available" ? "opacity-50" : ""}
                `}
                onClick={() => handleCardClick(cardId)}
                disabled={(!userSelectedCardsIds.includes(cardId) && (status === "taken" || (userSelectedCardsIds.length >= maxCards && status === "available"))) || disabled || joinNotAllowed}
              >
                {absoluteIndex}
                {status === "selected" && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] sm:text-[10px]">✓</span>
                  </div>
                )}
              </Button>
            )
          })}
         
        </div>
            {!paginatedCards.length && (
              <div className="flex flex-col items-center justify-center py-6">
                <RefreshCwIcon
                  onClick={handleRefreshClick}
                  size={48} // bigger icon
                  className={`cursor-pointer text-green-700 transition-transform duration-700 ${
                    rotating ? "rotate-[360deg]" : ""
                  }`}
                />
                <p className="text-center text-green-700 mt-2 text-sm sm:text-base">
                  Refresh to see cards
                </p>
              </div>
            )}
          

        {/* {userSelectedCardsIds.length >= maxCards && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-800 rounded-lg flex flex-row">
            <Info size="16"></Info>
            <p className="text-xs sm:text-sm text-white ms-1">
              Max {maxCards} cards selected. To choose another deselect one.
            </p>
          </div>
        )} */}

        {totalPages > 1 && (
          <div className="flex items-center gap-2 justify-end mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}