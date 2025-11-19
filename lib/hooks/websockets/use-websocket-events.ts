// "use client"

// import { useCallback } from "react"
// import { useRoomSocket } from "./use-room-socket"
// import type { BingoClaimRequestPayloadType } from "@/lib/types"
// import { useRoomStore } from "@/lib/stores/room-store"
// import { useGameStore } from "@/lib/stores/game-store"
// import { userStore } from "@/lib/stores/user-store"

// interface UseWebSocketEventsOptions {
//   roomId?: number
//   enabled?: boolean
// }

// export function useWebSocketEvents({ roomId, enabled = true }: UseWebSocketEventsOptions) {
//   // const socket = useRoomSocket({ roomId, enabled })
//   const {send, connect, connected, connecting, disconnect, reconnect, error, latencyMs, reconnectAttempts} = useRoomSocket({ roomId, enabled })
//   const { user } = userStore(state => state)


//   const capacity = useRoomStore((state) => state.room?.capacity);
//   const setJoining = useGameStore(state => state.setJoining)
//   const setClaiming = useGameStore(state => state.setClaiming)
//   // const selectCardOptimistically  = useGameStore(state => state.selectCard)
//   const addMarkedNumberToCard  = useGameStore(state => state.addMarkedNumberToCard)
//   const removeMarkedNumberFromCard  = useGameStore(state => state.removeMarkedNumberFromCard)
//   const userSelectedCardsIds = useGameStore(state => state.game.userSelectedCardsIds)

//   const enterRoom = useCallback(() => {
//     if (!roomId || !user?.id) return
//     send({
//       type: "room.getGameStateRequest",
//       payload: { roomId, playerId: user?.telegramId, capacity },
//     })

//   }, [roomId, user?.id, send])


//   const refreshGameState = useCallback(() => {
//     if (!roomId || !user?.id) return
//     send({
//       type: "room.getGameStateRequest",
//       payload: { roomId, playerId: user?.id, capacity },
//     })

//   }, [roomId, user?.id, capacity, send])


//   // Reset player state in backend
//   const resetPlayerStateInBackend = useCallback(
//     (gameId: number) => {
//       send({
//         type: "game.resetPlayerState",
//         payload: { gameId, playerId: user?.id },
//       })
//     },
//     [user?.id, send]
//   )

//   // Join Game
//   const joinGame = useCallback(
//     (gameId: number, fee: number) => {
//       setJoining(true)
//       send({
//         type: "game.playerJoinRequest",
//         payload: { gameId, fee, capacity, playerId: user?.telegramId, userSelectedCardsIds },
//       })
//     },
//     [roomId, send]
//   )

//   // Leave Game
//   const leaveGame = useCallback(
//     (gameId: number, playerId: string) => {

//       // router.replace(`/${i18n.language}/rooms/${roomId}`)
//       alert([gameId, playerId])
    
//       send({
//         type: "game.playerLeaveRequest",
//         payload: { gameId, playerId },
//       })
//     },
//     [roomId, send]
//   )

//   // Select Card
//   // const selectCard = useCallback(
//   //   (gameId: number, cardId: string) => {
//   //     // Optimistically update user selected card ids
//   //     selectCardOptimistically(cardId, user?.telegramId || 0);

//   // 
//   //     send({
//   //       type: "card.cardSelectRequest",
//   //       payload: { gameId, cardId },
//   //     })
//   //   },
//   //   [  // )

//   // Release Card
//   const releaseCard = useCallback(
//     (gameId: number, cardId: string) => {
//       send({
//         type: "card.cardReleaseRequest",
//         payload: { gameId, cardId },
//       })
//     }
//   , [send])


//   // Get Card
//   const getCardFromBackend = useCallback(
//     (cardId: string) => {
//       send({
//         type: "game.getCard",
//         payload: {cardId },
//       })
//     },
//     [send] )

//   // Mark Number
//   const markNumber = useCallback(
//     (gameId: number, cardId: string, number: number) => {
//       // Optimistically update marked numbers
//       addMarkedNumberToCard(cardId, number);

//       send({
//         type: "card.markNumberRequest",
//         payload: { gameId, cardId, number},
//       })
//     },
//     [user?.id, send]
//   )

