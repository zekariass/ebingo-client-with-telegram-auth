import { create } from "zustand"
import { GamePattern, GameStatus as Status } from "@/lib/types"
import type { GameState, GameStatus, CardInfo, GameWinner, WSPayload, ClaimError } from "@/lib/types"
import { userStore } from "./user-store";

interface GameStore {
  game: GameState
  winner: GameWinner
  error: string | null
  claimError: ClaimError | null
  claiming: boolean

  // Actions
  setGameState: (game: Partial<GameState>) => void
  resetGameState: () => void
  getGameState: () => Promise<GameState | null>
  addPlayer: (playerId: string) => void
  setJoinedPlayers: (joindPlayers: string[]) => void
  removePlayer: (playerId: string) => void
  setPlayersCount: (count: number) => void
  addDrawnNumber: (number: number) => void
  resetDrawnNumbers: () => void
  setCurrentDrawnNumber: (number: number) => void
  addDisqualifiedPlayer: (userId: number) => void
  setAmIDisqualified: (disqualified: boolean) => void
  addCard: (card: CardInfo) => void
  selectCard: (cardId: string, userId: number) => void
  releaseCard: (cardId: string) => void
  setAllPlayerSelectedCardIds: (cardIds: string[]) => void
  setAllCardIds: (cardIds: string[]) => void
  addMarkedNumberToCard: (cardId: string, number: number) => void
  setMarkedNumbersForACard: (cardId: string, numbers: number[]) => void
  removeMarkedNumberFromCard: (cardId: string, number: number) => void
  computePlayerCardsFromPlayerCardsIds: () => void,
  getCurrentCardById: (cardId: string) => CardInfo | null
  stopDrawing: () => void
  // joinGame: () => void,
  setStarted: (started: boolean) => void
  setEnded: (ended: boolean) => void
  updateStatus: (status: GameStatus) => void
  // claimBingo: (gameId: number, markedNumbers: number[]) => void
  handleBingoClaimResponse: (payload: WSPayload) => void
  setCountdownWithEndTime: (endTime: string) => void
  setWinner: (winner: GameWinner) => void
  resetWinner: () => void
  setError: (error: string | null) => void
  setClaimError: (error: ClaimError) => void
  resetClaimError: () => void
  setClaiming: (value: boolean) => void
  
}

const initialGameState: GameState = {
  gameId: 0,
  roomId: 0,
  joinedPlayers: [],
  playersCount: 0,
  drawnNumbers: [],
  currentDrawnNumber: undefined,
  disqualifiedUsers: [],
  amIDisqualified: false,
  currentCardPool: [],
  userSelectedCardsIds: [],
  userSelectedCards: [],
  allSelectedCardsIds: [],
  allCardIds: [],
  started: false,
  ended: false,
  status: Status.READY,
  stopNumberDrawing: false,
  countdownEndTime: "",
  loading: false
}

const initialWinnerState: GameWinner ={
  gameId: -1,
  playerId: "", 
  playerName: "",
  cardId: "",
  pattern: GamePattern.LINE_AND_CORNERS,
  prizeAmount: 0,
  winAt: "",
  hasWinner: false,
}

const maxCards = 2

