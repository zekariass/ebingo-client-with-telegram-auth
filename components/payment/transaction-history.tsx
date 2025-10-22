// "use client"

// import { usePaymentStore } from "@/lib/stores/payment-store"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { ArrowUpRight, ArrowDownLeft, CreditCard, RefreshCw, History } from "lucide-react"
// import { TransactionStatus, TransactionType } from "@/lib/types"
// import { useEffect } from "react"

// export function TransactionHistory() {
//   const { transactions, setTransactions, getRecentTransactions, fetchTransactions, loading, setLoading, error, setTxnError } =
//     usePaymentStore()

//   const refreshTransactions = async (refresh: boolean) => {
//     fetchTransactions(1, 10, refresh)

//   //   try {
//   //     const newTransactions = await paymentApiClient.getTransactions()
//   //     setTransactions(newTransactions)
//   //   } catch (error) {
//   //     setTxnError(error instanceof Error ? error.message : "Failed to load transactions")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }
//   }

//   // useEffect(() => {
//   //   if (transactions.length === 0) {
//   //     refreshTransactions()
//   //   }
//   // }, [])

//   const getTransactionIcon = (type: TransactionType) => {
//     switch (type) {
//       case "DEPOSIT":
//         return <ArrowDownLeft className="h-4 w-4 text-green-600" />
//       case "WITHDRAWAL":
//         return <ArrowUpRight className="h-4 w-4 text-red-600" />
//       case "DISPUTE":
//         return <CreditCard className="h-4 w-4 text-blue-600" />
//       default:
//         return <CreditCard className="h-4 w-4 text-gray-600" />
//     }
//   }

//   const getStatusColor = (status: TransactionStatus) => {
//     switch (status) {
//       case "COMPLETED":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//       case "AWAITING_APPROVAL":
//         return "bg-yellow-100 text-blue-800 dark:bg-blue-900 dark:text-yellow-200"
//       case "PENDING":
//         return "bg-blue-100 text-yellow-800 dark:bg-yellow-900 dark:text-blue-200"
//       case "FAILED":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
//     }
//   }

//   const formatAmount = (amount: number, type: TransactionType) => {
//     const isPositive = amount > 0 || type === "DEPOSIT"
//     const prefix = isPositive ? "+" : ""
//     const color = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"

//     return (
//       <span className={`font-semibold ${color}`}>
//         {prefix}${Math.abs(amount).toFixed(2)}
//       </span>
//     )
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   // const recentTransactions = getRecentTransactions(10)

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-2">
//             <History className="h-5 w-5" />
//             Transaction History
//           </CardTitle>
//           <Button variant="outline" size="sm" onClick={() => refreshTransactions(true)} disabled={loading}>
//             <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent>
//         {error && (
//           <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-4">
//             <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
//           </div>
//         )}

//         {transactions.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
//             <p>No transactions yet</p>
//             <p className="text-sm">Your transaction history will appear here</p>
//           </div>
//         ) : (
//           <ScrollArea className="h-96 overflow-x-auto">
//             <div className="space-y-3 min-w-full">
//               {(transactions?transactions:[]).map((transaction, index) => (
//                 <div key={transaction.id}>
//                   <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
//                     <div className="flex items-center gap-3">
//                       {getTransactionIcon(transaction.txnType)}
//                       <div>
//                         {/* <p className="font-medium text-sm">{transaction.description}</p> */}
//                         <div className="flex items-center gap-2 mt-1">
//                           <Badge variant="secondary" className={`text-xs ${getStatusColor(transaction.status)}`}>
//                             {transaction.txnType}
//                           </Badge>
//                           <span className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="text-right">{formatAmount(transaction.txnAmount, transaction.txnType)}</div>
//                   </div>

//                   <p className="text-xs">Ref: {transaction.txnRef}</p>


//                   {index < transactions.length - 1 && <Separator />}

//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         )}
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { usePaymentStore } from "@/lib/stores/payment-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, ArrowDownLeft, CreditCard, RefreshCw, History } from "lucide-react"
import { TransactionStatus, TransactionType } from "@/lib/types"
import { useEffect } from "react"

export function TransactionHistory() {
  const {
    transactions,
    fetchTransactions,
    loading,
    setLoading,
    txnError,
    setTxnError,
  } = usePaymentStore()

  // Ensure we always have an array to map over
  const txns = Array.isArray(transactions) ? transactions : transactions ?? []

  const refreshTransactions = async (refresh: boolean = false) => {
    try {
      setLoading(true)
      setTxnError(null)
      await fetchTransactions(1, 10, refresh)
    } catch (err) {
      setTxnError(err instanceof Error ? err.message : "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // if (!transactions || txns.length === 0) {
      refreshTransactions(true)
    // }
  }, [])

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "WITHDRAWAL":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "DISPUTE":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "AWAITING_APPROVAL":
        return "bg-yellow-100 text-blue-800 dark:bg-blue-900 dark:text-yellow-200"
      case "PENDING":
        return "bg-blue-100 text-yellow-800 dark:bg-yellow-900 dark:text-blue-200"
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatAmount = (amount: number, type: TransactionType) => {
    const isPositive = amount > 0 || type === "DEPOSIT"
    const prefix = isPositive ? "+" : ""
    const color = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"

    return (
      <span className={`font-semibold ${color}`}>
        {prefix}${Math.abs(amount).toFixed(2)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => refreshTransactions(true)} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Error Message */}
        {txnError && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm">{txnError}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && txns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        )}

        {/* Transaction List */}
        {!loading && txns.length > 0 && (
          <ScrollArea className="h-96 overflow-x-auto">
            <div className="space-y-3 min-w-full">
              {txns.map((transaction, index) => (
                <div key={transaction.id ?? index}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.txnType)}
                      <div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusColor(transaction.status)}`}
                          >
                            {transaction.txnType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">{formatAmount(transaction.txnAmount, transaction.txnType)}</div>
                  </div>

                  <p className="text-xs">Ref: {transaction.txnRef}</p>

                  {index < txns.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
