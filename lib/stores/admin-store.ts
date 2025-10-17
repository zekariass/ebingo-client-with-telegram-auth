import { create } from "zustand"
import { RoomFormData } from "../schemas/admin-schemas"
import i18n from "@/i18n"
import { Transaction, TransactionStatus, TransactionType } from "../types"
import { userStore } from "./user-store"

interface AdminStats {
  activePlayers: number
  playersToday: number
  revenueToday: number
  revenueGrowth: number
  activeGames: number
  gamesCompleted: number
  avgGameDuration: number
}

interface ActiveRoom {
  id: string
  name: string
  players: number
  capacity: number
  fee: number
  status: "active" | "waiting" | "finished"
  gameStatus: "waiting" | "playing" | "finished"
}

// interface Room {
//   id: string
//   name: string
//   fee: number
//   capacity: number
//   players: number
//   minPlayers: number,
//   status: "OPEN" | "GAME_READY" | "GAME_STARTED" | "CLOSED"
//   gameStatus: "waiting" | "playing" | "finished"
//   pattern: string
// }

export type Room = {
  id: number;                  // Long -> number
  name: string;
  capacity: number;             // Integer -> number
  minPlayers: number;           // Integer -> number
  entryFee: number;             // BigDecimal -> number
  pattern: "LINE" | "LINE_AND_CORNERS" | "CORNERS" | "FULL_HOUSE"; // match RoomPattern enum
  status: "OPEN" | "CLOSED";     // match RoomStatus enum
  createdBy: number;            // Long -> number
  createdAt: string;            // LocalDateTime -> ISO string
  updatedAt: string;            // LocalDateTime -> ISO string
};


interface Game {
  id: string
  roomName: string
  status: "waiting" | "playing" | "finished"
  numbersCalledCount: number
}

interface Player {
  id: string
  name: string
  email: string
  status: "active" | "banned"
  balance: number
  gamesPlayed: number
  winRate: number
}

interface Analytics {
  totalRevenue: number
  revenueGrowth: number
  totalPlayers: number
  playerGrowth: number
  gamesPlayed: number
  gamesDecline: number
  avgPrizePool: number
  prizePoolGrowth: number
  revenueByTier: Array<{
    fee: number
    games: number
    revenue: number
    percentage: number
  }>
  popularPatterns: Array<{
    name: string
    games: number
    percentage: number
  }>
}

interface AdminStore {
  // Dashboard data
  stats: AdminStats
  activeRooms: ActiveRoom[]
  deposits: Transaction[]
  withdrawals: Transaction[]
  systemStatus: "healthy" | "warning" | "error"
  notifications: number

  // Room management
  rooms: Room[]

  // Game control
  activeGames: Game[]

  // Player management
  players: Player[]

  // Analytics
  analytics: Analytics

  // Loading states
  isLoading: boolean
  error: string | null

  // Actions
  loadDashboardData: () => Promise<void>
  refreshData: () => Promise<void>
  createRoom: (room: RoomFormData) => Promise<void>
  updateRoom: (id: string, updates: Partial<Room>) => Promise<void>
  deleteRoom: (id: number) => Promise<void>
  // retrieveRooms: () => Promise<Room[]>
  // controlGame: (gameId: string, action: string, data?: any) => Promise<void>
  banPlayer: (playerId: string) => Promise<void>
  unbanPlayer: (playerId: string) => Promise<void>
  loadRooms: () => Promise<void>
  // loadPlayers: (search?: string) => Promise<void>
  // loadGames: () => Promise<void>
  // loadAnalytics: () => Promise<void>

  // Transactions
  changeTransactionStatus: (txnRef: string, status: TransactionStatus) => Promise<void>
  updateTransaction: (txn: Transaction) => void
  getTransactions: (
    staus: TransactionStatus, 
    type: TransactionType, 
    page: number,
    size: number,
    sortBy: string
  ) => Promise<void>

  
}

