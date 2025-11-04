// "use client"

// import { useEffect, useRef, useState, useCallback } from "react"
// import { useRoomStore } from "@/lib/stores/room-store"
// import { GameStatus, type WSEvent, type WSMessage } from "@/lib/types"
// import { useGameStore } from "@/lib/stores/game-store"
// import { useRouter } from "next/navigation"
// import i18n from "@/i18n"
// import { userStore } from "@/lib/stores/user-store"
// import { useTelegramInit } from "../use-telegram-init"
// import _ from "lodash"


// interface UseRoomSocketOptions {
//   roomId?: number
//   enabled?: boolean
// }

// interface SocketState {
//   connected: boolean
//   connecting: boolean
//   error: string | null
//   latencyMs: number
//   reconnectAttempts: number
// }

// const MAX_RECONNECT_ATTEMPTS = 3
// const INITIAL_RECONNECT_DELAY = 2000
// const MAX_RECONNECT_DELAY = 10000
// const HEARTBEAT_INTERVAL = 30000

// export function useRoomSocket({ roomId, enabled = true }: UseRoomSocketOptions) {
//   const roomStore = useRoomStore()
//   const gameStore = useGameStore()
//   const {initData, user} = userStore()
//   useTelegramInit();

//   // alert("GAME ID: "+gameStore.game.gameId)

  
//   const router = useRouter();

//   const wsRef = useRef<WebSocket | null>(null)
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
//   const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
//   const lastPingRef = useRef<number>(0)
//   const reconnectAttemptsRef = useRef<number>(0)
//   const maxAttemptsReachedRef = useRef<boolean>(false)

//   const roomStoreRef = useRef(roomStore)
//   const gameStoreRef = useRef(gameStore)

//   roomStoreRef.current = roomStore
//   gameStoreRef.current = gameStore

//   const [socketState, setSocketState] = useState<SocketState>({
//     connected: false,
//     connecting: false,
//     error: null,
//     latencyMs: 0,
//     reconnectAttempts: 0,
//   })

//   const getReconnectDelay = useCallback((attempts: number) => {
//     const delay = Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, attempts), MAX_RECONNECT_DELAY)
//     return delay + Math.random() * 1000
//   }, [])

//   const send = useCallback((message: Partial<WSMessage>) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       const fullMessage: WSMessage = {
//         type: message.type || "unknown",
//         payload: message.payload || {},
//       }
//       wsRef.current.send(JSON.stringify(fullMessage))
//       return true
//     }
//     return false
//   }, [])

//   const handleMessage = useCallback((event: MessageEvent) => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
//     try {
//       const message: WSEvent = JSON.parse(event.data)
//       const _roomStore = roomStoreRef.current
//       const _gameStore = gameStoreRef.current

//       if (message.type === "pong") {
//         const latency = Date.now() - lastPingRef.current
//         setSocketState((prev) => ({ ...prev, latencyMs: latency }))
//         _roomStore.setLatency(latency)
//         return
//       }

//       switch (message.type) {
//         case "game.playerJoined":
          
//           _gameStore.setJoinedPlayers(message.payload.joinedPlayers)
//           _gameStore.setPlayersCount(message.payload.playersCount)
//           _gameStore.addPlayerSelectedCards(
//             message.payload.playerSelectedCardIds,
//             Number(message.payload.playerId),
//             user?.telegramId || 0
//           )

//           if (user && 
//               message.payload.joinedPlayers.includes(user.telegramId.toString()) &&
//               Number(message.payload.playerId) === user.telegramId){
                
//             router.push(`/${i18n.language}/rooms/${roomId}/game`)
//             _gameStore.setJoining(false)

//           }
//           break
//         case "game.playerLeft":
//           message.payload.releasedCardsIds?.forEach(cardId => 
//              _gameStore.releaseCard(cardId))
//           if ((user && user.telegramId === Number(message.payload.playerId)) && (message.payload.errorType === "gameStarted" || message.payload.errorType === "gameStarting" || message.payload.errorType === "gameEnded")){
//             router.replace(`/${i18n.language}`)
//             _gameStore.resetGameState()
//             _roomStore.resetRoom()
//             disconnect()
//             break
//           }
          
