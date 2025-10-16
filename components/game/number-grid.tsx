"use client"

import { useGameStore } from "@/lib/stores/game-store"
import { cn } from "@/lib/utils"

const BINGO_LETTERS = ["B", "I", "N", "G", "O"]

const generateNumberGrid = () => {
  const grid: number[][] = [[], [], [], [], []]

  // B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
  for (let col = 0; col < 5; col++) {
    const start = col * 15 + 1
    const end = start + 14

    for (let num = start; num <= end; num++) {
      grid[col].push(num)
    }
  }

  return grid
}

export function NumberGrid() {
  const {
    game: { drawnNumbers: calledNumbers },
  } = useGameStore()
  const numberGrid = generateNumberGrid()


const colors = ["green", "red", "yellow", "green", "red"]

  return (
    <div className="bg-card rounded-lg border p-2 sm:p-4 w-full">
      <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center text-primary">
        75 Number Grid
      </h2>

      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-3xl">
          {/* Header row: B I N G O */}
          <div className="grid grid-cols-5 gap-0.5 sm:gap-1 mb-3 w-full">
            {BINGO_LETTERS.map((letter, index) => (
              <div
                key={letter}
                className={`h-4 md:h-8 text-primary-foreground flex items-center justify-center rounded-xs font-bold text-xs sm:text-lg shadow-sm bg-${colors[index]}-500`}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Number cells */}
          <div className="grid grid-cols-5 gap-0.5 sm:gap-1 w-full">
            {Array.from({ length: 15 }).map((_, row) =>
              BINGO_LETTERS.map((_, col) => {
                const number = numberGrid[col][row]
                const isCalled = calledNumbers.includes(number)

                return (
                  <div
                    key={number}
                    className={cn(
                      "h-7 md:h-10 flex items-center justify-center rounded-xs text-xs sm:text-sm font-medium border-2 transition-all duration-300",
                      isCalled
                        ? "bg-green-500 text-white border-green-600 shadow-md"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {number}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
