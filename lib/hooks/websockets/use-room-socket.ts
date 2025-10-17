"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRoomStore } from "@/lib/stores/room-store"
import { GameStatus, type WSEvent, type WSMessage } from "@/lib/types"
import { useGameStore } from "@/lib/stores/game-store"
import { useRouter } from "next/navigation"
import i18n from "@/i18n"
import { userStore } from "@/lib/stores/user-store"
import { useTelegramInit } from "../use-telegram-init"


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

// const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL!
const MAX_RECONNECT_ATTEMPTS = 3
const INITIAL_RECONNECT_DELAY = 2000
const MAX_RECONNECT_DELAY = 10000
const HEARTBEAT_INTERVAL = 30000

export function useRoomSocket({ roomId, enabled = true }: UseRoomSocketOptions) {
  const roomStore = useRoomStore()
  const gameStore = useGameStore()
  // const { session, loading } = useSession()
  const {initData, user} = userStore()
  // useTelegramInit();
  
  const router = useRouter();

  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Room Socket Hook - roomId:", roomId, "enabled:", enabled, "session:", session, "loading:", loading)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastPingRef = useRef<number>(0)
  const reconnectAttemptsRef = useRef<number>(0)
  const maxAttemptsReachedRef = useRef<boolean>(false)

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

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WSEvent = JSON.parse(event.data)
      const _roomStore = roomStoreRef.current
      const _gameStore = gameStoreRef.current

      if (message.type === "pong") {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Received pong message")
        const latency = Date.now() - lastPingRef.current
        setSocketState((prev) => ({ ...prev, latencyMs: latency }))
        _roomStore.setLatency(latency)
        return
      }

      switch (message.type) {
        case "game.playerJoined":
          // _gameStore.addPlayer(message.payload.playerId)
          _gameStore.setJoinedPlayers(message.payload.joinedPlayers)
          _gameStore.setPlayersCount(message.payload.playersCount)
          break
        case "game.playerLeft":

          if (message.payload.errorType === "gameStarted"){
            router.replace(`/${i18n.language}/rooms/${message.payload.roomId}`)
            break
          }

          _gameStore.removePlayer(message.payload.playerId)
          _gameStore.setPlayersCount(message.payload.playersCount)
          
          if (user && user.telegramId.toString() === message.payload.playerId){
            message.payload.releasedCardsIds?.map(cardId => 
             _gameStore.releaseCard(cardId))
            // _gameStore.resetGameState()
            router.replace(`/${i18n.language}/rooms/${message.payload.roomId}`)
          }
          
          break
        case "game.started":
          if (message.payload.gameId === gameStoreRef.current.game.gameId){
            _gameStore.updateStatus(GameStatus.PLAYING)
            _gameStore.setStarted(true)
            _gameStore.resetDrawnNumbers()
            _gameStore.setClaiming(false)
          }
          break
        case "game.numberDrawn":
          _gameStore.addDrawnNumber(message.payload.number)
          _gameStore.setCurrentDrawnNumber(message.payload.number)
          // console.log("========= DRAWN NUMBER ==============>>>: "+ message.payload.number)
          break
        case "game.bingoClaimResponse":
          _gameStore.handleBingoClaimResponse(message.payload)
          _gameStore.setClaiming(false)
          break
        case "game.winnerDeclared":
          _gameStore.setWinner(message.payload.winner)
          _gameStore.updateStatus(GameStatus.COMPLETED)
          _gameStore.setEnded(true)
          break
        case "game.countdown":
          _gameStore.setCountdownWithEndTime(message.payload.countdownEndTime)
          break
        case "game.ended":
          // _gameStore.setWinner(message.payload.winner)
          // _gameStore.updateStatus(GameStatus.COMPLETED)
          // _gameStore.setEnded(true)
          if (message.payload.gameId === gameStoreRef.current.game.gameId){
            _gameStore.setWinner(message.payload)
            _gameStore.resetGameState()
            router.replace(`/${i18n.language}/rooms/${roomId}`)
            _gameStore.setClaiming(false)

          }
          break
        case "game.cardSelected":
          // console.log("======================CARD SELECTED==============>>>: ", message.payload.cardId)
          _gameStore.selectCard(message.payload.cardId, message.payload.playerId)
          break
        case "game.cardReleased":
          _gameStore.releaseCard(message.payload.cardId)
          break
        case "room.serverGameState":
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  GAME STATE:", message.payload.gameState)
          _gameStore.resetGameState()
          if (message.payload.success && message.payload.gameState) {
            _gameStore.setGameState(message.payload.gameState)
          }
          break
        case "card.markNumberResponse":
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>  MARK NUMBER RESPONSE:", message.payload)
          _gameStore.setMarkedNumbersForACard(message.payload.cardId, message.payload.numbers)
          break
        case "card.unmarkNumberResponse":
          _gameStore.setMarkedNumbersForACard(message.payload.cardId, message.payload.numbers)
          break
        case "error":
          console.error("WebSocket Error:", message.payload)
          if (message.payload.eventType === "bingo.claim"){
            _gameStore.setClaimError(message.payload)
            _gameStore.setClaiming(false)
          }
          break
        default:
          console.warn("Unhandled WebSocket message type:", message.type)
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  }, [])

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
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

  const connect = useCallback(
    () => {
      if (!enabled || maxAttemptsReachedRef.current) return

      setSocketState((prev) => {
        if (prev.connecting) return prev
        return { ...prev, connecting: true, error: null }
      })

      try {

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Connecting to WebSocket... roomId:", roomId, "initData:", initData)

        const WS_API_BASE = process.env.NEXT_PUBLIC_WS_URL!
        // const wsUrl = `${WS_API_BASE}/game?roomId=${roomId}&initData=${encodeURIComponent(initData??"")}`


        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WebSocket URL:", wsUrl)

        const wsUrl = "wss://api.bingofam.com/ws/game?roomId=121&initData=query_id%3DAAHBmet0AAAAAMGZ63RnzwPp%26user%3D%257B%2522id%2522%253A1961597377%252C%2522first_name%2522%253A%2522Zekarias%2520Semegnew%2520Negese%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522Zemaedot%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F_wrmiZtgEBLImxe_kZYuNXx6J73fnb4U5BD7wePBlYs.svg%2522%257D%26auth_date%3D1760569648%26signature%3DDKKpSAl3yyO1lC3oYpIKZsan-_DFz-W_L1xUBKNduo_t7XZpUyPNPws4ggwFanxTssUF-6ksn_d9U3OFW-QbBg%26hash%3Deec0983e00076707ef42acd2cbca887664bedae14d6285ce2bb9cf8722d9ff64"
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
          setSocketState((prev) => ({
            ...prev,
            error: "Connection error2",
            connecting: false,
          }))
        }
      } catch (error) {
        console.error("Failed to create WebSocket:", error)
        setSocketState((prev) => ({
          ...prev,
          error: "Failed to connect2",
          connecting: false,
        }))
      }
    },
    [enabled, roomId, handleMessage, startHeartbeat, stopHeartbeat, send, getReconnectDelay, initData]
  )

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

  const reconnect = useCallback(() => {
    maxAttemptsReachedRef.current = false
    reconnectAttemptsRef.current = 0
    disconnect()
    if (initData) {
      setTimeout(() => connect(), 100)
    }
  }, [disconnect, connect, initData])

  useEffect(() => {
    if (enabled && initData ) {
      connect()
    }
    return () => {
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