//           if (user && user.telegramId === Number(message.payload.playerId)){
//             router.replace(`/${i18n.language}`)
//             _gameStore.resetGameState()
//             _roomStore.resetRoom()
//             disconnect()
//           }else{
//             _gameStore.removePlayer(message.payload.playerId)
//             _gameStore.setPlayersCount(message.payload.playersCount)
//             if (message.payload.gameState){
//               _gameStore.setGameState(message.payload.gameState)
//             }
//           }
          
//           break
//         case "game.started":
//           alert(message.payload.gameId + " "+ gameStoreRef.current.game.gameId)
          
//           if (message.payload.gameId === gameStoreRef.current.game.gameId){
//             _gameStore.updateStatus(GameStatus.PLAYING)
//             _gameStore.setStarted(true)
//             _gameStore.resetDrawnNumbers()
//             _gameStore.setClaiming(false)
//           }
//           break
//         case "game.numberDrawn":
//           // alert(message.payload.gameId + " "+ gameStoreRef.current.game.gameId)

//           if (message.payload.gameId === gameStoreRef.current.game.gameId && 
//             message.payload.roomId === roomStoreRef.current.room?.id){
//           _gameStore.addDrawnNumber(message.payload.number)
//           _gameStore.setCurrentDrawnNumber(message.payload.number)
//           break
//           }
//         case "game.bingoClaimResponse":
//           _gameStore.handleBingoClaimResponse(message.payload)
//           _gameStore.setClaiming(false)
//           break
//         case "game.winnerDeclared":
//           _gameStore.setWinner(message.payload.winner)
//           _gameStore.updateStatus(GameStatus.COMPLETED)
//           _gameStore.setEnded(true)
//           break
//         case "game.countdown":
//           _gameStore.setCountdownWithEndTime(message.payload.countdownEndTime)
//           break
//         case "game.ended":
//           // alert(message.payload.gameId + " "+ gameStoreRef.current.game.gameId)

//           if (message.payload.gameId === gameStoreRef.current.game.gameId){
//             _gameStore.setWinner(message.payload)
//             router.push(`/${i18n.language}/rooms/${roomId}`)
//             _gameStore.resetGameState()
//             _gameStore.setClaiming(false)

//           }
//           break
//         case "game.cardSelected":
//           _gameStore.selectCard(message.payload.cardId, message.payload.playerId)
//           break
//         case "game.cardReleased":
//           _gameStore.releaseCard(message.payload.cardId)
//           break
//         case "room.serverGameState":
//           _gameStore.resetGameState()
//           if (message.payload.success && message.payload.gameState) {

//             // Filter card IDs
//             const cardIds = message.payload.gameState?.currentCardPool.map(
//               (card) => card.cardId
//             )

//             message.payload.gameState.allCardIds = cardIds || []
//             _gameStore.setGameState(message.payload.gameState)
//           }
//           break

//          case "game.state":
//           _gameStore.resetGameState()
//           if (message.payload.gameState) {
//             _gameStore.setGameState(message.payload.gameState)
//           }
//           break