//   // Unmark Number
//   const unmarkNumber = useCallback(
//     (gameId: number, cardId: string, number: number) => {
//       // Optimistically update marked numbers
//       removeMarkedNumberFromCard(cardId, number);

//       send({
//         type: "card.unmarkNumberRequest",
//         payload: { gameId, cardId, number },
//       })
//     },
//     [user?.id, send]
//   )

//   // Claim Bingo
//   const claimBingo = useCallback(
//     (request: BingoClaimRequestPayloadType) => {
//       setClaiming(true)
//       send({
//         type: "game.bingoClaimRequest",
//         payload: request,
//       })

//     }, [send])

//   return {
//     // Socket state
//     connected: connected,
//     connecting: connecting,
//     error: error,
//     latencyMs: latencyMs,
//     reconnectAttempts: reconnectAttempts,

//     // Socket actions
//     connect: connect,
//     disconnect: disconnect,
//     reconnect: reconnect,

//     // Game actions
//     enterRoom,
//     refreshGameState,
//     resetPlayerStateInBackend,
//     joinGame,
//     leaveGame,
//     // selectCard,
//     getCardFromBackend,
//     releaseCard,
//     markNumber,
//     unmarkNumber,
//     claimBingo,
//   }
// }

// ===========================================================

// "use client"

// import { useEffect, useCallback, useState, useRef } from "react"
// import { useRoomStore } from "@/lib/stores/room-store"
// import { useGameStore } from "@/lib/stores/game-store"
// import { userStore } from "@/lib/stores/user-store"
// import { type BingoClaimRequestPayloadType, type WSMessage, type WSEvent, GameStatus } from "@/lib/types"
// import { useRouter } from "next/navigation"
// import i18n from "@/i18n"

// interface UseWebSocketEventsOptions {
//   roomId?: number
//   enabled?: boolean
// }

// export function useWebSocketEvents({ roomId, enabled = true }: UseWebSocketEventsOptions) {
//   const { user } = userStore()
//   const roomStore = useRoomStore()
//   const gameStore = useGameStore()
//   const router = useRouter()
//   const capacity = roomStore.room?.capacity

//   const [connected, setConnected] = useState(false)
//   const [connecting, setConnecting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const wsRef = useRef<WebSocket | null>(null)
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
//   const reconnectAttemptsRef = useRef<number>(0)
//   const HEARTBEAT_INTERVAL = 30000
//   const MAX_RECONNECT_ATTEMPTS = 3
//   const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
//   const lastPingRef = useRef<number>(0)

//   // ---------------------- WebSocket helpers ----------------------

//   const send = useCallback(
//     (message: Partial<WSMessage>) => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         const fullMessage: WSMessage = {
//           type: message.type || "unknown",
//           payload: message.payload || {},
//         }
//         wsRef.current.send(JSON.stringify(fullMessage))
//         return true
//       }
//       return false
//     },
//     []
//   )

//   const startHeartbeat = useCallback(() => {
//     if (heartbeatRef.current) clearInterval(heartbeatRef.current)
//     heartbeatRef.current = setInterval(() => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         lastPingRef.current = Date.now()
//         send({ type: "ping" })
//       }
//     }, HEARTBEAT_INTERVAL)
//   }, [send])

//   const stopHeartbeat = useCallback(() => {
//     if (heartbeatRef.current) clearInterval(heartbeatRef.current)
//   }, [])

//   const handleMessage = useCallback(
//     (event: MessageEvent) => {
//       try {
//         const message: WSEvent = JSON.parse(event.data)

//         // pong -> latency tracking
//         if (message.type === "pong") {
//           const latency = Date.now() - lastPingRef.current
//           roomStore.setLatency(latency)
//           return
//         }

//         // -------------------- Handlers --------------------
//         const handlers: Record<string, (p: any) => void> = {
//           "game.playerJoined": (p) => {
//             gameStore.setJoinedPlayers(p.joinedPlayers)
//             gameStore.setPlayersCount(p.playersCount)
//             gameStore.addPlayerSelectedCards(p.playerSelectedCardIds, Number(p.playerId), user?.telegramId || 0)
//             if (user && p.joinedPlayers.includes(user.telegramId.toString()) && Number(p.playerId) === user.telegramId) {
//               router.push(`/${i18n.language}/rooms/${roomId}/game`)
//               gameStore.setCountdownTime(p.countdownEndTime, p.countdownDurationSeconds, p.status)
//               gameStore.setJoining(false)
//             }
//           },

