// "use client"

// import { useState, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { useGameStore } from "@/lib/stores/game-store"

// interface CountdownTimerProps {
//   endTimess?: string
//   label?: string
//   gamePage?: boolean
// }

// export function CountdownTimer({label, gamePage = true }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(0)
//   const setCountdownTime = useGameStore(state => state.setCountdownTime)
//   const endTime = useGameStore(state => state.game.countdownEndTime)
//   const duration = useGameStore(state => state.game.countdownDurationSeconds)

//   useEffect(() => {
    
//     if (!endTime) {
//       console.warn("CountdownTimer: missing endTime")
//       return
//     }

//     const safeEndTime = endTime
//                         .replace(/\.\d+Z$/, "Z") // remove sub-millisecond precision
//                         .replace(/Z?$/, "Z");    // ensure UTC suffix
//     const targetTime = new Date(safeEndTime).getTime()
    
//     if (isNaN(targetTime)) {
//       console.error("CountdownTimer: invalid endTime", endTime)
//       return
//     }

//     const update = () => {
//       const now = Date.now()
//       const diffSeconds = Math.max(Math.floor((targetTime - now) / 1000), 0)
//       setTimeLeft(diffSeconds)

//       // when finished, stop the interval and clear store state
//       if (diffSeconds <= 0) {
//         setCountdownTime("", -1)
//       }
//     }

//     update()
//     const interval = setInterval(update, 1000)
//     return () => clearInterval(interval)
//   }, [endTime, setCountdownTime])

//   const formatTime = (secs: number) => {
//     const mins = Math.floor(secs / 60)
//     const remSecs = secs % 60
//     return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
//   }

//   const getBadgeBg = () => {
//     if (timeLeft <= 10) return "bg-red-500 text-white"
//     if (timeLeft <= 30) return "bg-yellow-500 text-white"
//     return "bg-blue-500 text-white"
//   }


//   if (timeLeft <= 0 && gamePage) {
//     return (
//       <div className="text-center space-y-1">
//         {label && <div className="text-xs text-white">{label}</div>}
//         <Badge className="bg-green-500 text-white font-mono text-sm px-3 py-1">
//           Starting...
//         </Badge>
//       </div>
//     )
//   }

//   return (
//     <div className="text-center space-y-1">
//       {label && <div className="text-xs text-white">{label}</div>}
//       <Badge className={`font-mono text-sm px-3 py-1 ${getBadgeBg()}`}>
//         Starts In: {formatTime(timeLeft)}
//       </Badge>
//     </div>
//   )
// }



// ==========================================================
// "use client"

// import { useState, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { useGameStore } from "@/lib/stores/game-store"
// import { GameStatus } from "@/lib/types"

// interface CountdownTimerProps {
//   label?: string
//   gamePage?: boolean
// }

// export function CountdownTimer({ label, gamePage = true }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(0)
//   const setCountdownTime = useGameStore(state => state.setCountdownTime)
//   const duration = useGameStore(state => state.game.countdownDurationSeconds)
//   const status = useGameStore(state => state.game.status)

//   useEffect(() => {
//     if (duration == null || duration < 0) {
//       console.warn("CountdownTimer: missing or invalid duration")
//       return
//     }

//     setTimeLeft(duration)

//     const interval = setInterval(() => {
//       setTimeLeft(prev => {
//         const next = prev - 1
//         if (next === 0) {
//           clearInterval(interval)
//           setCountdownTime("", 0) // reset store when finished
//           return 0
//         } else {
//           setCountdownTime("", next)
//         }
//         return next
//       })
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [duration, setCountdownTime])

//   const formatTime = (secs: number) => {
//     const mins = Math.floor(secs / 60)
//     const remSecs = secs % 60
//     return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
//   }

//   const getBadgeBg = () => {
//     if (timeLeft <= 10) return "bg-red-500 text-white"
//     if (timeLeft <= 30) return "bg-yellow-500 text-white"
//     return "bg-blue-500 text-white"
//   }

//   if (timeLeft === 0 && gamePage) {
//     return (
//       <div className="text-center space-y-1">
//         {label && <div className="text-xs text-white">{label}</div>}
//         <Badge className="bg-green-500 text-white font-mono text-sm px-3 py-1">
//           Starting...
//         </Badge>
//       </div>
//     )
//   }

//   if (timeLeft < 0 && status === GameStatus.READY && gamePage) {
//     return (
//       <div className="text-center space-y-1">
//         {label && <div className="text-xs text-white">{label}</div>}
//         <Badge className="bg-green-500 text-white font-mono text-sm px-3 py-1">
//           Starting Soon...
//         </Badge>
//       </div>
//     )
//   }