//         case "game.initialized":
//           _gameStore.resetGameState()
//           _gameStore.setGameState(message.payload.gameState)
//           break
//         // case "card.markNumberResponse":
//         //   _gameStore.setMarkedNumbersForACard(message.payload.cardId, message.payload.numbers)
//         //   break
//         // case "card.unmarkNumberResponse":
//         //   _gameStore.setMarkedNumbersForACard(message.payload.cardId, message.payload.numbers)
//         //   break
//         case "game.notEnoughPlayers":
//           // alert(roomStore.room?.id + " " + message.payload.roomId)
//           if (gameStore.game.roomId === message.payload.roomId) {
//             alert(message.payload.status)
//             _gameStore.updateStatus(message.payload.status as GameStatus)
//             _gameStore.setPlayersCount(message.payload.joinedPlayers.length)
//             _gameStore.setJoinedPlayers(message.payload.joinedPlayers)
//           }
//           break
//         case "error":
//           if (message.payload?.eventType === "bingo.claim"){
//             _gameStore.setClaimError(message.payload)
//             _gameStore.setClaiming(false)
//           }else if (message.payload?.eventType === "game.playerJoinRequest"){
//             gameStoreRef.current.setJoinError(message.payload?.message)
//             router.replace(`/${i18n.language}/rooms/${roomId}`)
//             // _gameStore.setJoining(false)
//           } else if (message.payload?.eventType === "game.playerLeaveRequest"){
//             _gameStore.resetGameState()
//             gameStoreRef.current.resetGameState()
//             _roomStore.resetRoom()
//             roomStoreRef.current.resetRoom()
//             _gameStore.setJoining(false)
//             router.replace(`/${i18n.language}`)
//           }
//           break
//         default:
//           console.warn("Unhandled WebSocket message type:", message.type)
//       }
//     } catch (error) {
//       console.error("Error parsing WebSocket message:", error)
//     }
//   }, [])

//   const startHeartbeat = useCallback(() => {
//     if (heartbeatIntervalRef.current) {
//       clearInterval(heartbeatIntervalRef.current)
//     }
//     heartbeatIntervalRef.current = setInterval(() => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         lastPingRef.current = Date.now()
//         send({ type: "ping" })
//       }
//     }, HEARTBEAT_INTERVAL)
//   }, [send])

//   const stopHeartbeat = useCallback(() => {
//     if (heartbeatIntervalRef.current) {
//       clearInterval(heartbeatIntervalRef.current)
//       heartbeatIntervalRef.current = null
//     }
//   }, [])

//   const connect = useCallback(
//     () => {
//       if (!enabled || maxAttemptsReachedRef.current) return

//       setSocketState((prev) => {
//         if (prev.connecting) return prev
//         return { ...prev, connecting: true, error: null }
//       })

//       try {

//         // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Connecting to WebSocket... roomId:", roomId, "initData:", initData)

//         const WS_API_BASE = process.env.NEXT_PUBLIC_WS_URL!
//         const wsUrl = `${WS_API_BASE}/ws/game?roomId=${roomId}&initData=${encodeURIComponent((initData) ??"")}`

//         const ws = new WebSocket(wsUrl)
//         wsRef.current = ws

//         ws.onopen = () => {
//           console.log("WebSocket connected to room:", roomId)
//           reconnectAttemptsRef.current = 0
//           maxAttemptsReachedRef.current = false
//           setSocketState((prev) => ({
//             ...prev,
//             connected: true,
//             connecting: false,
//             error: null,
//             reconnectAttempts: 0,
//           }))
//           roomStoreRef.current.setConnected(true)
//           startHeartbeat()
          
//         }

//         ws.onmessage = handleMessage

//         ws.onclose = (event) => {
//           console.log("WebSocket disconnected:", event.code, event.reason)
//           setSocketState((prev) => ({ ...prev, connected: false, connecting: false }))
//           roomStoreRef.current.setConnected(false)
//           stopHeartbeat()

//           if (
//             event.code !== 1000 &&
//             enabled &&
//             reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS &&
//             !maxAttemptsReachedRef.current
//           ) {
//             const currentAttempts = reconnectAttemptsRef.current
//             const delay = getReconnectDelay(currentAttempts)
//             console.log(`Reconnecting in ${delay}ms (attempt ${currentAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`)
//             reconnectTimeoutRef.current = setTimeout(() => {
//               reconnectAttemptsRef.current += 1
//               setSocketState((prev) => ({
//                 ...prev,
//                 reconnectAttempts: reconnectAttemptsRef.current,
//               }))
//               if (initData) connect()
//             }, delay)
//           } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
//             maxAttemptsReachedRef.current = true
//             setSocketState((prev) => ({
//               ...prev,
//               error: "Unable to connect",
//             }))
//             console.log("Max reconnection attempts reached - stopping reconnection")
//           }
//         }

