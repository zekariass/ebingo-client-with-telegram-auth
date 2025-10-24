// "use client"

// import { useState, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"

// interface CountdownTimerProps {
//   targetTime: string
//   label?: string
// }

// export function CountdownTimer({ targetTime, label }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(0)

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const target = new Date(targetTime).getTime()
//       const now = Date.now()
//       const difference = target - now
//       return Math.max(0, Math.floor(difference / 1000))
//     }

//     setTimeLeft(calculateTimeLeft())

//     const interval = setInterval(() => {
//       setTimeLeft(calculateTimeLeft())
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [targetTime])

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
//   }

//   const getVariant = () => {
//     if (timeLeft <= 30) return "destructive"
//     if (timeLeft <= 120) return "secondary"
//     return "outline"
//   }

//   return (
//     <div className="text-center space-y-1">
//       {label && <div className="text-xs text-muted-foreground">{label}</div>}
//       <Badge variant={getVariant()} className="font-mono text-sm px-3 py-1">
//         {formatTime(timeLeft)}
//       </Badge>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { useGameStore } from "@/lib/stores/game-store"

// interface CountdownTimerProps {
//   seconds: number
//   endTime: string,
//   label?: string
// }

// export function CountdownTimer({ seconds, endTime, label }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(seconds)
//   const setCountdown = useGameStore(state => state.setCountdown)

//   useEffect(() => {
//     if (seconds <= 0) return

//     setTimeLeft(seconds)

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval)
//           return 0
//         }
//         return prev - 1
//       })
//     }, 1000)

//     return () => clearInterval(interval)

//   }, [seconds])


//   useEffect(() => {

//       if (timeLeft == 9){
//         setCountdown(9)
//       }
//       if (timeLeft === 0) {
//         setCountdown(0)
//       }
//     }, [timeLeft])


//   const formatTime = (secs: number) => {
//     const mins = Math.floor(secs / 60)
//     const remSecs = secs % 60
//     return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
//   }

//   const getVariant = () => {
//     if (timeLeft <= 30) return "destructive"
//     if (timeLeft <= 120) return "secondary"
//     return "outline"
//   }

//   if (seconds <= 0) return null

//   return (
//     <div className="text-center space-y-1">
//       {label && <div className="text-xs text-muted-foreground">{label}</div>}
//       <Badge variant={getVariant()} className="font-mono text-sm px-3 py-1">
//         Starts In: {formatTime(timeLeft)}
//       </Badge>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { useGameStore } from "@/lib/stores/game-store"
// import { time } from "console"

// interface CountdownTimerProps {
//   endTime: string // UTC ISO string
//   label?: string
// }

// export function CountdownTimer({ endTime, label }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(0)
//   const setCountdownEndTime = useGameStore(state => state.setCountdownWithEndTime)

//   useEffect(() => {
//     if (!endTime) return

//     const targetTime = new Date(endTime).getTime()

//     const update = () => {
//       const now = Date.now()
//       const diff = Math.max(Math.ceil((targetTime - now) / 1000), 0)
//       setTimeLeft(diff)

//       if (diff === 0) clearInterval(interval)
//     }

//     update()
//     const interval = setInterval(update, 1000)

//     return () => clearInterval(interval)
//   }, [endTime])

//   // Update global countdown store
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       setCountdownEndTime("")
//     } else {
//       setCountdownEndTime((new Date(Date.now() + timeLeft*1000)).toString())
//     }
//   }, [timeLeft, setCountdownEndTime])

//   const formatTime = (secs: number) => {
//     const mins = Math.floor(secs / 60)
//     const remSecs = secs % 60
//     return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
//   }

//   const getVariant = () => {
//     if (timeLeft <= 30) return "destructive"
//     if (timeLeft <= 120) return "secondary"
//     return "outline"
//   }

//   if (timeLeft <= 0) return null

//   console.log("=>>>>>>>>>>>>>>> TIME LEFT: ", timeLeft)

//   return (
//     <div className="text-center space-y-1">
//       {label && <div className="text-xs text-muted-foreground">{label}</div>}
//       <Badge variant={getVariant()} className="font-mono text-sm px-3 py-1">
//         Starts In: {formatTime(timeLeft)}
//       </Badge>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { useGameStore } from "@/lib/stores/game-store"

// interface CountdownTimerProps {
//   endTime: string // UTC ISO string
//   label?: string
// }

// export function CountdownTimer({ endTime, label }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(0)
//   const setCountdownEndTime = useGameStore(state => state.setCountdownWithEndTime)

//   useEffect(() => {
//     if (!endTime) return

//     const targetTime = new Date(endTime).getTime()
//     let interval: NodeJS.Timeout

//     const update = () => {
//       const now = Date.now()
//       const diff = Math.max(Math.ceil((targetTime - now) / 1000), 0)
//       setTimeLeft(diff)

//       if (diff === 0 && interval) clearInterval(interval)
//     }

//     update()
//     interval = setInterval(update, 1000)

//     return () => clearInterval(interval)
//   }, [endTime])

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       setCountdownEndTime("")
//     } else {
//       setCountdownEndTime(new Date(Date.now() + timeLeft * 1000).toISOString())
//     }
//   }, [timeLeft, setCountdownEndTime])

//   const formatTime = (secs: number) => {
//     const mins = Math.floor(secs / 60)
//     const remSecs = secs % 60
//     return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
//   }

//   const getVariant = () => {
//     if (timeLeft <= 30) return "destructive"
//     if (timeLeft <= 120) return "secondary"
//     return "outline"
//   }

//   if (timeLeft <= 0) return null

//   return (
//     <div className="text-center space-y-1">
//       {label && <div className="text-xs text-muted-foreground">{label}</div>}
//       <Badge variant={getVariant()} className="font-mono text-sm px-3 py-1">
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
  endTimess?: string // UTC ISO string
  label?: string
}

export function CountdownTimer({label }: CountdownTimerProps) {
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
    if (timeLeft <= 30) return "bg-yellow-400 text-white"
    return "bg-blue-400 text-white"
  }

  if (timeLeft <= 0) {
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
        {/* Starts In: {endTime} */}
      </Badge>
    </div>
  )
}