//   return (
//     <div className="text-center space-y-1">
//       {label && <div className="text-xs text-white">{label}</div>}
//       <Badge className={`font-mono text-sm px-3 py-1 ${getBadgeBg()}`}>
//         Starts In: {formatTime(timeLeft)}
//       </Badge>
//     </div>
//   )
// }

// ==========================================================

"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/stores/game-store"
import { GameStatus } from "@/lib/types"
import { useSystemStore } from "@/lib/stores/system-store"
import i18n from "@/i18n"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  label?: string
  gamePage?: boolean
}

export function CountdownTimer({ label, gamePage = true }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const setCountdownTime = useGameStore(state => state.setCountdownTime)
  const duration = useGameStore(state => state.game.countdownDurationSeconds)
  const status = useGameStore(state => state.game.status)
  const currentDrawnNumber = useGameStore(state => state.game.currentDrawnNumber)
  const [currentLetter, setCurrentLetter] = useState<string>("")
  const voiceOn = useSystemStore(state => state.voiceOn)
  const localeChanged = useSystemStore(state => state.localeChanged)
  const setLocaleChanged = useSystemStore(state => state.setLocaleChanged)

  // Helper to map number → BINGO letter
  const getCurrentLetter = (number: number): string => {
    if (number < 1 || number > 75) return ""
    const letters = ["B", "I", "N", "G", "O"]
    const index = Math.floor((number - 1) / 15)
    return letters[index]
  }

  // Countdown logic
  useEffect(() => {
    if (status !== GameStatus.COUNTDOWN) return

    if (duration == null || duration < 0) {
      console.warn("CountdownTimer: missing or invalid duration")
      return
    }

    setTimeLeft(duration)

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(interval)
          setCountdownTime("", 0, GameStatus.READY)
          return 0
        } else {
          setCountdownTime("", next, GameStatus.COUNTDOWN)
          return next
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [duration, status, setCountdownTime])

  // Play number sound when playing
  const playNumberSound = (number: number | undefined) => {
    if (!number) return
    if (localeChanged) {
      setLocaleChanged(false)
      return
    }
    const audio = new Audio(`/audio/${i18n.language}/${number}.mp3`)
    audio.play().catch(err => console.warn("Audio blocked:", err))
  }

  // Handle drawn number updates
  useEffect(() => {
    if (status === GameStatus.PLAYING && currentDrawnNumber) {
      setCurrentLetter(getCurrentLetter(Number(currentDrawnNumber)))
      if (voiceOn) playNumberSound(currentDrawnNumber)
    }
  }, [currentDrawnNumber, status, voiceOn])

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
  }

  const getBadgeBg = () => {
    if (timeLeft < 10) return "bg-red-500 text-white"
    if (timeLeft <= 30) return "bg-yellow-500 text-white"
    return "bg-blue-500 text-white"
  }

  // Render logic
  if (status === GameStatus.COUNTDOWN) {
    return (
      <div className="text-center space-y-1">
        {label && <div className="text-xs text-white">{label}</div>}
        {timeLeft > 0 ? (
          <Badge className={`font-mono text-sm px-3 py-1 ${getBadgeBg()}`}>
            Starts In: {formatTime(timeLeft)}
          </Badge>
        ) : (
          <Badge className="bg-green-500 text-white font-mono text-sm px-3 py-1">
            Starting...
          </Badge>
        )}
      </div>
    )
  }

  if (status === GameStatus.PLAYING) {
    return (
      <div className="text-center">
        {currentDrawnNumber ? (
          <motion.div
            key={currentDrawnNumber}
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 1 }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
            className="text-xl font-extrabold text-yellow-400 drop-shadow-2xl"
          >
            <span className="text-green-500">{currentLetter}</span>
            <span className="text-red-500">-</span>
            {currentDrawnNumber}
          </motion.div>
        ) : (
          <Badge className="bg-yellow-600 text-black font-mono text-white text-sm px-3 py-1">
            Calling...
          </Badge>
        )}
      </div>
    )
  }

  // Default fallback
  if (status === GameStatus.READY && gamePage) {
    return (
      <div className="text-center space-y-1">
        {label && <div className="text-xs text-white">{label}</div>}
        <Badge className="bg-green-500 text-white font-mono text-sm px-3 py-1">
          Starting Soon...
        </Badge>
      </div>
    )
  }

  return null
}
