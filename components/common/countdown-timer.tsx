"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/stores/game-store"

interface CountdownTimerProps {
  endTimess?: string
  label?: string
  gamePage?: boolean
}

export function CountdownTimer({label, gamePage = true }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const setCountdownEndTime = useGameStore(state => state.setCountdownWithEndTime)
  const endTime = useGameStore(state => state.game.countdownEndTime)

  useEffect(() => {
    if (!endTime) {
      console.warn("CountdownTimer: missing endTime")
      return
    }

    const safeEndTime = endTime
                        .replace(/\.\d+Z$/, "Z") // remove sub-millisecond precision
                        .replace(/Z?$/, "Z");    // ensure UTC suffix
    const targetTime = new Date(safeEndTime).getTime()
    if (isNaN(targetTime)) {
      console.error("CountdownTimer: invalid endTime", endTime)
      return
    }

    const update = () => {
      const now = Date.now()
      const diffSeconds = Math.max(Math.floor((targetTime - now) / 1000), 0)
      setTimeLeft(diffSeconds)

      // when finished, stop the interval and clear store state
      if (diffSeconds <= 0) {
        setCountdownEndTime("")
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [endTime, setCountdownEndTime])

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
  }

  const getBadgeBg = () => {
    if (timeLeft <= 10) return "bg-red-500 text-white"
    if (timeLeft <= 30) return "bg-yellow-500 text-white"
    return "bg-blue-500 text-white"
  }


  if (timeLeft <= 0 && gamePage) {
    return (
      <div className="text-center space-y-1">
        {label && <div className="text-xs text-white">{label}</div>}
        <Badge className="bg-green-500 text-white font-mono text-sm px-3 py-1">
          Starting...
        </Badge>
      </div>
    )
  }

  return (
    <div className="text-center space-y-1">
      {label && <div className="text-xs text-white">{label}</div>}
      <Badge className={`font-mono text-sm px-3 py-1 ${getBadgeBg()}`}>
        Starts In: {formatTime(timeLeft)}
      </Badge>
    </div>
  )
}

