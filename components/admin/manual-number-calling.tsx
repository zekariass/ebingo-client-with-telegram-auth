"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SelectItem } from "@/components/ui/select"
import { Volume2, VolumeX, RotateCcw } from "lucide-react"
import { InputField, SelectField } from "@/components/ui/form-fields"
import { numberCallSchema, type NumberCallFormData } from "@/lib/schemas/admin-schemas"

interface Game {
  id: string
  roomName: string
  status: string
  numbersCalledCount: number
  calledNumbers?: string
}

export function ManualNumberCalling() {
  const [selectedGame, setSelectedGame] = useState<string>("")
  const [games, setGames] = useState<Game[]>([])
  const [calledNumbers, setCalledNumbers] = useState<number[]>([])
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NumberCallFormData>({
    resolver: zodResolver(numberCallSchema),
    defaultValues: {
      number: 1,
    },
  })

  // Load active games
  useEffect(() => {
    loadGames()
  }, [])

  // Load called numbers when game is selected
  useEffect(() => {
    if (selectedGame) {
      loadCalledNumbers()
    }
  }, [selectedGame])

  const loadGames = async () => {
    try {
      const response = await fetch("/api/admin/games")
      const result = await response.json()
      if (result.success) {
        setGames(result.data.filter((game: Game) => game.status === "playing"))
      }
    } catch (error) {
      console.error("Failed to load games:", error)
    }
  }

  const loadCalledNumbers = async () => {
    const game = games.find((g) => g.id === selectedGame)
    if (game?.calledNumbers) {
      try {
        const numbers = JSON.parse(game.calledNumbers)
        setCalledNumbers(numbers)
      } catch (error) {
        setCalledNumbers([])
      }
    } else {
      setCalledNumbers([])
    }
  }

  const callNumber = async (number: number) => {
    if (!selectedGame) {
      console.log("Error: Please select a game first")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/games/${selectedGame}/call-number`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number }),
      })

      const result = await response.json()

      if (result.success) {
        setCalledNumbers((prev) => [...prev, number])
        reset()

        // Voice announcement
        if (isVoiceEnabled && "speechSynthesis" in window) {
          const letter = getBingoLetter(number)
          const utterance = new SpeechSynthesisUtterance(`${letter} ${number}`)
          utterance.rate = 0.8
          utterance.volume = 0.8
          speechSynthesis.speak(utterance)
        }

        console.log("Number Called:", `${getBingoLetter(number)} ${number} has been called`)
      } else {
        console.log("Error:", result.error)
      }
    } catch (error) {
      console.log("Error: Failed to call number")
    } finally {
      setIsLoading(false)
    }
  }

  const getBingoLetter = (number: number): string => {
    if (number >= 1 && number <= 15) return "B"
    if (number >= 16 && number <= 30) return "I"
    if (number >= 31 && number <= 45) return "N"
    if (number >= 46 && number <= 60) return "G"
    if (number >= 61 && number <= 75) return "O"
    return ""
  }

  const onSubmit = async (data: NumberCallFormData) => {
    await callNumber(data.number)
  }

  const generateRandomNumber = () => {
    const availableNumbers = []
    for (let i = 1; i <= 75; i++) {
      if (!calledNumbers.includes(i)) {
        availableNumbers.push(i)
      }
    }

    if (availableNumbers.length > 0) {
      const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
      callNumber(randomNumber)
    } else {
      console.log("All Numbers Called: All numbers have been called for this game")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manual Number Calling</h2>
          <p className="text-muted-foreground">Call numbers manually for active games</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}>
            {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={loadGames}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Game Selection & Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Game Controls</CardTitle>
            <CardDescription>Select a game and call numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SelectField
              label="Select Game"
              value={selectedGame}
              onValueChange={setSelectedGame}
              placeholder="Choose an active game"
            >
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.roomName} ({game.numbersCalledCount} called)
                </SelectItem>
              ))}
            </SelectField>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <InputField
                    label="Manual Number Entry"
                    type="number"
                    min="1"
                    max="75"
                    placeholder="Enter 1-75"
                    {...register("number", { valueAsNumber: true })}
                    error={errors.number?.message}
                  />
                </div>
                <Button type="submit" disabled={!selectedGame || isSubmitting || isLoading} className="mt-8">
                  {isSubmitting ? "Calling..." : "Call"}
                </Button>
              </div>
            </form>

            <Button onClick={generateRandomNumber} disabled={!selectedGame || isLoading} className="w-full">
              Call Random Number
            </Button>
          </CardContent>
        </Card>

        {/* Called Numbers Display */}
        <Card>
          <CardHeader>
            <CardTitle>Called Numbers ({calledNumbers.length}/75)</CardTitle>
            <CardDescription>Numbers called in this game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 text-center text-sm font-medium mb-4">
              <div>B (1-15)</div>
              <div>I (16-30)</div>
              <div>N (31-45)</div>
              <div>G (46-60)</div>
              <div>O (61-75)</div>
            </div>
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {[...Array(5)].map((_, colIndex) => (
                <div key={colIndex} className="space-y-1">
                  {[...Array(15)].map((_, rowIndex) => {
                    const number = colIndex * 15 + rowIndex + 1
                    const isCalled = calledNumbers.includes(number)
                    return (
                      <Badge
                        key={number}
                        variant={isCalled ? "default" : "outline"}
                        className="w-full justify-center text-xs"
                      >
                        {number}
                      </Badge>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
