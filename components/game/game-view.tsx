"use client"

import { useEffect, useState } from "react"
import { useRoomStore } from "@/lib/stores/room-store"
import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
import { GameHeader } from "./game-header"
import { NumberGrid } from "./number-grid"
import { GameCards } from "./game-cards"
import { useGameStore } from "@/lib/stores/game-store"
import { Button } from "../ui/button"
import { userStore } from "@/lib/stores/user-store"
import { CountdownTimer } from "../common/countdown-timer"
import { Badge } from "../ui/badge"
import { GameStatus } from "@/lib/types"
import { useRouter } from "next/navigation"
import i18n from "@/i18n"
import { useSystemStore } from "@/lib/stores/system-store"
import { motion } from "framer-motion";

interface GameViewProps {
  roomId: number
}

export function GameView({ roomId }: GameViewProps) {
  const gameId = useGameStore(state => state.game.gameId)
  const selectedCardIds = useGameStore(state => state.game.userSelectedCardsIds)
  // const countdownEndTime = useGameStore(state => state.game.countdownEndTime)
  const status = useGameStore(state => state.game.status)
  const currentDrawnNumber = useGameStore(state => state.game.currentDrawnNumber)
  const voiceOn = useSystemStore(state => state.voiceOn)
  const setLocaleChanged = useSystemStore(state => state.setLocaleChanged)
  const localeChanged = useSystemStore(state => state.localeChanged)

  const telegramId = userStore(state => state.user?.telegramId)
  const { leaveGame, connected } = useWebSocketEvents({ roomId, enabled: true })

  //useAutoRefreshGameState(roomId, 3000);

  const [isLeaving, setLeaving] = useState(false)

  const { room, loading, fetchRoom } = useRoomStore()

  const router = useRouter()


   const playNumberSound = (number: number | undefined) => {
    if (!number) return;
    if (localeChanged){
      setLocaleChanged(false)
      return
    }
    const audio = new Audio(`/audio/${i18n.language}/${number}.mp3`);
    audio.play().catch((err) => console.warn("Audio blocked:", err));
  };


  useEffect(() => {
    if (currentDrawnNumber !== null && currentDrawnNumber !==undefined && status === GameStatus.PLAYING && voiceOn) {
      playNumberSound(currentDrawnNumber);
    }

  }, [currentDrawnNumber, status, voiceOn]);

  // Fetch room data once
  useEffect(() => {
    const init = async () => {
      try {
        await fetchRoom(roomId)
      } catch (err) {
        console.error("Failed to initialize room data:", err)
      }
    }
    init()
  }, [fetchRoom, roomId])

  const handleLeaveGame = async () => {
    if (!gameId || !telegramId) {
      router.replace(`/${i18n.language}`)
      return
    }

    setLeaving(true)
    try {
      await leaveGame(gameId, telegramId.toString())
    } catch (err) {
      console.error("Failed to leave game:", err)
      setLeaving(false)
    }
  }

  if (gameId === null || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading game...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader room={room} connected={connected} />

      <div className="container mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:gap-2">
          <div className="order-1">
            <NumberGrid />
          </div>

          <div className="order-2 sm:order-2">
            <div className="border border-purple-500 rounded-xl h-12 w-full max-w-xs mx-auto bg-yellow-950 p-1">
              <div className="flex items-center justify-center h-full">
                {status === GameStatus.COUNTDOWN ? (
                  <CountdownTimer label="" />
                ) : status === GameStatus.PLAYING ? (
                  <div className="font-mono text-sm px-3 py-1 text-white font-semibold">
                    {currentDrawnNumber ? (
                      <div className="flex flex-col items-center justify-center px-3">
                        <motion.div
                          key={currentDrawnNumber} // re-triggers animation on number change
                          initial={{ scale: 3, opacity: 0 }}
                          animate={{ scale: 1.3, opacity: 1 }}
                          transition={{
                            duration: 2, // slightly faster looks smoother in gameplay
                            ease: "easeOut",
                          }}
                          className="text-xl font-extrabold text-yellow-400 drop-shadow-2xl"
                        >
                          {currentDrawnNumber}
                        </motion.div>
                      </div>
                    ) : (
                      <div className="text-2xl text-yellow-500">__</div>
                    )}
                  </div>
                ) : (
                  <Badge className="font-mono text-sm px-3 py-1 bg-yellow-600 text-black">
                    {"Waiting..."}
                  </Badge>
                )}
              </div>
            </div>


            <GameCards selectedCardIds={selectedCardIds} />
          </div>
        </div>

        <div className="py-2 flex items-center justify-center">
          <Button
            className="w-full sm:w-1/2 bg-red-800 text-white p-4 text-xl hover:bg-red-600 cursor-pointer"
            onClick={handleLeaveGame}
            disabled={isLeaving}
          >
            {!isLeaving ? "Leave Game" : "Leaving..."}
          </Button>
        </div>
      </div>
    </div>
  )
}
