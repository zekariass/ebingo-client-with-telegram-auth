"use client"

import { useRoomStore } from "@/lib/stores/room-store"
import { Card, CardContent } from "@/components/ui/card"
import { StartGameButton } from "./start-game-button"
import { useGameStore } from "@/lib/stores/game-store"
import { GameStatus, RoomStatus } from "@/lib/types"

export interface GameControlsProps{
  disabled: boolean
}
export function GameControls({disabled}: GameControlsProps) {
  const { game: {userSelectedCards, userSelectedCardsIds, allCardIds, status }} = useGameStore()
  const {room} = useRoomStore()

  const canStartGame = userSelectedCardsIds?.length > 0 && room?.status === RoomStatus.OPEN
  const gameInProgress = status === GameStatus.PLAYING && room?.status === RoomStatus.OPEN

  // const hasWinningCard = userCards.some((card) => (pattern ? checkWinningPattern(card, pattern) : false))

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* {!gameInProgress ? ( */}
          <StartGameButton disabled={!canStartGame || disabled} selectedCards={userSelectedCards?.length} fee={room?.entryFee || 0} />
        {/* ) : (
          <BingoClaimButton disabled={false} hasWinningCard={false} />
        )} */}

        <div className="text-xs text-muted-foreground text-center space-y-1">
          {!gameInProgress ? (
            <>
              <p>Select 1-2 cards to join the game</p>
              <p>Entry fee will be charged when you start</p>
            </>
          ) : (
            <>
              <p>Mark numbers as they are called</p>
              <p>Click BINGO when you complete the pattern</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
