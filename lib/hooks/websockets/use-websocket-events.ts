"use client"

import { useCallback } from "react"
import { useRoomSocket } from "./use-room-socket"
import type { BingoClaimRequestPayloadType } from "@/lib/types"
import { useRoomStore } from "@/lib/stores/room-store"
import { useGameStore } from "@/lib/stores/game-store"
import { userStore } from "@/lib/stores/user-store"

interface UseWebSocketEventsOptions {
  roomId?: number
  enabled?: boolean
}

export function useWebSocketEvents({ roomId, enabled = true }: UseWebSocketEventsOptions) {
  const socket = useRoomSocket({ roomId, enabled })
  // const { data } = useUserProfile()
  // const { session, user } = useSession()
  const { user } = userStore(state => state)

  const capacity = useRoomStore((state) => state.room?.capacity);
  const setClaiming = useGameStore(state => state.setClaiming)


  const enterRoom = useCallback(() => {
    if (!socket || !roomId || !user?.id) return
    // console.log("=========================>>>>>: CAPACITY: ", capacity)
    socket.send({
      type: "room.getGameStateRequest",
      payload: { roomId, playerId: user?.id, capacity },
    })

  }, [roomId, user?.id])


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
      socket.send({
        type: "game.playerJoinRequest",
        payload: { gameId, fee, capacity },
      })
    },
    [socket, roomId]
  )

  // ✅ Leave Game
  const leaveGame = useCallback(
    (gameId: number, playerId: string) => {
      if (!socket) return
      socket.send({
        type: "game.playerLeaveRequest",
        payload: { gameId },
      })
    },
    [socket, roomId]
  )

  // ✅ Select Card
  const selectCard = useCallback(
    (gameId: number, cardId: string) => {
      if (!socket) return
      socket.send({
        type: "card.cardSelectRequest",
        payload: { gameId, cardId },
      })
    },
    [socket]
  )

  // ✅ Release Card
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

  // ✅ Mark Number
  const markNumber = useCallback(
    (gameId: number, cardId: string, number: number) => {
      if (!socket) return
      socket.send({
        type: "card.markNumberRequest",
        payload: { gameId, cardId, number},
      })
    },
    [socket, user?.id]
  )

  // ✅ Unmark Number
  const unmarkNumber = useCallback(
    (gameId: number, cardId: string, number: number) => {
      if (!socket) return
      socket.send({
        type: "card.unmarkNumberRequest",
        payload: { gameId, cardId, number },
      })
    },
    [socket, user?.id]
  )

  // ✅ Claim Bingo
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