//         ws.onerror = (event) => {
//           setSocketState((prev) => ({
//             ...prev,
//             error: "Connection error2",
//             connecting: false,
//           }))
//         }
//       } catch (error) {
//         console.error("Failed to create WebSocket:", error)
//         setSocketState((prev) => ({
//           ...prev,
//           error: "Failed to connect2",
//           connecting: false,
//         }))
//       }
//     },
//     [enabled, roomId, handleMessage, startHeartbeat, stopHeartbeat, send, getReconnectDelay, initData]
//   )

//   const disconnect = useCallback(() => {
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current)
//       reconnectTimeoutRef.current = null
//     }
//     stopHeartbeat()
//     if (wsRef.current) {
//       wsRef.current.close(1000, "Manual disconnect")
//       wsRef.current = null
//     }
//     reconnectAttemptsRef.current = 0
//     setSocketState({
//       connected: false,
//       connecting: false,
//       error: null,
//       latencyMs: 0,
//       reconnectAttempts: 0,
//     })
//     roomStoreRef.current.setConnected(false)
//   }, [stopHeartbeat])

//   const reconnect = useCallback(() => {
//     maxAttemptsReachedRef.current = false
//     reconnectAttemptsRef.current = 0
//     disconnect()
//     if (initData) {
//       setTimeout(() => connect(), 100)
//     } 
//   }, [disconnect, connect, initData])

//   useEffect(() => {
//     if (!roomId) return
//     if (enabled && initData ) {
//       connect()
//     }
//     return () => {
//       disconnect()
//     }
//   }, [enabled, initData, roomId])

//   return {
//     ...socketState,
//     send,
//     connect,
//     disconnect,
//     reconnect,
//   }
// }





"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRoomStore } from "@/lib/stores/room-store"
import { useGameStore } from "@/lib/stores/game-store"
import { useRouter } from "next/navigation"
import i18n from "@/i18n"
import { userStore } from "@/lib/stores/user-store"
import { useTelegramInit } from "../use-telegram-init"
import { GameStatus, type WSEvent, type WSMessage } from "@/lib/types"

interface UseRoomSocketOptions {
  roomId?: number
  enabled?: boolean
}

interface SocketState {
  connected: boolean
  connecting: boolean
  error: string | null
  latencyMs: number
  reconnectAttempts: number
}

const MAX_RECONNECT_ATTEMPTS = 3
const INITIAL_RECONNECT_DELAY = 2000
const MAX_RECONNECT_DELAY = 10000
const HEARTBEAT_INTERVAL = 30000

