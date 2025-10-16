"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectedCardsView } from "./selected-cards-view"
import { useGameStore } from "@/lib/stores/game-store"
import { useEffect } from "react"

export function SelectedCardsPanel() {
  const { game: {userSelectedCards, userSelectedCardsIds}, computePlayerCardsFromPlayerCardsIds } = useGameStore()

  useEffect(() => {
    computePlayerCardsFromPlayerCardsIds()
  }, [computePlayerCardsFromPlayerCardsIds, userSelectedCardsIds])

  if (userSelectedCards?.length === 0) {
    return null
  }

  return (
    <Card className="p-0">
      {/* <CardHeader>
        <CardTitle className="text-base sm:text-lg pt-2">Your Selected Cards ({userSelectedCards?.length}/2)</CardTitle>
      </CardHeader> */}
      <CardContent className="p-2 sm:p-4">
        <div
          className={`grid gap-1 sm:gap-2 md:gap-4 w-full ${userSelectedCards?.length === 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"
            }`}
        >
          {userSelectedCards?.map((cardInfo, index) => (
            <div key={cardInfo.cardId} className="w-full">
              <SelectedCardsView cardInfoId={cardInfo.cardId} index={index} />
            </div>
          ))}
          {userSelectedCards?.length === 1 && (
            <div className="w-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg min-h-[200px] sm:min-h-[250px] md:min-h-[300px] hidden sm:flex">
              <p className="text-muted-foreground text-xs sm:text-sm text-center px-2">
                Select a second card to play with
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
