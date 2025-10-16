"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeftRight, Mail, AlertTriangle, Send, X } from "lucide-react"
import { usePaymentStore } from "@/lib/stores/payment-store"
import { useRouter } from "next/navigation"

// 🔹 Validation schema
const transferSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  amount: z.number().min(10, "Minimum transfer is Br 10").max(10000, "Maximum transfer is Br 10,000"),
})

type TransferForm = z.infer<typeof transferSchema>

export default function TransferPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { balance, transferFunds, fetchWallet } = usePaymentStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: { amount: 10, email: "" },
  })

  const selectedAmount = watch("amount")

  useEffect(()=>{
    fetchWallet(true)
  }, [])

  const onSubmit = async (data: TransferForm) => {
    if (data.amount > balance.totalAvailableBalance) {
      console.error("Insufficient balance")
      return
    }

    setIsProcessing(true)
    try {
      await transferFunds(data.amount, data.email)
      reset()
      await fetchWallet(true)
      router.push("/") // Close page after success
    } catch (error) {
      console.error("Transfer failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Transfer Funds</h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => router.push("/")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Info Alert */}
          <Alert variant="default" className="border-yellow-300 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-sm">
              Transfers are instant and irreversible. Please verify the recipient's email before confirming.
            </AlertDescription>
          </Alert>

          {/* Email field */}
          <div>
            <Label htmlFor="email" className="py-2">Receiver Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                {...register("email")}
                className="pl-9"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          {/* Amount field */}
          <div>
            <Label htmlFor="amount" className="py-2">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="1"
              max={balance.totalAvailableBalance}
              {...register("amount", { valueAsNumber: true })}
              className="text-lg font-semibold"
            />
            {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>}

            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Available Balance:</span>
              <span className="font-semibold">Br {balance.totalAvailableBalance?.toFixed(2)}</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue("amount", balance.totalAvailableBalance)}
              disabled={balance.totalAvailableBalance <= 0}
              className="mt-2 w-full bg-transparent"
            >
              Transfer All (Br {balance.totalAvailableBalance?.toFixed(2)})
            </Button>
          </div>

          {/* Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Transfer Amount:</span>
              <span className="font-semibold">Br {selectedAmount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transfer Fee:</span>
              <span className="font-semibold">Br 0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Sent:</span>
              <span>Br {selectedAmount?.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.push("/")}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isProcessing || (selectedAmount || 0) > balance.totalAvailableBalance}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
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