export function useRoomSocket({ roomId, enabled = true }: UseRoomSocketOptions) {
  const roomStore = useRoomStore()
  const gameStore = useGameStore()
  const { initData, user } = userStore()
  useTelegramInit()
  const router = useRouter()

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastPingRef = useRef<number>(0)
  const reconnectAttemptsRef = useRef<number>(0)
  const maxAttemptsReachedRef = useRef<boolean>(false)
  const hasConnectedRef = useRef(false)

  const roomStoreRef = useRef(roomStore)
  const gameStoreRef = useRef(gameStore)
  roomStoreRef.current = roomStore
  gameStoreRef.current = gameStore

  const [socketState, setSocketState] = useState<SocketState>({
    connected: false,
    connecting: false,
    error: null,
    latencyMs: 0,
    reconnectAttempts: 0,
  })

  const getReconnectDelay = useCallback((attempts: number) => {
    const delay = Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, attempts), MAX_RECONNECT_DELAY)
    return delay + Math.random() * 1000
  }, [])

  const send = useCallback((message: Partial<WSMessage>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WSMessage = {
        type: message.type || "unknown",
        payload: message.payload || {},
      }
      wsRef.current.send(JSON.stringify(fullMessage))
      return true
    }
    return false
  }, [])

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        lastPingRef.current = Date.now()
        send({ type: "ping" })
      }
    }, HEARTBEAT_INTERVAL)
  }, [send])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    stopHeartbeat()
    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect")
      wsRef.current = null
    }
    reconnectAttemptsRef.current = 0
    setSocketState({
      connected: false,
      connecting: false,
      error: null,
      latencyMs: 0,
      reconnectAttempts: 0,
    })
    roomStoreRef.current.setConnected(false)
  }, [stopHeartbeat])

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    try {
      const message: WSEvent = JSON.parse(event.data)
      const _roomStore = roomStoreRef.current
      const _gameStore = gameStoreRef.current

      // latency tracking
      if (message.type === "pong") {
        const latency = Date.now() - lastPingRef.current
        setSocketState((prev) => ({ ...prev, latencyMs: latency }))
        _roomStore.setLatency(latency)
        return
      }

      // ignore early messages before game initialized
      if (message.type.startsWith("game.") && !_gameStore.game?.gameId) {
        console.warn("Ignoring early message:", message.type)
        return
      }

      const handlers: Record<string, (payload: any) => void> = {
        "game.playerJoined": (p) => {
          _gameStore.setJoinedPlayers(p.joinedPlayers)
          _gameStore.setPlayersCount(p.playersCount)
          _gameStore.addPlayerSelectedCards(p.playerSelectedCardIds, Number(p.playerId), user?.telegramId || 0)
          if (user && p.joinedPlayers.includes(user.telegramId.toString()) && Number(p.playerId) === user.telegramId) {
            router.push(`/${i18n.language}/rooms/${roomId}/game`)
            _gameStore.setJoining(false)
          }
        },
        "game.playerLeft": (p) => {
          p.releasedCardsIds?.forEach((cardId: string) => _gameStore.releaseCard(cardId))
          if (user && user.telegramId === Number(p.playerId)) {
            router.replace(`/${i18n.language}`)
            _gameStore.resetGameState()
            _roomStore.resetRoom()
            disconnect()
          } else {
            _gameStore.removePlayer(p.playerId)
            _gameStore.setPlayersCount(p.playersCount)
            if (p.gameState) _gameStore.setGameState(p.gameState)
          }
        },
        "game.started": (p) => {
          if (p.gameId !== _gameStore.game.gameId) return
          _gameStore.updateStatus(GameStatus.PLAYING)
          _gameStore.setStarted(true)
          _gameStore.resetDrawnNumbers()
          _gameStore.setClaiming(false)
        },
        "game.numberDrawn": (p) => {
          if (p.gameId === _gameStore.game.gameId && p.roomId === _roomStore.room?.id) {
            _gameStore.addDrawnNumber(p.number)
            _gameStore.setCurrentDrawnNumber(p.number)
          }
        },
        "game.winnerDeclared": (p) => {
          _gameStore.setWinner(p.winner)
          _gameStore.updateStatus(GameStatus.COMPLETED)
          _gameStore.setEnded(true)
        },
        "game.ended": (p) => {
          if (p.gameId === _gameStore.game.gameId) {
            _gameStore.setWinner(p)
            router.push(`/${i18n.language}/rooms/${roomId}`)
            _gameStore.resetGameState()
            _gameStore.setClaiming(false)
          }
        },
        // "game.countdown": (p) => _gameStore.setCountdownWithEndTime(p.countdownEndTime),
        "game.countdown": (p) => _gameStore.setCountdown(p.countdownEndTime),
        "room.serverGameState": (p) => {
          _gameStore.resetGameState()
          if (p.success && p.gameState) {
            p.gameState.allCardIds = p.gameState.currentCardPool?.map((c: any) => c.cardId) || []
            _gameStore.setGameState(p.gameState)
          }
        },
        "game.state": (p) => {
          _gameStore.resetGameState()
          if (p.gameState) _gameStore.setGameState(p.gameState)
        },
        "game.initialized": (p) => {
          _gameStore.resetGameState()
          _gameStore.setGameState(p.gameState)
        },
        "game.notEnoughPlayers": (p) => {
          if (_gameStore.game.roomId === p.roomId) {
            _gameStore.updateStatus(p.status as GameStatus)
            _gameStore.setPlayersCount(p.joinedPlayers.length)
            _gameStore.setJoinedPlayers(p.joinedPlayers)
          }
        },
        "error": (p) => {
          if (p.eventType === "bingo.claim") {
            _gameStore.setClaimError(p)
            _gameStore.setClaiming(false)
          } else if (p.eventType === "game.playerJoinRequest") {
              _gameStore.setJoinError(p.message);

              // Handle failed cards properly
              if (p.failedCards && Array.isArray(p.failedCards)) {
                p.failedCards.forEach((cardId: string) => {
                  _gameStore.releaseCardOptimistically(cardId);
                });
              }

              router.replace(`/${i18n.language}/rooms/${roomId}`);
            }
          else if (p.eventType === "game.playerLeaveRequest") {
            _gameStore.resetGameState()
            _roomStore.resetRoom()
            _gameStore.setJoining(false)
            router.replace(`/${i18n.language}`)
          }
        },
      }

      const handler = handlers[message.type]
      if (handler) handler(message.payload)
      else console.warn("Unhandled message type:", message.type)
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  }, [disconnect, roomId, router, user])

  const connect = useCallback(() => {
    if (!enabled || maxAttemptsReachedRef.current || hasConnectedRef.current) return

    hasConnectedRef.current = true
    setSocketState((prev) => ({ ...prev, connecting: true, error: null }))

    try {
      const WS_API_BASE = process.env.NEXT_PUBLIC_WS_URL!
      const wsUrl = `${WS_API_BASE}/ws/game?roomId=${roomId}&initData=${encodeURIComponent(initData ?? "")}`

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("WebSocket connected to room:", roomId)
        reconnectAttemptsRef.current = 0
        maxAttemptsReachedRef.current = false
        setSocketState((prev) => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
          reconnectAttempts: 0,
        }))
        roomStoreRef.current.setConnected(true)
        startHeartbeat()
      }

      ws.onmessage = handleMessage

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason)
        setSocketState((prev) => ({ ...prev, connected: false, connecting: false }))
        roomStoreRef.current.setConnected(false)
        stopHeartbeat()

        if (
          event.code !== 1000 &&
          enabled &&
          reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS &&
          !maxAttemptsReachedRef.current
        ) {
          const currentAttempts = reconnectAttemptsRef.current
          const delay = getReconnectDelay(currentAttempts)
          console.log(`Reconnecting in ${delay}ms (attempt ${currentAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`)
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1
            setSocketState((prev) => ({
              ...prev,
              reconnectAttempts: reconnectAttemptsRef.current,
            }))
            if (initData) connect()
          }, delay)
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          maxAttemptsReachedRef.current = true
          setSocketState((prev) => ({
            ...prev,
            error: "Unable to connect",
          }))
          console.log("Max reconnection attempts reached - stopping reconnection")
        }
      }

      ws.onerror = (event) => {
        console.error("WebSocket error:", event)
        setSocketState((prev) => ({
          ...prev,
          error: "WebSocket connection failed",
          connecting: false,
        }))
      }
    } catch (error) {
      console.error("Failed to create WebSocket:", error)
      setSocketState((prev) => ({
        ...prev,
        error: "Failed to connect",
        connecting: false,
      }))
    }
  }, [enabled, roomId, handleMessage, startHeartbeat, stopHeartbeat, getReconnectDelay, initData])

  const reconnect = useCallback(() => {
    maxAttemptsReachedRef.current = false
    reconnectAttemptsRef.current = 0
    hasConnectedRef.current = false
    disconnect()
    if (initData) setTimeout(() => connect(), 100)
  }, [disconnect, connect, initData])

  useEffect(() => {
    if (!roomId) return
    if (enabled && initData) connect()
    return () => {
      stopHeartbeat()
      disconnect()
    }
  }, [enabled, initData, roomId])

  return {
    ...socketState,
    send,
    connect,
    disconnect,
    reconnect,
  }
}
