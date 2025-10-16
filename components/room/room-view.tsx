"use client"

import { useEffect } from "react"
import { useRoomStore } from "@/lib/stores/room-store"
import { RoomHeader } from "./room-header"
import { CardSelectionGrid } from "./card-selection-grid"
import { SelectedCardsPanel } from "./selected-cards-panel"
import { NumberCallingArea } from "./number-calling-area"
import { GameControls } from "./game-controls"
import { useGameStore } from "@/lib/stores/game-store"
import { WinnerDialog } from "./winner/winner-dialog"
import { GameStatus } from "@/lib/types"
import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
import { userStore } from "@/lib/stores/user-store"
import { usePaymentStore } from "@/lib/stores/payment-store"

interface RoomViewProps {
  roomId: number
}

export function RoomView({ roomId }: RoomViewProps) {
  const { room, loading, fetchRoom, resetRoom } = useRoomStore()
  const {game: {userSelectedCardsIds, countdownEndTime, status}} = useGameStore()
  const winner = useGameStore(state => state.winner)
  const resetWinner = useGameStore(state => state.resetWinner)
  const {enterRoom} = useWebSocketEvents({roomId, enabled: true})
  const fetchUserProfile = userStore(state => state.fetchUserProfile)
  const {fetchWallet} = usePaymentStore()


  const targetTime = new Date(countdownEndTime).getTime()
  const now = Date.now()
  const timeLeft = Math.max(Math.ceil((targetTime - now) / 1000), 0)
  const disableCardSelection = (timeLeft < 10 && timeLeft > 0) || (status === GameStatus.PLAYING)

  const onGameWinnerClose = () => {
    resetWinner()
  }

  useEffect(() => {
    resetRoom()
    fetchRoom(roomId)
  }, [roomId, fetchRoom])

  useEffect(() => {
  const init = async () => {
    try {
      await enterRoom()
      await Promise.all([
        fetchUserProfile(),
        fetchWallet(true),
      ])
    } catch (err) {
      console.error("Failed to initialize room/payment data:", err)
    }
  }

  init()
}, [])


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading room...</div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background">
      <RoomHeader room={room} />
      {winner.playerName && <WinnerDialog showResult={!!winner.playerName} winner={winner} onClose={onGameWinnerClose} />}

      <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Left Column - Card Selection */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            <CardSelectionGrid roomId={roomId} capacity={room?.capacity ?? 0} disabled={disableCardSelection}/>

            {userSelectedCardsIds.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <SelectedCardsPanel />
                <GameControls disabled={disableCardSelection}/>
              </div>
            )}
          </div>

          {/* Right Column - Game Info */}
          {/* <div className="space-y-3 sm:space-y-6">
            <NumberCallingArea />
          </div> */}
        </div>
      </main>
    </div>
  )
}
