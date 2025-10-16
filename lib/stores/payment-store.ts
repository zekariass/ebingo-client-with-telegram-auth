import { create } from "zustand"
import type { GameTransaction, PaymentMethod, Transaction, WalletBalance } from "@/lib/types"
import i18n from "@/i18n"
import { $ZodEmail } from "zod/v4/core"

interface PaymentState {
  balance: WalletBalance
  paymentMethods: PaymentMethod[]
  transactions: Transaction[]
  gameTransactions: GameTransaction[]
  loading: boolean
  error: string | null
  gameError: String | null

  // Actions
  resetBalance: () => void
  resetPaymentMethods: () => void
  resetTransactions: () => void
  reset: () => void
  setBalance: (balance: WalletBalance) => void
  setPaymentMethods: (methods: PaymentMethod[]) => void
  addPaymentMethod: (method: PaymentMethod) => void
  removePaymentMethod: (methodId: string) => void
  setDefaultPaymentMethod: (methodId: string) => void
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Game Txns
  resetGameTxns: () => void
  setGameTxns: (txns: GameTransaction[]) => void
  fetchGameTransactions: (page: number, size: number, sortBy: string, refresh: boolean) => void

  // Computed
  getDefaultPaymentMethod: () => PaymentMethod | null
  getPendingTransactions: () => Transaction[]
  getRecentTransactions: (limit?: number) => Transaction[]

  // From DB
  fetchWallet: (refresh: boolean) => Promise<void>
  fetchPaymentMethods: () => Promise<void>
  fetchTransactions: (page: number, size: number, refresh: boolean) => Promise<void>
  transferFunds: (amount: number, email: string) => Promise<void>

  // Deposit
  addDeposit: (amount: number, paymentMethodId: number) => Promise<void>
  // getPendingDeposits: () => number

  // Withdraw
  withdrawFund: (paymentMethodId: number,
                  amount: number,
                  bankName: string,
                  accountName: string,
                  accountNumber: string
  ) => Promise<void>
}

