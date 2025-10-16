"use client"

import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertCircle, RefreshCw } from "lucide-react"

interface ConnectionStatusProps {
  roomId?: number
}

export function ConnectionStatus({ roomId }: ConnectionStatusProps) {
  const { connected, connecting, error, latencyMs, reconnectAttempts, reconnect } = useWebSocketEvents({ roomId })

  if (connected) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Wifi className="h-4 w-4 text-green-500" />
        <span>Connected</span>
        {/* <Badge variant="outline" className="text-xs">
          {latencyMs}ms
        </Badge> */}
      </div>
    )
  }

  if (connecting) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
        <span>Connecting...</span>
        {reconnectAttempts > 0 && (
          <Badge variant="outline" className="text-xs">
            Attempt {reconnectAttempts}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>
            {error || "Connection lost"}
            {reconnectAttempts > 0 && ` (${reconnectAttempts} attempts)`}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={reconnect} className="ml-4 bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}
