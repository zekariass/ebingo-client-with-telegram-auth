"use client"

import { useCallback } from "react"
import { useRoomSocket } from "./use-room-socket"
import type { BingoClaimRequestPayloadType } from "@/lib/types"
import { useRoomStore } from "@/lib/stores/room-store"
import { useGameStore } from "@/lib/stores/game-store"
import { userStore } from "@/lib/stores/user-store"
import { useRouter } from "next/navigation"

interface UseWebSocketEventsOptions {
  roomId?: number
  enabled?: boolean
}

export function useWebSocketEvents({ roomId, enabled = true }: UseWebSocketEventsOptions) {
  const socket = useRoomSocket({ roomId, enabled })
  const { user } = userStore(state => state)

  const capacity = useRoomStore((state) => state.room?.capacity);
  const setJoining = useGameStore(state => state.setJoining)
  const setClaiming = useGameStore(state => state.setClaiming)
  const selectCardOptimistically  = useGameStore(state => state.selectCard)
  const addMarkedNumberToCard  = useGameStore(state => state.addMarkedNumberToCard)
  const removeMarkedNumberFromCard  = useGameStore(state => state.removeMarkedNumberFromCard)
  const userSelectedCardsIds = useGameStore(state => state.game.userSelectedCardsIds)

  const enterRoom = useCallback(() => {
    if (!socket || !roomId || !user?.id) return
    socket.send({
      type: "room.getGameStateRequest",
      payload: { roomId, playerId: user?.telegramId, capacity },
    })

  }, [roomId, user?.id])


  const refreshGameState = useCallback(() => {
    if (!socket || !roomId || !user?.id) return
    socket.send({
      type: "room.getGameStateRequest",
      payload: { roomId, playerId: user?.id, capacity },
    })

  }, [socket, roomId, user?.id, capacity])


  // Reset player state in backend
  const resetPlayerStateInBackend = useCallback(
    (gameId: number) => {
      if (!socket) return
      socket.send({
        type: "game.resetPlayerState",
        payload: { gameId, playerId: user?.id },
      })
    },
    [socket, user?.id]
  )

  // Join Game
  const joinGame = useCallback(
    (gameId: number, fee: number) => {
      if (!socket) return
      setJoining(true)
      socket.send({
        type: "game.playerJoinRequest",
        payload: { gameId, fee, capacity, playerId: user?.telegramId, userSelectedCardsIds },
      })
    },
    [socket, roomId]
  )

  // Leave Game
  const leaveGame = useCallback(
    (gameId: number, playerId: string) => {

      // router.replace(`/${i18n.language}/rooms/${roomId}`)
      if (!socket) return
    
      socket.send({
        type: "game.playerLeaveRequest",
        payload: { gameId, playerId },
      })
    },
    [socket, roomId]
  )

  // Select Card
  const selectCard = useCallback(
    (gameId: number, cardId: string) => {
      // Optimistically update user selected card ids
      selectCardOptimistically(cardId, user?.telegramId || 0);

      if (!socket) return
      socket.send({
        type: "card.cardSelectRequest",
        payload: { gameId, cardId },
      })
    },
    [socket]
  )

  // Release Card
  const releaseCard = useCallback(
    (gameId: number, cardId: string) => {
      if (!socket) return
      socket.send({
        type: "card.cardReleaseRequest",
        payload: { gameId, cardId },
      })
    },
    [socket]
  )

  // Mark Number
  const markNumber = useCallback(
    (gameId: number, cardId: string, number: number) => {
      if (!socket) return
      // Optimistically update marked numbers
      addMarkedNumberToCard(cardId, number);

      socket.send({
        type: "card.markNumberRequest",
        payload: { gameId, cardId, number},
      })
    },
    [socket, user?.id]
  )

  // Unmark Number
  const unmarkNumber = useCallback(
    (gameId: number, cardId: string, number: number) => {
      if (!socket) return
      // Optimistically update marked numbers
      removeMarkedNumberFromCard(cardId, number);

      socket.send({
        type: "card.unmarkNumberRequest",
        payload: { gameId, cardId, number },
      })
    },
    [socket, user?.id]
  )

  // Claim Bingo
  const claimBingo = useCallback(
    (request: BingoClaimRequestPayloadType) => {
      setClaiming(true)
      if (!socket) return
      socket.send({
        type: "game.bingoClaimRequest",
        payload: request,
      })

    },
    [socket]
  )

  return {
    // Socket state
    connected: socket.connected,
    connecting: socket.connecting,
    error: socket.error,
    latencyMs: socket.latencyMs,
    reconnectAttempts: socket.reconnectAttempts,

    // Socket actions
    connect: socket.connect,
    disconnect: socket.disconnect,
    reconnect: socket.reconnect,

    // Game actions
    enterRoom,
    refreshGameState,
    resetPlayerStateInBackend,
    joinGame,
    leaveGame,
    selectCard,
    releaseCard,
    markNumber,
    unmarkNumber,
    claimBingo,
  }
}
