// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ArrowLeftRight, Mail, AlertTriangle, Send, X } from "lucide-react"
// import { usePaymentStore } from "@/lib/stores/payment-store"
// import { useRouter } from "next/navigation"

// // 🔹 Validation schema
// const transferSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   amount: z.number().min(10, "Minimum transfer is Br 10").max(10000, "Maximum transfer is Br 10,000"),
// })

// type TransferForm = z.infer<typeof transferSchema>

// export default function TransferPage() {
//   const router = useRouter()
//   const [isProcessing, setIsProcessing] = useState(false)
//   const { balance, transferFunds, fetchWallet } = usePaymentStore()

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<TransferForm>({
//     resolver: zodResolver(transferSchema),
//     defaultValues: { amount: 10, email: "" },
//   })

//   const selectedAmount = watch("amount")

//   useEffect(()=>{
//     fetchWallet(true)
//   }, [])

//   const onSubmit = async (data: TransferForm) => {
//     if (data.amount > balance.totalAvailableBalance) {
//       console.error("Insufficient balance")
//       return
//     }

//     setIsProcessing(true)
//     try {
//       await transferFunds(data.amount, data.email)
//       reset()
//       await fetchWallet(true)
//       router.push("/") // Close page after success
//     } catch (error) {
//       console.error("Transfer failed:", error)
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <ArrowLeftRight className="h-5 w-5 text-primary" />
//             <h2 className="text-lg font-semibold">Transfer Funds</h2>
//           </div>
//           <button
//             className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//             onClick={() => router.push("/")}
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Info Alert */}
//           <Alert variant="default" className="border-yellow-300 bg-yellow-50">
//             <AlertTriangle className="h-4 w-4 text-yellow-500" />
//             <AlertDescription className="text-sm">
//               Transfers are instant and irreversible. Please verify the recipient's email before confirming.
//             </AlertDescription>
//           </Alert>

//           {/* Email field */}
//           <div>
//             <Label htmlFor="email" className="py-2">Receiver Email</Label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="example@domain.com"
//                 {...register("email")}
//                 className="pl-9"
//               />
//             </div>
//             {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
//           </div>

//           {/* Amount field */}
//           <div>
//             <Label htmlFor="amount" className="py-2">Amount</Label>
//             <Input
//               id="amount"
//               type="number"
//               step="0.01"
//               min="1"
//               max={balance.totalAvailableBalance}
//               {...register("amount", { valueAsNumber: true })}
//               className="text-lg font-semibold"
//             />
//             {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>}

//             <div className="flex justify-between text-sm text-muted-foreground mt-2">
//               <span>Available Balance:</span>
//               <span className="font-semibold">Br {balance.totalAvailableBalance?.toFixed(2)}</span>
//             </div>

//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => setValue("amount", balance.totalAvailableBalance)}
//               disabled={balance.totalAvailableBalance <= 0}
//               className="mt-2 w-full bg-transparent"
//             >
//               Transfer All (Br {balance.totalAvailableBalance?.toFixed(2)})
//             </Button>
//           </div>

//           {/* Summary */}
//           <div className="bg-muted p-4 rounded-lg space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Transfer Amount:</span>
//               <span className="font-semibold">Br {selectedAmount?.toFixed(2) || "0.00"}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Transfer Fee:</span>
//               <span className="font-semibold">Br 0.00</span>
//             </div>
//             <div className="border-t pt-2 flex justify-between font-semibold">
//               <span>Total Sent:</span>
//               <span>Br {selectedAmount?.toFixed(2) || "0.00"}</span>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               className="flex-1 bg-transparent"
//               onClick={() => router.push("/")}
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="flex-1"
//               disabled={isProcessing || (selectedAmount || 0) > balance.totalAvailableBalance}
//             >
//               {isProcessing ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Send className="h-4 w-4 mr-2" />
//                   Send
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ArrowLeftRight, Phone, AlertTriangle, Send, X } from "lucide-react"
// import { usePaymentStore } from "@/lib/stores/payment-store"
// import { useRouter } from "next/navigation"
// import { currency } from "@/lib/constant"

// // 🔹 Validation schema
// const transferSchema = z.object({
//   phone: z
//     .string()
//     .min(8, "Phone number must be at least 8 digits")
//     .max(15, "Phone number cannot exceed 15 digits")
//     .regex(/^\+?[0-9]*$/, "Phone number must contain only digits and optional +"),
//   amount: z.number().min(10, `Minimum transfer is Br 10 ${currency}`).max(10000, `Maximum transfer is 10,000 ${currency}`),
// })

// type TransferForm = z.infer<typeof transferSchema>

