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


"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/stores/game-store"

interface CountdownTimerProps {
  label?: string
  gamePage?: boolean
}

export function CountdownTimer({ label, gamePage = true }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const setCountdownTime = useGameStore(state => state.setCountdownTime)
  const duration = useGameStore(state => state.game.countdownDurationSeconds)

  useEffect(() => {
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
          setCountdownTime("", -1) // reset store when finished
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [duration, setCountdownTime])

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
