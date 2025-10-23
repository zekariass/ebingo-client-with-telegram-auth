"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { usePaymentStore } from "@/lib/stores/payment-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Minus, CreditCard, Phone, X } from "lucide-react"
import { currency } from "@/lib/constant"
import { use } from "i18next"

// ---- CONFIG ----
const minWithdrawalAmount = 50
const maxWithdrawalAmount = 10000

// ---- SCHEMA ----
const withdrawSchema = z.object({
  amount: z
    .number()
    .min(minWithdrawalAmount, `Minimum withdrawal is ${minWithdrawalAmount} ${currency}`)
    .max(maxWithdrawalAmount, `Maximum withdrawal is ${maxWithdrawalAmount} ${currency}`),

  paymentMethodId: z.number().min(1, "Please select a payment method"),
  paymentMethodName: z.string().optional(),

  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethodName === "Bank Transfer") {
    if (!data.bankName) ctx.addIssue({ code: "custom", message: "Bank name is required", path: ["bankName"] })
    if (!data.accountName) ctx.addIssue({ code: "custom", message: "Account holder name is required", path: ["accountName"] })
    if (!data.accountNumber) ctx.addIssue({ code: "custom", message: "Account number is required", path: ["accountNumber"] })
  } else if (data.paymentMethodName === "AddisPay") {
    if (!data.phoneNumber)
      ctx.addIssue({ code: "custom", message: "Phone number is required", path: ["phoneNumber"] })
    else if (!/^(\+?251|0)?9\d{8}$/.test(data.phoneNumber))
      ctx.addIssue({ code: "custom", message: "Enter a valid Ethiopian phone number", path: ["phoneNumber"] })
  }
})

type WithdrawForm = z.infer<typeof withdrawSchema>

export default function WithdrawPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { paymentMethods, fetchPaymentMethods, getDefaultPaymentMethod, balance, withdrawFund, fetchWallet } = usePaymentStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 50,
      paymentMethodId: getDefaultPaymentMethod()?.id || 0,
    },
  })

  const selectedAmount = watch("amount")
  const selectedMethodId = watch("paymentMethodId")
  const selectedMethod = useMemo(
    () => paymentMethods.find((m) => m.id === selectedMethodId),
    [paymentMethods, selectedMethodId]
  )

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  useEffect(() => {
    fetchWallet(true)
  }, [fetchWallet])

  const onSubmit = async (data: WithdrawForm) => {
    if (data.amount > balance.totalAvailableBalance) {
      console.error(`Insufficient Balance: You can only withdraw up to ${currency} ${balance.totalAvailableBalance?.toFixed(2)}`)
      return
    }

    const methodName = selectedMethod?.name || ""
    const payload = {
      paymentMethodId: data.paymentMethodId,
      amount: data.amount,
      bankName: methodName.toLowerCase().includes("bank transfer") ? data.bankName : "",
      accountName: methodName.toLowerCase().includes("bank transfer") ? data.accountName : "",
      accountNumber: methodName.toLowerCase().includes("bank transfer") ? data.accountNumber : data.phoneNumber || "",
      phonenumber: !methodName.toLowerCase().includes("bank transfer") ? data.phoneNumber : "",
    }

    setIsProcessing(true)
    try {
      await withdrawFund(
        payload.paymentMethodId,
        payload.amount,
        payload.bankName,
        payload.accountName,
        payload.accountNumber,
        payload.phonenumber
      )
      reset()
      await fetchWallet(true)
      router.push("/") // redirect after success
    } catch (error) {
      console.error("Withdrawal Failed:", error instanceof Error ? error.message : "Please try again")
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
            <Minus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Withdraw Funds</h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => router.push("/")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* <Alert>
            <AlertDescription>
              Withdrawals may take 1–3 business days. Please ensure your details match the payment method.
            </AlertDescription>
          </Alert> */}

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="mb-2 block">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              className="text-lg font-semibold"
            />
            {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}

            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>Available:</span>
              <span className="font-semibold">{currency} {balance.totalAvailableBalance?.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentMethod" className="mb-2 block">Withdraw Method</Label>
            <Select
              value={selectedMethodId?.toString()}
              onValueChange={(value) => {
                const id = Number(value)
                const method = paymentMethods.find((m) => m.id === id)
                setValue("paymentMethodId", id)
                setValue("paymentMethodName", method?.name || "")
              }}
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
                      {method.isDefault && (
                        <span className="text-xs text-muted-foreground">(Default)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethodId && <p className="text-sm text-red-600">{errors.paymentMethodId.message}</p>}
          </div>

          {/* Conditional Fields */}
          {selectedMethod?.name === "Bank Transfer" && (
            <>
              <div>
                <Label htmlFor="bankName" className="mb-2 block">Bank Name</Label>
                <Input id="bankName" {...register("bankName")} />
                {errors.bankName && <p className="text-sm text-red-600">{errors.bankName.message}</p>}
              </div>
              <div>
                <Label htmlFor="accountName" className="mb-2 block">Account Holder Name</Label>
                <Input id="accountName" {...register("accountName")} />
                {errors.accountName && <p className="text-sm text-red-600">{errors.accountName.message}</p>}
              </div>
              <div>
                <Label htmlFor="accountNumber" className="mb-2 block">Account Number</Label>
                <Input id="accountNumber" {...register("accountNumber")} />
                {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber.message}</p>}
              </div>
            </>
          )}

          {selectedMethod?.name === "AddisPay" && (
            <div>
              <Label htmlFor="phoneNumber" className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input id="phoneNumber" placeholder="e.g. 0912345678" {...register("phoneNumber")} />
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>
          )}

          {/* Buttons */}
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
              disabled={
                isProcessing ||
                paymentMethods.length === 0 ||
                (selectedAmount || 0) > balance.totalAvailableBalance
              }
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                "Withdraw"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