export const usePaymentStore = create<PaymentState>()(
  // persist(
    (set, get) => ({
      balance: {
        id: 0,
        userProfileId: 0,
        totalDeposit: 0,
        depositBalance: 0, 
        pendingBalance: 0,
        welcomeBonus: 0,
        availableWelcomeBonus: 0,
        referralBonus: 0,
        availableReferralBonus: 0,
        totalPrizeAmount: 0,
        pendingWithdrawal: 0,
        totalWithdrawal: 0,
        totalAvailableBalance: 0,
        availableToWithdraw: 0,
      },
      paymentMethods: [],
      transactions: [],
      gameTransactions: [],
      loading: false,
      error: null,
      gameError: null,

      // Actions
      resetBalance: () => set({ balance: {
        id: 0,
        userProfileId: 0,
        totalDeposit: 0,
        depositBalance: 0, 
        pendingBalance: 0,
        welcomeBonus: 0,
        availableWelcomeBonus: 0,
        referralBonus: 0,
        availableReferralBonus: 0,
        totalPrizeAmount: 0,
        pendingWithdrawal: 0,
        totalWithdrawal: 0,
        totalAvailableBalance: 0,
        availableToWithdraw: 0,
      } }),
      resetPaymentMethods: () => set({ paymentMethods: [] }),
      resetTransactions: () => set({ transactions: [] }),
      reset: () => set({
        balance: {
          id: 0,
          userProfileId: 0,
          totalDeposit: 0,
          depositBalance: 0, 
          pendingBalance: 0,
          welcomeBonus: 0,
          availableWelcomeBonus: 0,
          referralBonus: 0,
          availableReferralBonus: 0,
          totalPrizeAmount: 0,
          pendingWithdrawal: 0,
          totalWithdrawal: 0,
          totalAvailableBalance: 0,
          availableToWithdraw: 0,
        },
        paymentMethods: [],
        transactions: [],
        loading: false,
        error: null,
      }),

      setBalance: (balance) => set({ balance }),

      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),

      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [...state.paymentMethods, method],
        })),

    
      removePaymentMethod: (methodId) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((m) => m.id !== Number(methodId)),
        })),


      setDefaultPaymentMethod: (methodId) => {
        set((state) => ({
          paymentMethods: state.paymentMethods.map((m) => ({
            ...m,
            isDefault: m.id === Number(methodId),
          })),
        }))
      },

      setTransactions: (transactions) =>
         set(()=>({
          transactions: Array.isArray(transactions)? [...transactions] : []
         })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),


      updateTransaction: (transactionId, updates) =>    
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === Number(transactionId) ? { ...t, ...updates } : t
          ),
        })),  

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Computed getters
      getDefaultPaymentMethod: () => {
        const { paymentMethods } = get()
        return paymentMethods?.find((m) => m.isDefault) || null
      },


     getPendingTransactions: () => {
      const { transactions } = get()
      return Array.isArray(transactions)
        ? transactions.filter(t => t.status === 'PENDING' || t.status === 'AWAITING_APPROVAL')
        : []
    },



      getRecentTransactions: (limit = 10) => {
        const { transactions } = get()
        return transactions
          .sort((a, b) => b.id - a.id)
          .slice(0, limit)
      },

      resetGameTxns: () => set({
        gameTransactions: []
      }),

      setGameTxns: (gameTxns: GameTransaction[]) =>
         set({
          gameTransactions: [...gameTxns]
         }),


      fetchGameTransactions: async (page: number, size: number, sortBy: string, refresh: boolean) => {
        if (get().gameTransactions.length && !refresh) return
        set({ loading: true, error: null })

        try{

          const url = new URL(`/${i18n.language}/api/payments/game-transactions`, window.location.origin);
          url.searchParams.append('page', page.toString());
          url.searchParams.append('size', size.toString());
          url.searchParams.append('sortBy', sortBy.toString());

          const response = await fetch(url.toString());
          if (!response.ok) throw new Error("Failed to fetch transactions");

          const result = await response.json();
          const { data } = result;

          set({ gameTransactions: data, loading: false });

            }catch (error: any) {
              set({ error: error.message || "Error fetching game transaction", loading: false })
            }
         },


      // Async actions to fetch from DB
      fetchWallet: async (refresh: boolean) => {
        if (!refresh && get().balance.id) return
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/${i18n.language}/api/payments/wallet`)
          if (!response.ok) throw new Error("Failed to fetch wallet")
          const result = await response.json()
          const {data} = result

          if(data) {
            set({ balance: data, loading: false })
          }else{
            throw new Error("No wallet data found")
          }


        } catch (error: any) {
          set({ error: error.message || "Error fetching wallet", loading: false })
        }
      },


      fetchPaymentMethods: async () => {
        if (get().paymentMethods.length) return
        set({ loading: true, error: null })
        try {
          const response = await fetch(`/${i18n.language}/api/payments/methods`)
          if (!response.ok) throw new Error("Failed to fetch payment methods")
          const result = await response.json()
          const {data} = result
          set({ paymentMethods: data, loading: false })
        } catch (error: any) {
          set({ error: error.message || "Error fetching payment methods", loading: false })
        }
      },


      fetchTransactions: async (page, size, refresh) => {
      if (!refresh && get().transactions.length) return;
      set({ loading: true, error: null });
      try {
        // Build URL with query parameters
        const url = new URL(`/${i18n.language}/api/payments/transactions`, window.location.origin);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('size', size.toString());

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const result = await response.json();
        const { data } = result;

        set({ transactions: Array.isArray(data)? [...data]: [], loading: false });
      } catch (error: any) {
        set({ error: error.message || "Error fetching transactions", loading: false });
      }
    },

    transferFunds: async (amount: number, email: string) => {
      set({ loading: true, error: null });

      try {
        // Build endpoint (multilingual support)
        const url = new URL(`/${i18n.language}/api/payments/transfer`, window.location.origin);

        // Make API call
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, email }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Transfer failed");
        }

        const result = await response.json();
        const { data } = result;

        // Optionally refresh wallet balances or transactions
        if (get().fetchWallet) {
          await get().fetchWallet(true);
        }

        // Optionally update transactions list
        if (data) {
          set({
            transactions: data,
            loading: false,
          });
        } else {
          set({ loading: false });
        }

      } catch (error: any) {
        console.error("Transfer failed:", error);
        set({
          error: error.message || "Error transferring funds",
          loading: false,
        });
      }
    },

    addDeposit: async (amount: number, paymentMethodId: number) => {
        set({ loading: true, error: null });

        try {
          const paymentMethod = get().paymentMethods.find(pm => pm.id === paymentMethodId);

          if (paymentMethod?.name.toLowerCase().includes("bank transfer")) {
            const url = new URL(`/${i18n.language}/api/payments/deposit`, window.location.origin);

            const response = await fetch(url.toString(), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount,
                paymentMethodId,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to create deposit");
            }

            const result = await response.json();
            const { data } = result;

            set({ transactions: data, loading: false });
          } else {
            throw new Error("Unsupported payment method");
          }
        } catch (error: any) {
          set({
            error: error.message || "Error creating deposit",
            loading: false,
          });
        }
      },

      // getPendingDeposits: () => {
      //   let pendingDeposits = 0.00;
      //   get().transactions.forEach(txn => {
      //     if (txn.txnType === "DEPOSIT" && (txn.status === "PENDING" || txn.status === "AWAITING_APPROVAL")){
      //       pendingDeposits += txn.txnAmount;
      //     }
      //   })

      //   return pendingDeposits
      // },

      withdrawFund: async (
          paymentMethodId: number,
          amount: number,
          bankName: string,
          accountName: string,
          accountNumber: string
        ) => {
          set({ loading: true, error: null });

          try {
            const paymentMethod = get().paymentMethods.find(pm => pm.id === paymentMethodId);

            if (!paymentMethod) {
              throw new Error("Invalid payment method");
            }

            if (!paymentMethod.name.toLowerCase().includes("bank transfer")) {
              throw new Error("Only bank transfer withdrawals are supported");
            }

            const url = new URL(`/${i18n.language}/api/payments/withdraw`, window.location.origin);

            const response = await fetch(url.toString(), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentMethodId,
                amount,
                bankName,
                accountName,
                accountNumber,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to process withdrawal");
            }

            const result = await response.json();
            const { data } = result;

            set({
              loading: false,
            });

          } catch (error: any) {
            set({
              error: error.message || "Error processing withdrawal",
              loading: false,
            });
          }
        },



    }),
    // {
    //   name: "bingo-payment-storage",
    //   partialize: (state) => ({
    //     balance: state.balance,
    //     paymentMethods: state.paymentMethods,
    //     transactions: state.transactions.slice(0, 50), // Keep only recent transactions
    //   }),
    // },
  )
// )