// export default function TransferPage() {
//   const router = useRouter()
//   const [isProcessing, setIsProcessing] = useState(false)
//   const { balance, transferFunds, fetchWallet } = usePaymentStore()

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<TransferForm>({
//     resolver: zodResolver(transferSchema),
//     defaultValues: { amount: 10, phone: "" },
//   })

//   const selectedAmount = watch("amount")

//   useEffect(() => {
//     fetchWallet(true)
//   }, [])

//   const onSubmit = async (data: TransferForm) => {
//     if (data.amount > balance.totalAvailableBalance) {
//       console.error("Insufficient balance")
//       return
//     }

//     setIsProcessing(true)
//     try {
//       await transferFunds(data.amount, data.phone)
//       reset()
//       await fetchWallet(true)
//       router.push("/") // Close page after success
//     } catch (error) {
//       console.error("Transfer failed:", error)
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <ArrowLeftRight className="h-5 w-5 text-primary" />
//             <h2 className="text-lg font-semibold">Transfer Funds</h2>
//           </div>
//           <button
//             className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//             onClick={() => router.push("/")}
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Info Alert */}
//           <Alert variant="default" className="border-yellow-300 bg-yellow-50">
//             <AlertTriangle className="h-4 w-4 text-yellow-500" />
//             <AlertDescription className="text-sm">
//               Transfers are instant and irreversible. Please verify the recipient's phone number before confirming.
//             </AlertDescription>
//           </Alert>

//           {/* Phone field */}
//           <div>
//             <Label htmlFor="phone" className="py-2">Receiver Phone</Label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 id="phone"
//                 type="tel"
//                 placeholder="+251912345678"
//                 {...register("phone")}
//                 className="pl-9"
//               />
//             </div>
//             {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
//           </div>

//           {/* Amount field */}
//           <div>
//             <Label htmlFor="amount" className="py-2">Amount</Label>
//             <Input
//               id="amount"
//               type="number"
//               step="0.01"
//               min="1"
//               max={balance.totalAvailableBalance}
//               {...register("amount", { valueAsNumber: true })}
//               className="text-lg font-semibold"
//             />
//             {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>}

//             <div className="flex justify-between text-sm text-muted-foreground mt-2">
//               <span>Available Balance:</span>
//               <span className="font-semibold">Br {balance.totalAvailableBalance?.toFixed(2)}</span>
//             </div>

//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => setValue("amount", balance.totalAvailableBalance)}
//               disabled={balance.totalAvailableBalance <= 0}
//               className="mt-2 w-full bg-transparent"
//             >
//               Transfer All (Br {balance.totalAvailableBalance?.toFixed(2)})
//             </Button>
//           </div>

//           {/* Summary */}
//           <div className="bg-muted p-4 rounded-lg space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Transfer Amount:</span>
//               <span className="font-semibold">Br {selectedAmount?.toFixed(2) || "0.00"}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Transfer Fee:</span>
//               <span className="font-semibold">Br 0.00</span>
//             </div>
//             <div className="border-t pt-2 flex justify-between font-semibold">
//               <span>Total Sent:</span>
//               <span>Br {selectedAmount?.toFixed(2) || "0.00"}</span>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               className="flex-1 bg-transparent"
//               onClick={() => router.push("/")}
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="flex-1"
//               disabled={isProcessing || (selectedAmount || 0) > balance.totalAvailableBalance}
//             >
//               {isProcessing ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Send className="h-4 w-4 mr-2" />
//                   Send
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftRight, Phone, Send, AlertTriangle } from "lucide-react"
import { usePaymentStore } from "@/lib/stores/payment-store"
import { useRouter } from "next/navigation"
import { currency } from "@/lib/constant"
import { useTelegramInit } from "@/lib/hooks/use-telegram-init"

const minTransfer = 10

// 🔹 Dynamic Zod schema builder
const buildTransferSchema = (maxTransferable: number) =>
  z.object({
    phone: z
      .string()
      .min(8, "Phone number must be at least 8 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .regex(/^\+?[0-9]*$/, "Phone number must contain only digits and optional +"),
    amount: z
      .number()
      .min(minTransfer, `Minimum transfer is Br ${minTransfer}`)
      .max(maxTransferable, `Maximum transfer is Br ${maxTransferable}`),
  })

type TransferForm = z.infer<ReturnType<typeof buildTransferSchema>>

export default function TransferPage() {
  const router = useRouter()
  const { balance, transferFunds, fetchWallet } = usePaymentStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const maxTransferable = useMemo(
    () => Math.min(10000, Math.max(0, (balance?.totalAvailableBalance ?? 0) - minTransfer)),
    [balance?.totalAvailableBalance]
  )

  const transferSchema = useMemo(() => buildTransferSchema(maxTransferable), [maxTransferable])

  useTelegramInit()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: { amount: minTransfer, phone: "" },
  })

  const selectedAmount = watch("amount")

  useEffect(() => {
    fetchWallet(true)
  }, [fetchWallet])

  const onSubmit = async (data: TransferForm) => {
    if (data.amount > balance.totalAvailableBalance) {
      console.error("Insufficient balance")
      return
    }

    setIsProcessing(true)
    try {
      await transferFunds(data.amount, data.phone)
      reset()
      await fetchWallet(true)
      router.push("/") // Redirect after success
    } catch (error) {
      console.error("Transfer failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Transfer Funds</h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            onClick={() => {
            if (window.Telegram?.WebApp) {
              window.Telegram.WebApp.close();
            }
          }}
          >
            X
          </button>
        </div>

        {/* Info alert */}
        {/* <div className="flex items-center gap-2 p-2 mb-4 rounded bg-yellow-50 border border-yellow-300 text-yellow-700">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">
            Transfers are instant and irreversible. Verify the recipient's phone number before confirming.
          </span>
        </div> */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone input */}
          <div>
            <Label htmlFor="phone" className="mb-2">Receiver Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+251912345678"
                {...register("phone")}
                className="pl-9"
              />
            </div>
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
          </div>

          {/* Amount input */}
          <div>
            <Label htmlFor="amount" className="mb-2">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              // min={minTransfer}
              // max={maxTransferable}
              {...register("amount", { valueAsNumber: true })}
              className="text-lg font-semibold"
            />
            {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>}

            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Available Balance:</span>
              <span className="font-semibold">Br {balance.totalAvailableBalance?.toFixed(2)}</span>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Max transferable: <span className="font-semibold">Br {maxTransferable.toFixed(2)}</span>
            </p>

            {/* <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue("amount", maxTransferable)}
              disabled={balance.totalAvailableBalance <= 0}
              className="mt-2 w-full bg-transparent"
            >
              Transfer All (Br {maxTransferable.toFixed(2)})
            </Button> */}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.push("/")} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isProcessing || (selectedAmount || 0) > balance.totalAvailableBalance}>
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
