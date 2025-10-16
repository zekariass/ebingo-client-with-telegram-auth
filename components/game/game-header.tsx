"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Room } from "@/lib/types"
import { useGameStore } from "@/lib/stores/game-store"
import { useRoomStore } from "@/lib/stores/room-store"

interface GameHeaderProps {
  room: Room | undefined | null
  connected: boolean
}

export function GameHeader({ room, connected }: GameHeaderProps) {
  const router = useRouter()
  const game = useGameStore(state => state.game)
  const currentRoom = useRoomStore(state => state.room)

  return (
    <header className="bg-card border-b px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold text-sm sm:text-base">{room.name}</h1>
            <p className="text-xs text-muted-foreground">
              ${room.entryFee} • {room.status}
            </p>
          </div>
        </div> */}
        <div className="flex flex-row">
          {[1, 2, 3, 4].map((item) => {
            if (item === 1)
              return (
                <div key={item} className="mr-1 px-2 bg-blue-600 rounded-xs">
                  <div className="text-center">Game Id</div>
                  <div className="text-center"># {game.gameId}</div>
                </div>
              );

            if (item === 2)
              return (
                <div key={item} className="mr-1 px-2 bg-red-600 rounded-xs">
                  <div className="text-center">Bet</div>
                  <div className="text-center">Br {currentRoom?.entryFee}</div>
                </div>
              );

            if (item === 3)
              return (
                <div key={item} className="mr-1 px-2 bg-green-600 rounded-xs">
                  <div className="text-center">Prize</div>
                  <div className="text-center">
                    Br {room ? game.userSelectedCards.length * room?.entryFee * 0.75: 0}
                  </div>
                </div>
              );

            if (item === 4)
              return (
                <div key={item} className="mr-1 px-2 bg-yellow-600 rounded-xs">
                  <div className="text-center">Players</div>
                  <div className="text-center">{game.joinedPlayers.length}</div>
                </div>
              );

            return null;
          })}
        </div>



        <div className="flex items-center gap-2 bg-white rounded-xs m-1 p-2">
          {connected ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Disconnected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