export const useGameStore = create<GameStore>()(
  // persist(
    (set, get) => ({
      game: initialGameState,
      winner: initialWinnerState,
      error: null,
      claimError: null,
      claiming: false,

      setGameState: (game) =>
        set((state) => ({ game: { ...state.game, ...game } })),

      resetGameState: () => set({ game: { ...initialGameState } }),

      getGameState: async () => {
        try {
          const response = await fetch(`/api/game/${get().game.roomId}/state`)
          if (!response.ok) {
            throw new Error(`Error fetching game state: ${response.statusText}`)
          }
          const data = await response.json()
          set({ game: data })
          return data
        } catch (error) {
          console.error("Failed to fetch game state:", error)
          return null
        }
      },

      computePlayerCardsFromPlayerCardsIds: () =>
        set((state) => {
          const { currentCardPool, userSelectedCardsIds } = state.game;

          console.log("====================currentCardPool============: ", currentCardPool)

          return {
            game: {
              ...state.game,
              userSelectedCards: currentCardPool.filter(card =>
                userSelectedCardsIds.includes(card.cardId)
              ),
            },
          };
        }),


      addPlayer: (playerId) =>
        set((state) => {
          if (state.game.joinedPlayers.includes(playerId)) return state
          return {
            game: {
              ...state.game,
              joinedPlayers: [...state.game.joinedPlayers, playerId],
            },
          }
        }),

        setJoinedPlayers: (newJoinedPlayers) => 
          set((state) => {
            return {
              game: {
                ...state.game,
                joinedPlayers: newJoinedPlayers
              }
            }
          }),

      removePlayer: (playerId) =>
        set((state) => ({
          game: {
            ...state.game,
            joinedPlayers: state.game.joinedPlayers.filter((id) => id !== playerId),
          },
        })),

      setPlayersCount: (count) =>
        set((state) => ({
          game: { ...state.game, playersCount: count },
        })),

      addDrawnNumber: (number) =>
        set((state) => ({
          game: {
            ...state.game,
            drawnNumbers: [...state.game.drawnNumbers, number],
          },
        })),

      setCurrentDrawnNumber: (number) =>
        set((state) => ({
          game: { ...state.game, currentDrawnNumber: number },
        })),

      resetDrawnNumbers: () =>
        set((state) => ({
          game: { ...state.game, drawnNumbers: [] },
        })),

      addDisqualifiedPlayer: (userId) =>
        set((state) => {
          if (state.game.disqualifiedUsers.includes(userId)) return state
          return {
            game: {
              ...state.game,
              disqualifiedUsers: [...state.game.disqualifiedUsers, userId],
            },
          }
        }),

      setAmIDisqualified: (disqualified) =>
        set((state) => ({
          game: { ...state.game, amIDisqualified: disqualified },
        })),

      addCard: (card) =>
        set((state) => ({
          game: {
            ...state.game,
            currentCardPool: [...state.game.currentCardPool, card],
          },
        })),

      selectCard: (cardId, userId) => {
        const { user: currentUser } = userStore.getState() // better than calling userStore() directly

        if (!currentUser) return

        set((state) => {
          const { game } = state

          // Already selected? Do nothing
          if (game.userSelectedCardsIds.includes(cardId)) return state

          // Enforce max cards only for the current user
          if (
            userId === currentUser.telegramId &&
            game.userSelectedCardsIds.length >= maxCards
          ) {
            return state
          }

          // Always update all selected IDs
          const newAllSelectedIds = Array.from(
            new Set([...game.allSelectedCardsIds, cardId])
          )

          // Default safe values
          let newUserSelectedIds = game.userSelectedCardsIds
          let newUserSelectedCards = game.userSelectedCards

          // If the action is from the current user, update their selections
          if (userId === currentUser.telegramId) {
            newUserSelectedIds = Array.from(
              new Set([...game.userSelectedCardsIds, cardId])
            )

            newUserSelectedCards = game.currentCardPool.filter((card) =>
              newUserSelectedIds.includes(card.cardId)
            )

            // console.log("=======================>>SELECTED CARDS============>>>: ", game.allCardIds.length)
          }

          return {
            game: {
              ...game,
              userSelectedCardsIds: newUserSelectedIds,
              allSelectedCardsIds: newAllSelectedIds,
              userSelectedCards: newUserSelectedCards,
            },
          }
        })
      },

      releaseCard: (cardId) =>
        set((state) => {
          
          const { game } = state
          const newUserSelectedIds = game.userSelectedCardsIds.filter(
            (id) => id !== cardId,
          )
          const newAllSelectedIds = game.allSelectedCardsIds.filter(
            (id) => id !== cardId,
          )
          const newUserSelectedCards = game.userSelectedCards.filter(
            (card) => card.cardId !== cardId,
          )

          return {
            game: {
              ...game,
              userSelectedCardsIds: newUserSelectedIds,
              allSelectedCardsIds: newAllSelectedIds,
              userSelectedCards: newUserSelectedCards,
            },
          }
        }),

      setAllPlayerSelectedCardIds: (cardIds) =>
        set((state) => ({
          game: { ...state.game, allSelectedCardsIds: [...new Set(cardIds)] },
        })),

      setAllCardIds: (cardIds) =>
        set((state) => ({
          game: { ...state.game, allCardIds: [...new Set(cardIds)] },
        })),

    addMarkedNumberToCard: (cardId, number) =>
      set((state) => ({
        game: {
          ...state.game,
          userSelectedCards:
            state.game.userSelectedCards?.map((card) => {
              if (card.cardId !== cardId) return card
              console.log("=================>>> MARKED NUMBERS: ", card)
              if (card.marked?.includes(number)) return card
              return { ...card, marked: [...(card.marked ?? []), number] }
            }) || [],
        },
      })),


      setMarkedNumbersForACard: (cardId: string, numbers: number[] = []) =>
        set((state) => ({
          game: {
            ...state.game,
            userSelectedCards: (state.game.userSelectedCards ?? []).map((card) =>
              card.cardId === cardId
                ? { 
                    ...card, 
                    marked: Array.from(new Set([...(card.marked ?? []), ...numbers])) 
                  }
                : card
            ),
          },
        })),


      removeMarkedNumberFromCard: (cardId, number) =>
        set((state) => ({
          game: {
            ...state.game,
            userSelectedCards:
              state.game.userSelectedCards?.map((card) => {
                if (card.cardId !== cardId) return card
                return { ...card, marked: (card.marked ?? []).filter((n) => n !== number) }
              }) || [],
          },
        })),


      getCurrentCardById: (cardId: string) => {
        const { game } = get()
        const card = game.userSelectedCards?.find((c) => c.cardId === cardId) || null
        return card
      },

      setWinner: (winner) =>
        set((state) => ({
          game: {...state.game},
          winner: {...winner}
        })),

      resetWinner: () => 
        set((state)=>({
          game: {...state.game},
          error: state.error,
          winner: {...initialWinnerState}
        })),

      setStarted: (started) =>
        set((state) => ({
          game: {
            ...state.game,
            started,
            status: started ? Status.PLAYING : state.game.status,
          },
        })),

      setEnded: (ended) =>
        set((state) => ({
          game: {
            ...state.game,
            ended,
            status: ended ? Status.COMPLETED : state.game.status,
          },
        })),

        // claimBingo: (gameId: number, markedNumbers: number[]) =>

      handleBingoClaimResponse: (payload) => {
        if (!payload.success && payload.reason) {
          set((state) => ({
            game: {
              ...state.game,
              disqualifiedUsers: [
                ...state.game.disqualifiedUsers,
                payload.playerId,
              ],
              amIDisqualified: true,
            },
          }))
          console.warn("Bingo claim unsuccessful:", payload.reason)
        }
      },

      setCountdownWithEndTime: (countdownEndTime) =>
        set((state) => ({
          game: {
            ...state.game,
            countdownEndTime: countdownEndTime,
            status: countdownEndTime ? Status.COUNTDOWN : state.game.status,
          },
        })),

      setClaimError: (error: ClaimError) => set((state) => ({
        claimError: error? {...error}: null
      })),

      resetClaimError: () => set((state) => ({
        claimError: null
      })),

      setError: (error) => set({ error }),

    setClaiming: (value: boolean) =>
      set({ claiming: value }),

      updateStatus: (status) =>
        set((state) => ({
          game: { ...state.game, status },
        })),

      stopDrawing: () =>
        set((state) => ({
          game: { ...state.game, stopNumberDrawing: true },
        })),
    }),
    // {
    //   name: "bingo-game-storage",
    //   partialize: (state) => ({ game: state.game }),
    // },
  )
// )