//           "game.playerLeft": (p) => {
//             p.releasedCardsIds?.forEach((cardId: string) => gameStore.releaseCard(cardId))
//             if (user && user.telegramId === Number(p.playerId)) {
//               router.replace(`/${i18n.language}`)
//               gameStore.resetGameState()
//               roomStore.resetRoom()
//               disconnect()
//             } else {
//               gameStore.removePlayer(p.playerId)
//               gameStore.setPlayersCount(p.playersCount)
//               if (p.gameState) gameStore.setGameState(p.gameState)
//             }
//           },

//           "game.started": (p) => {
//             if (p.gameId !== gameStore.game.gameId) return
//             gameStore.updateStatus(GameStatus.PLAYING)
//             gameStore.setStarted(true)
//             gameStore.resetDrawnNumbers()
//             gameStore.setClaiming(false)
//           },

//           "game.numberDrawn": (p) => {
//             if (p.gameId === gameStore.game.gameId && p.roomId === roomStore.room?.id) {
//               gameStore.addDrawnNumber(p.number)
//               gameStore.setCurrentDrawnNumber(p.number)
//             }
//           },

//           "game.winnerDeclared": (p) => {
//             gameStore.setWinner(p.winner)
//             gameStore.updateStatus(GameStatus.COMPLETED)
//             gameStore.setEnded(true)
//           },

//           "game.ended": (p) => {
//             if (p.gameId === gameStore.game.gameId) {
//               gameStore.setWinner(p)
//               router.push(`/${i18n.language}/rooms/${roomId}`)
//               gameStore.resetGameState()
//               gameStore.setClaiming(false)
//             }
//           },

//           "game.countdown": (p) => {
//             gameStore.setCountdownTime(p.countdownEndTime, p.countdownDurationSeconds, GameStatus.COUNTDOWN)
//           },

//           "room.serverGameState": (p) => {
//             gameStore.resetGameState()
//             if (p.success && p.gameState) gameStore.setGameState(p.gameState)
//           },

//           "game.state": (p) => {
//             gameStore.resetGameState()
//             if (p.gameState) gameStore.setGameState(p.gameState)
//           },

//           "game.initialized": (p) => {
//             gameStore.resetGameState()
//             gameStore.setGameState(p.gameState)
//           },

//           "game.notEnoughPlayers": (p) => {
//             if (gameStore.game.roomId === p.roomId) {
//               gameStore.updateStatus(p.status)
//               gameStore.setPlayersCount(p.joinedPlayers.length)
//               gameStore.setJoinedPlayers(p.joinedPlayers)
//             }
//           },

//           "error": (p) => {
//             if (p.eventType === "bingo.claim") {
//               gameStore.setClaimError(p)
//               gameStore.setClaiming(false)
//             } else if (p.eventType === "game.playerJoinRequest") {
//               gameStore.setJoinError(p.message)
//               if (p.failedCards?.length) p.failedCards.forEach((id: string) => gameStore.releaseCardOptimistically(id))
//               router.replace(`/${i18n.language}/rooms/${roomId}`)
//             } else if (p.eventType === "game.playerLeaveRequest") {
//               gameStore.resetGameState()
//               roomStore.resetRoom()
//               gameStore.setJoining(false)
//               router.replace(`/${i18n.language}`)
//             }
//           },
//         }

//         const handler = handlers[message.type]
//         if (handler) handler(message.payload)
//       } catch (err) {
//         console.error("WebSocket parse error:", err)
//       }
//     },
//     [gameStore, roomStore, user, router, roomId]
//   )

//   const connect = useCallback(() => {
//     if (!enabled || wsRef.current) return

//     setConnecting(true)
//     setError(null)

//     const WS_API_BASE = process.env.NEXT_PUBLIC_WS_URL!
//     const ws = new WebSocket(`${WS_API_BASE}/ws/game?roomId=${roomId}&initData=${encodeURIComponent(user?.telegramId || "")}`)
//     wsRef.current = ws

