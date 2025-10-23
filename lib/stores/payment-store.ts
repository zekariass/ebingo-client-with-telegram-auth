import { create } from "zustand"
import type { GameTransaction, PaymentMethod, Transaction, WalletBalance } from "@/lib/types"
import i18n from "@/i18n"
import { $ZodEmail } from "zod/v4/core"
import { userStore } from "./user-store"

interface PaymentState {
  balance: WalletBalance
  paymentMethods: PaymentMethod[]
  transactions: Transaction[]
  gameTransactions: GameTransaction[]
  loading: boolean
  walletError: string | null
  pmError: string | null
  txnError: string | null
  gameTxnError: string | null
  gameError: String | null
  transferError: string | null
  withdrawError: string | null
  depositError: string | null

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
  setWalletError: (error: string | null) => void
  setTxnError: (error: string | null) => void
  setGameTxnError: (error: string | null) => void
  setPMError: (error: string | null) => void
  setTransferError: (error: string | null) => void
  setWithdrawError: (error: string | null) => void
  setDepositError: (error: string | null) => void

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
  withdrawFund: (
          paymentMethodId: number,
          amount: number,
          bankName?: string,
          accountName?: string,
          accountNumber?: string,
          phoneNumber?: string
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
      walletError: null,
      pmError: null,
      txnError: null,
      gameTxnError: null,
      gameError: null,
      transferError: null,
      withdrawError: null,
      depositError: null,

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
        walletError: null,
        pmError: null,
        txnError: null,
        gameTxnError: null,
        gameError: null,
        transferError: null,
        withdrawError: null,
        depositError: null,
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
      setWalletError: (error) => set({ walletError: error }),
      setTxnError: (error) => set({ txnError: error }),
      setPMError: (error) => set({ pmError: error }),
      setGameTxnError: (error) => set({ gameTxnError: error }),
      setTransferError: (error) => set({ transferError: error }),
      setWithdrawError: (error) => set({ withdrawError: error }),
      setDepositError: (error) => set({ depositError: error }),
      

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

      fetchGameTransactions: async (page = 1, size = 10, sortBy = "createdAt", refresh = false) => {
        const { gameTransactions } = get()
        const initData = userStore.getState().initData || ""
        const lang = i18n?.language || "en"

        if (gameTransactions.length && !refresh && page === 1) return

        set({ loading: true, gameTxnError: null })

        try {
          const response = await fetch(
            `/${lang}/api/payments/game-transactions?page=${page}&size=${size}&sortBy=${sortBy}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-init-data": initData,
              },
              cache: "no-store",
            }
          )

          const result = await response.json()

          if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch transactions")
          }

          set({ gameTransactions: result.data || [], loading: false })
        } catch (err: any) {
          console.error("fetchGameTransactions error:", err)
          set({
            gameTxnError: err.message || "Error fetching game transactions",
            loading: false,
          })
        }
      },


      // Async actions to fetch from DB
      fetchWallet: async (refresh: boolean) => {
        if (!refresh && get().balance.id) return
        const initData = userStore.getState().initData;
        const user = userStore.getState().user;
        if (!user){
          set({ walletError: "User not logged in. Go back to telegram and reload the page", loading: false })
        };
        set({ loading: true, walletError: null })
        try {
          const response = await fetch(`/${i18n.language}/api/payments/wallet`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-init-data": initData || "",
            },
          });
          if (!response.ok) throw new Error("Failed to fetch wallet")
          const result = await response.json()
          const {data} = result

          if(data) {
            set({ balance: { ...data }, loading: false })
          }else{
            throw new Error("No wallet data found")
          }


        } catch (error: any) {
          set({ walletError: error.message || "Error fetching wallet", loading: false })
        }
      },


      fetchPaymentMethods: async () => {
        if (get().paymentMethods.length) return
        set({ loading: true, pmError: null })
        try {
          const response = await fetch(`/${i18n.language}/api/payments/methods`)
          if (!response.ok) throw new Error("Failed to fetch payment methods")
          const result = await response.json()
          const {data} = result
          set({ paymentMethods: data, loading: false })
        } catch (error: any) {
          set({ pmError: error.message || "Error fetching payment methods", loading: false })
        }
      },


      fetchTransactions: async (page: number, size: number, refresh: boolean) => {
        const { transactions } = get();
        const userStoreState = userStore.getState();
        const initData = userStoreState.initData;
        const user = userStoreState.user;

        //  Avoid unnecessary reloads
        if (!refresh && transactions.length) return;

        //  Handle missing user
        if (!user) {
          set({
            txnError:
              "User not logged in. Please go back to Telegram and reload the page.",
            loading: false,
          });
          return;
        }

        set({ loading: true, txnError: null });

        try {
          //  Build URL safely
          const url = new URL(
            `/${i18n.language}/api/payments/transactions`,
            window.location.origin
          );
          url.searchParams.set("page", String(page || 1));
          url.searchParams.set("size", String(size || 10));

          //  Make request
          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-init-data": initData ?? "",
            },
          });

          //  Gracefully handle backend non-OK responses
          let result: any;
          try {
            result = await response.json();
          } catch {
            throw new Error("Invalid response format from server");
          }

          if (!response.ok || result?.success === false) {
            throw new Error(result?.error || result?.message || "Failed to fetch transactions");
          }

          //  Ensure data is a list
          const data = Array.isArray(result?.data) ? result.data : [];

          set({
            transactions: data,
            loading: false,
            txnError: null,
          });
        } catch (error: any) {
          console.error("fetchTransactions error:", error);
          set({
            txnError: error?.message || "Error fetching transactions",
            loading: false,
          });
        }
      },


    transferFunds: async (amount: number, email: string) => {
      set({ loading: true, transferError: null });
      const initData = userStore.getState().initData;
        const user = userStore.getState().user;
        if (!user){
          set({ transferError: "User not logged in. Go back to telegram and reload the page", loading: false })
        };
      try {
        // Build endpoint (multilingual support)
        const url = new URL(`/${i18n.language}/api/payments/transfer`, window.location.origin);

        // Make API call
        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-init-data": initData || "",
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
          transferError: error.message || "Error transferring funds",
          loading: false,
        });
      }
    },

    addDeposit: async (amount: number, paymentMethodId: number) => {
        set({ loading: true, depositError: null });
        const initData = userStore.getState().initData;
        const user = userStore.getState().user;
        if (!user){
          set({ depositError: "User not logged in. Go back to telegram and reload the page", loading: false })
        };

        try {
          const paymentMethod = get().paymentMethods.find(pm => pm.id === paymentMethodId);

          if (paymentMethod?.name.toLowerCase().includes("bank transfer")) {
            const url = new URL(`/${i18n.language}/api/payments/deposit`, window.location.origin);

            const response = await fetch(url.toString(), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-init-data": initData || "",
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
            depositError: error.message || "Error creating deposit",
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
        bankName?: string,
        accountName?: string,
        accountNumber?: string,
        phoneNumber?: string
      ) => {
        set({ loading: true, withdrawError: null });

        try {
          const paymentMethod = get().paymentMethods.find(pm => pm.id === paymentMethodId);

          if (!paymentMethod) {
            throw new Error("Invalid payment method");
          }

          // Determine request payload based on selected method
          let payload: Record<string, any> = {
            paymentMethodId,
            amount,
          };

          if (paymentMethod.name.toLowerCase().includes("bank transfer")) {
            if (!bankName || !accountName || !accountNumber) {
              set({ loading: false, depositError: "Bank details are required for Bank Transfer withdrawals" });
              throw new Error("Bank name, account name, and account number are required for Bank Transfer");
            }
            payload = { ...payload, bankName, accountName, accountNumber };
          } else if (paymentMethod.name.toLowerCase().includes("addispay")) {
            if (!phoneNumber) {
              set({ loading: false, depositError: "Phone number is required for AddisPay withdrawals" });
              throw new Error("Phone number is required for AddisPay withdrawals");
            }
            payload = { ...payload, phoneNumber };
          } else {
            throw new Error(`Unsupported payment method: ${paymentMethod.name}`);
          }

          const url = new URL(`/${i18n.language}/api/payments/withdraw`, window.location.origin);

          const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error("Failed to process withdrawal");
          }

          const result = await response.json();
          const { data } = result;

          set({ loading: false });

        } catch (error: any) {
          set({
            withdrawError: error.message || "Error processing withdrawal",
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
