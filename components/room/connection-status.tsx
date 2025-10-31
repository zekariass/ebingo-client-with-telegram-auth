"use client"

import { useEffect, useRef } from "react"
import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertCircle, RefreshCw } from "lucide-react"
import { userStore } from "@/lib/stores/user-store"

interface ConnectionStatusProps {
  roomId?: number
}

export function ConnectionStatus({ roomId }: ConnectionStatusProps) {
  const { connected, connecting, reconnectAttempts, connect, reconnect } = useWebSocketEvents({
    roomId,
    enabled: true,
  })

  const { initData } = userStore()
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)

  // ✅ Only run once when initData is available
  useEffect(() => {
    if (initData && roomId) {
      connect()
    }
  }, [initData, roomId, connect]) // removed connected/connecting from deps

  // ✅ Auto-reconnect only when disconnected
  useEffect(() => {
    if (!connected && !connecting && roomId && initData) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000)

      reconnectTimeout.current = setTimeout(() => {
        reconnect()
      }, delay)

      console.log(`🔄 Auto reconnecting in ${delay / 1000}s...`)
    }

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
    }
  }, [connected, connecting, reconnectAttempts, reconnect, roomId, initData])



  if (connected) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        {/* <Wifi className="h-4 w-4 text-green-500" /> */}
        <span className="text-green-500">Connected</span>
      </div>
    )
  }

  if (connecting) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
        <span className="text-yellow-500">Connecting...</span>
        {/* {reconnectAttempts > 0 && (
          <Badge variant="outline" className="text-xs">
            Attempt {reconnectAttempts}
          </Badge>
        )} */}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <Badge variant="destructive" className="cursor-pointer" onClick={() => reconnect()}>
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="">
          <div className="bg-transparent fond-bold"
          >          
            Retry
          </div>
        </AlertDescription>
    </Badge>
    </div>
  )
}