export const useAdminStore = create<AdminStore>((set, get) => ({


  // Initial state
  stats: {
    activePlayers: 247,
    playersToday: 89,
    revenueToday: 12450,
    revenueGrowth: 15.2,
    activeGames: 12,
    gamesCompleted: 156,
    avgGameDuration: 18,
  },

  activeRooms: [],
  withdrawals: [],
  deposits: [],
  systemStatus: "healthy",
  notifications: 3,
  rooms: [],
  activeGames: [],
  players: [],
  analytics: {
    totalRevenue: 125450,
    revenueGrowth: 15.2,
    totalPlayers: 2847,
    playerGrowth: 8.5,
    gamesPlayed: 1256,
    gamesDecline: 2.1,
    avgPrizePool: 450,
    prizePoolGrowth: 12.3,
    revenueByTier: [
      { fee: 10, games: 450, revenue: 4500, percentage: 35 },
      { fee: 20, games: 320, revenue: 6400, percentage: 28 },
      { fee: 50, games: 180, revenue: 9000, percentage: 25 },
      { fee: 100, games: 85, revenue: 8500, percentage: 12 },
    ],
    popularPatterns: [
      { name: "Line", games: 456, percentage: 45 },
      { name: "Full House", games: 234, percentage: 23 },
      { name: "Four Corners", games: 178, percentage: 18 },
      { name: "X Pattern", games: 145, percentage: 14 },
    ],
  },

  // Loading states
  isLoading: false,
  error: null,

  // Actions
  loadDashboardData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/admin/stats")
      const result = await response.json()

      if (result.success) {
        set({ stats: result.data })
      } else {
        set({ error: result.error })
      }
    } catch (error) {
      set({ error: "Failed to load dashboard data" })
    } finally {
      set({ isLoading: false })
    }
  },

  refreshData: async () => {
    const { loadDashboardData, loadRooms } = get()
    await Promise.all([loadDashboardData(), loadRooms()])
  },

  createRoom: async (roomData) => {
    const { user, initData } = userStore.getState();
    const role = user?.role;

    set({ isLoading: true, error: null });

    try {
      if (!role || role !== "ADMIN") {
        set({ error: "Access denied: Admins only", isLoading: false });
        return;
      }

      if (!initData) {
        set({ error: "Missing Telegram initData", isLoading: false });
        return;
      }

      const response = await fetch(`/${i18n.language}/api/admin/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": role,
          "x-init-data": initData,
        },
        body: JSON.stringify(roomData),
      });

      const result = await response.json();

      if (result.success) {
        const { loadRooms } = get();
        await loadRooms(); // refresh room list
      } else {
        set({ error: result.error || "Failed to create room" });
      }
    } catch (error) {
      console.error("Error creating room:", error);
      set({ error: "Failed to create room" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateRoom: async (id, updates) => {
    const { user, initData} = userStore.getState();
    const role = user?.role;

    set({ isLoading: true, error: null });

    try {
      if (!role || role !== "ADMIN") {
        set({ error: "Access denied: Admins only", isLoading: false });
        return;
      }

      if (!initData) {
        set({ error: "Missing Telegram initData", isLoading: false });
        return;
      }

      const response = await fetch(`/${i18n.language}/api/admin/rooms/${id}`, {
        method: "PUT",
        headers: {
          // "Content-Type": "application/json",
          "x-user-role": role,
          "x-init-data": initData,
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (result.success) {
        const { loadRooms } = get();
        await loadRooms();
      } else {
        set({ error: result.error || "Failed to update room" });
      }
    } catch (error) {
      console.error("Error updating room:", error);
      set({ error: "Failed to update room" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRoom: async (id) => {
    const { user, initData } = userStore.getState();
    const role = user?.role;

    set({ isLoading: true, error: null });

    try {
      if (!role || role !== "ADMIN") {
        set({ error: "Access denied: Admins only", isLoading: false });
        return;
      }

      if (!initData) {
        set({ error: "Missing Telegram initData", isLoading: false });
        return;
      }

      const response = await fetch(`/${i18n.language}/api/admin/rooms/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-role": role,
          "x-init-data": initData,
        },
      });

      const result = await response.json();

      if (result.success) {
        const { loadRooms } = get();
        await loadRooms();
      } else {
        set({ error: result.error || "Failed to delete room" });
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      set({ error: "Failed to delete room" });
    } finally {
      set({ isLoading: false });
    }
  },

  loadRooms: async () => {
    const { user, initData } = userStore.getState(); // ✅ get user data from userStore
    const role = user?.role;

    set({ isLoading: true, error: null });

    try {
      if (!role || role !== "ADMIN") {
        set({ error: "Access denied: Admins only", isLoading: false });
        return;
      }

      if (!initData) {
        set({ error: "Missing Telegram initData", isLoading: false });
        return;
      }

      const response = await fetch(`/${i18n.language}/api/admin/rooms`, {
        headers: {
          "x-user-role": role,
          "x-init-data": initData,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (result.success) {
        set({ rooms: result.data });
      } else {
        set({ error: result.error || "Failed to load rooms" });
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
      set({ error: "Failed to load rooms" });
    } finally {
      set({ isLoading: false });
    }
  },

  // controlGame: async (gameId, action, data) => {
  //   set({ isLoading: true, error: null })
  //   try {
  //     const response = await fetch(`/api/admin/games/${gameId}/control`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ action, data }),
  //     })

  //     const result = await response.json()

  //     if (result.success) {
  //       const { loadGames } = get()
  //       await loadGames()
  //     } else {
  //       set({ error: result.error })
  //     }
  //   } catch (error) {
  //     set({ error: "Failed to control game" })
  //   } finally {
  //     set({ isLoading: false })
  //   }
  // },

  banPlayer: async (playerId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/admin/players/${playerId}/ban`, {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        // const { loadPlayers } = get()
        // await loadPlayers()
      } else {
        set({ error: result.error })
      }
    } catch (error) {
      set({ error: "Failed to ban player" })
    } finally {
      set({ isLoading: false })
    }
  },

  unbanPlayer: async (playerId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/admin/players/${playerId}/unban`, {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        // const { loadPlayers } = get()
        // await loadPlayers()
      } else {
        set({ error: result.error })
      }
    } catch (error) {
      set({ error: "Failed to unban player" })
    } finally {
      set({ isLoading: false })
    }
  },

  

  // loadPlayers: async (search) => {
  //   set({ isLoading: true, error: null })
  //   try {
  //     const url = search ? `/api/admin/players?search=${encodeURIComponent(search)}` : "/api/admin/players"
  //     const response = await fetch(url)
  //     const result = await response.json()

  //     if (result.success) {
  //       set({ players: result.data })
  //     } else {
  //       set({ error: result.error })
  //     }
  //   } catch (error) {
  //     set({ error: "Failed to load players" })
  //   } finally {
  //     set({ isLoading: false })
  //   }
  // },

  // loadGames: async () => {
  //   set({ isLoading: true, error: null })
  //   try {
  //     const response = await fetch("/api/admin/games")
  //     const result = await response.json()

  //     if (result.success) {
  //       set({ activeGames: result.data })
  //     } else {
  //       set({ error: result.error })
  //     }
  //   } catch (error) {
  //     set({ error: "Failed to load games" })
  //   } finally {
  //     set({ isLoading: false })
  //   }
  // },

  // loadAnalytics: async () => {
  //   set({ isLoading: true, error: null })
  //   try {
  //     const response = await fetch("/api/admin/analytics")
  //     const result = await response.json()

  //     if (result.success) {
  //       set({ analytics: result.data })
  //     } else {
  //       set({ error: result.error })
  //     }
  //   } catch (error) {
  //     set({ error: "Failed to load analytics" })
  //   } finally {
  //     set({ isLoading: false })
  //   }
  // },

  getTransactions: async (
  status: TransactionStatus | undefined,
  type: TransactionType | undefined,
  page: number,
  size: number,
  sortBy: string
) => {
    set({ isLoading: true, error: null })

    try {
      // Build query parameters safely
      const params = new URLSearchParams()

      if (status) params.append("status", status)
      if (type) params.append("type", type)
      params.append("page", page.toString())
      params.append("size", size.toString())
      params.append("sortBy", sortBy)

      // Construct URL dynamically based on current language
      const url = `/${i18n.language}/api/admin/transactions?${params.toString()}`

      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        if (type === "DEPOSIT") {
          set({ deposits: result.data })
        } else {
          set({ withdrawals: result.data })
        }
      } else {
        set({ error: result.message || "Failed to fetch transactions" })
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      set({ error: "Failed to load transactions" })
    } finally {
      set({ isLoading: false })
    }
  },

  changeTransactionStatus: async (txnRef: string, status: TransactionStatus) => {
    set({ isLoading: true, error: null })

    try {
      const url = `/${i18n.language}/api/admin/transactions/${encodeURIComponent(txnRef)}/status?status=${status}`

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
        // body: JSON.stringify({ status }), 
      })

      let result: any = null
      try {
        result = await response.json()
      } catch {
        throw new Error("Invalid JSON response from server")
      }

      // Success
      if (response.ok && result?.success && result?.data) {
        get().updateTransaction(result.data)
      } else {
        const errorMsg =
          result?.error ||
          result?.message ||
          `Failed to update transaction status (${response.status})`
        set({ error: errorMsg })
      }
    } catch (error) {
      console.error("Error updating transaction status:", error)
      set({ error: error instanceof Error ? error.message : "Failed to update transaction status" })
    } finally {
      set({ isLoading: false })
    }
  },

updateTransaction: (txn: Transaction) => {
  if (txn.txnType === "DEPOSIT") {
    const existing = get().deposits.filter(t => t.id !== txn.id)
    set({ deposits: [...existing, txn] })
  } else if (txn.txnType === "WITHDRAWAL") {
    const existing = get().withdrawals.filter(t => t.id !== txn.id)
    set({ withdrawals: [...existing, txn] }) 
  }
}


}))
