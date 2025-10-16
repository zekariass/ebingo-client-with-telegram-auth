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
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/lib/stores/game-store"

interface CountdownTimerProps {
  endTime: string // UTC ISO string
  label?: string
}

export function CountdownTimer({ endTime, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const setCountdownEndTime = useGameStore(state => state.setCountdownWithEndTime)

  useEffect(() => {
    if (!endTime) return

    const targetTime = new Date(endTime).getTime()
    let interval: NodeJS.Timeout

    const update = () => {
      const now = Date.now()
      const diff = Math.max(Math.ceil((targetTime - now) / 1000), 0)
      setTimeLeft(diff)

      if (diff === 0 && interval) clearInterval(interval)
    }

    update()
    interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  useEffect(() => {
    if (timeLeft <= 0) {
      setCountdownEndTime("")
    } else {
      setCountdownEndTime(new Date(Date.now() + timeLeft * 1000).toISOString())
    }
  }, [timeLeft, setCountdownEndTime])

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins.toString().padStart(2, "0")}:${remSecs.toString().padStart(2, "0")}`
  }

  // Map timeLeft to badge color
  const getBadgeBg = () => {
    if (timeLeft <= 10) return "#f87171" // red
    if (timeLeft <= 30) return "#fbbf24" // yellow
    return "#60a5fa" // blue for >30s
  }

  if (timeLeft <= 0) return null

  return (
    <div className="text-center space-y-1">
      {label && <div className="text-xs text-muted-foreground">{label}</div>}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={timeLeft}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backgroundColor: getBadgeBg() }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block rounded-md"
        >
          <Badge variant="outline" className="font-mono text-sm px-3 py-1">
            Starts In: {formatTime(timeLeft)}
          </Badge>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
