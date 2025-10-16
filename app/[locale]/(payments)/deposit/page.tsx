'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { usePaymentStore } from "@/lib/stores/payment-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, DollarSign, X } from "lucide-react"
import { useRouter } from "next/navigation"

const depositSchema = z.object({
  amount: z.number().min(10, "Minimum deposit is $10").max(1000, "Maximum deposit is $1000"),
  paymentMethodId: z.number().min(1, "Please select a payment method"),
})

type DepositForm = z.infer<typeof depositSchema>

export default function DepositPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { paymentMethods, addDeposit, fetchPaymentMethods, getDefaultPaymentMethod, balance, setBalance, addTransaction } = usePaymentStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 50,
      paymentMethodId: getDefaultPaymentMethod()?.id,
    },
  })

  const selectedAmount = watch("amount")
  const quickAmounts = [25, 50, 100, 200]

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const onSubmit = async (data: DepositForm) => {
    setIsProcessing(true)

    try {
      addDeposit(data.amount, data.paymentMethodId)

      // Optional: update balance or add transaction
      router.push('/wallet') // Redirect after successful deposit
    } catch (error) {
      console.error("Deposit Failed:", error instanceof Error ? error.message : "Please try again")
    } finally {
      reset()
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => router.push('/')}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5" />
          <h2 className="text-xl font-bold">Deposit Funds</h2>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="pb-2">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="10"
              max="1000"
              {...register("amount", { valueAsNumber: true })}
              className="text-lg font-semibold"
            />
            {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}

            <div className="grid grid-cols-4 gap-2 mt-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setValue("amount", amount)}
                  className="bg-transparent"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentMethod" className="pb-2">Payment Method</Label>
            <Select
              value={watch("paymentMethodId")?.toString() ?? ""}
              onValueChange={(value) => setValue("paymentMethodId", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id.toString()}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {method.name}
                      {method.isDefault && <span className="text-xs text-muted-foreground">(Default)</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethodId && <p className="text-sm text-red-600">{errors.paymentMethodId.message}</p>}
          </div>

          {/* Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Deposit Amount:</span>
              <span className="font-semibold">${selectedAmount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Processing Fee:</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>${selectedAmount?.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.push('/')}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isProcessing || paymentMethods.length === 0}>
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                "Deposit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