//     ws.onopen = () => {
//       console.log("WebSocket connected:", roomId)
//       setConnected(true)
//       setConnecting(false)
//       reconnectAttemptsRef.current = 0
//       startHeartbeat()
//       // Automatically enter room when connected
//       if (roomId && user?.id) send({ type: "room.getGameStateRequest", payload: { roomId, playerId: user?.telegramId, capacity } })
//     }

//     ws.onmessage = handleMessage

//     ws.onclose = (event) => {
//       console.log("WebSocket closed:", event.code, event.reason)
//       setConnected(false)
//       setConnecting(false)
//       stopHeartbeat()
//       wsRef.current = null

//       if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
//         const delay = 2000 * (reconnectAttemptsRef.current + 1)
//         reconnectTimeoutRef.current = setTimeout(() => {
//           reconnectAttemptsRef.current++
//           connect()
//         }, delay)
//       } else {
//         setError("Unable to connect")
//       }
//     }

//     ws.onerror = (event) => {
//       console.error("WebSocket error:", event)
//       setError("WebSocket connection failed")
//       setConnecting(false)
//     }
//   }, [enabled, roomId, send, user?.id, user?.telegramId, capacity, startHeartbeat, stopHeartbeat, handleMessage])

//   const disconnect = useCallback(() => {
//     if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
//     stopHeartbeat()
//     wsRef.current?.close(1000, "Manual disconnect")
//     wsRef.current = null
//     setConnected(false)
//     setConnecting(false)
//   }, [stopHeartbeat])

//   const reconnect = useCallback(() => {
//     disconnect()
//     reconnectAttemptsRef.current = 0
//     connect()
//   }, [disconnect, connect])

//   // ---------------------- Game actions ----------------------
//   const enterRoomCb = useCallback(() => {
//     if (!roomId || !user?.id) return
//     send({ type: "room.getGameStateRequest", payload: { roomId, playerId: user.telegramId, capacity } })
//   }, [roomId, user?.id, send, capacity])

//   const joinGame = useCallback(
//     (gameId: number, fee: number, userSelectedCardsIds?: string[]) => {
//       gameStore.setJoining(true)
//       send({ type: "game.playerJoinRequest", payload: { gameId, fee, capacity, playerId: user?.telegramId, userSelectedCardsIds } })
//     },
//     [send, gameStore, capacity, user?.telegramId]
//   )

//   const leaveGame = useCallback(
//     (gameId: number, playerId: string) => send({ type: "game.playerLeaveRequest", payload: { gameId, playerId } }),
//     [send]
//   )

//   const markNumber = useCallback(
//     (gameId: number, cardId: string, number: number) => {
//       gameStore.addMarkedNumberToCard(cardId, number)
//       send({ type: "card.markNumberRequest", payload: { gameId, cardId, number } })
//     },
//     [send, gameStore]
//   )

//   const unmarkNumber = useCallback(
//     (gameId: number, cardId: string, number: number) => {
//       gameStore.removeMarkedNumberFromCard(cardId, number)
//       send({ type: "card.unmarkNumberRequest", payload: { gameId, cardId, number } })
//     },
//     [send, gameStore]
//   )

//   const claimBingo = useCallback(
//     (request: BingoClaimRequestPayloadType) => {
//       gameStore.setClaiming(true)
//       send({ type: "game.bingoClaimRequest", payload: request })
//     },
//     [send, gameStore]
//   )

//   const getCardFromBackend = useCallback((cardId: string) => send({ type: "game.getCard", payload: { cardId } }), [send])
//   const releaseCard = useCallback((gameId: number, cardId: string) => send({ type: "card.cardReleaseRequest", payload: { gameId, cardId } }), [send])

//   // ---------------------- Lifecycle ----------------------
//   useEffect(() => {
//     if (!enabled) return
//     connect()
//     return () => disconnect()
//   }, [connect, disconnect, enabled])

//   return {
//     connected,
//     connecting,
//     error,
//     send,
//     connect,
//     disconnect,
//     reconnect,
//     enterRoom: enterRoomCb,
//     joinGame,
//     leaveGame,
//     markNumber,
//     unmarkNumber,
//     claimBingo,
//     getCardFromBackend,
//     releaseCard,
//   }
// }
