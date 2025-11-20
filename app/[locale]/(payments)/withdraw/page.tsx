'use client'

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { usePaymentStore } from "@/lib/stores/payment-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Minus, CreditCard, Phone, X } from "lucide-react"
import { currency } from "@/lib/constant"
import { useTelegramInit } from "@/lib/hooks/use-telegram-init"
import Link from "next/link"

const minWithdrawalAmount = 50
const maxWithdrawalAmount = 10000

// ------------------ Zod Schema ------------------
const withdrawSchema = z.object({
  amount: z
    .number()
    .min(minWithdrawalAmount, `Minimum withdrawal is ${minWithdrawalAmount} ${currency}`)
    .max(maxWithdrawalAmount, `Maximum withdrawal is ${maxWithdrawalAmount} ${currency}`),
  paymentMethodId: z.number().min(1, "Please select a payment method"),
  paymentMethodName: z.string().optional(),
  isMobileMoney: z.boolean().optional(),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isMobileMoney) {
    if (!data.phoneNumber)
      ctx.addIssue({ code: "custom", message: "Phone number is required", path: ["phoneNumber"] })
    else if (!/^(\+?251|0)?[79]\d{8}$/.test(data.phoneNumber))
      ctx.addIssue({ code: "custom", message: "Enter a valid Ethiopian phone number", path: ["phoneNumber"] })
  } else {
    if (!data.bankName) ctx.addIssue({ code: "custom", message: "Bank name is required", path: ["bankName"] })
    if (!data.accountName) ctx.addIssue({ code: "custom", message: "Account holder name is required", path: ["accountName"] })
    if (!data.accountNumber) ctx.addIssue({ code: "custom", message: "Account number is required", path: ["accountNumber"] })
  }
})

type WithdrawForm = z.infer<typeof withdrawSchema>

// ------------------ Component ------------------
export default function WithdrawPage() {
  useTelegramInit()

  const router = useRouter()
  const {
    paymentMethods,
    fetchPaymentMethods,
    balance,
    withdrawFund,
    withdrawError,
    setWithdrawError,
    fetchWallet,
    processing,
    setProcessing
  } = usePaymentStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      paymentMethodId: 0,
    },
  })

  const selectedAmount = watch("amount")
  const selectedMethodId = watch("paymentMethodId")
  const isMobileMoneySelected = watch("isMobileMoney")
  const [isOnlineSelected, setIsOnlineSelected] = useState(true) // Online by default

  // ------------------ Filtered payment methods ------------------
  const onlinePaymentMethods = useMemo(
    () => paymentMethods
      .filter(m => ["telebirr","cbe","mpesa"].includes(m.code.toLowerCase()))
      .map(m => ({
        ...m,
        isDefault: m.code.toLowerCase() === "telebirr"
      })),
    [paymentMethods]
  )

  const offlinePaymentMethods = useMemo(
    () => paymentMethods
      .filter(m => !m.isOnline)
      .map(m => ({
        ...m,
        isDefault: m.code.toLowerCase() === "telebirr"
      })),
    [paymentMethods]
  )

  const displayedMethods = useMemo(
    () => isOnlineSelected ? onlinePaymentMethods : offlinePaymentMethods,
    [isOnlineSelected, onlinePaymentMethods, offlinePaymentMethods]
  )

  const selectedMethod = useMemo(
    () => displayedMethods.find((m) => m.id === selectedMethodId),
    [displayedMethods, selectedMethodId]
  )

  // ------------------ Fetch data ------------------
  useEffect(() => {
    setWithdrawError(null)
    const loadData = async () => {
      try {
        await Promise.all([fetchPaymentMethods(), fetchWallet(true)])
      } catch (error) {
        console.error("Failed to fetch payment data:", error)
      }
    }
    loadData()
  }, [])

  // ------------------ Default method selection ------------------
  useEffect(() => {
    const defaultMethod = displayedMethods.find(m => m.isDefault) || displayedMethods[0]
    if (defaultMethod) {
      setValue("paymentMethodId", defaultMethod.id)
      setValue("paymentMethodName", defaultMethod.name)
      setValue("isMobileMoney", defaultMethod.isMobileMoney)
    }
  }, [displayedMethods, setValue])

  // ------------------ Clear irrelevant fields ------------------
  useEffect(() => {
    if (selectedMethod) {
      if (selectedMethod.isMobileMoney) {
        resetField("bankName")
        resetField("accountName")
        resetField("accountNumber")
      } else {
        resetField("phoneNumber")
      }
    }
  }, [selectedMethod, resetField])

  // ------------------ Form submission ------------------
  const onSubmit = async (data: WithdrawForm) => {
    if (data.amount > balance.availableToWithdraw) {
      setWithdrawError(`Insufficient balance. Max: ${balance.availableToWithdraw}`)
      // console.error(`Insufficient balance. Max: ${balance.availableToWithdraw}`)
      return
    }

    const payload = data.isMobileMoney
      ? {
          paymentMethodId: data.paymentMethodId,
          amount: data.amount,
          phoneNumber: data.phoneNumber!,
          currency: "ETB",
          txnType: "WITHDRAWAL",
        }
      : {
          paymentMethodId: data.paymentMethodId,
          amount: data.amount,
          bankName: data.bankName!,
          accountName: data.accountName!,
          accountNumber: data.accountNumber!,
          currency: "ETB",
          txnType: "WITHDRAWAL",
        }

    setProcessing(true)
    const providerPaymentMethodName = isOnlineSelected ? selectedMethod?.code : selectedMethod?.name;
    const withdrawalMode = isOnlineSelected ? "ONLINE" : "OFFLINE";

    try {
      const result = await withdrawFund(
        payload.paymentMethodId,
        payload.amount,
        payload.bankName,
        payload.accountName,
        payload.accountNumber,
        payload.phoneNumber,
        payload.currency,
        payload.txnType,
        providerPaymentMethodName || "",
        withdrawalMode
      )

      if (result){
        router.replace('/withdraw/success')
      } else {
         router.replace('/withdraw/failure')
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Please try again")
    } finally {
      setProcessing(false)
    }
  }

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-between gap-2">
            <><Minus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Withdraw Funds</h2>
            </>
            <Link href="/wallet" className="text-blue-500 text-sm">
                See Wallet
            </Link>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            onClick={() => window.Telegram?.WebApp?.close?.()}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount */}
          <p className="text-red-500 text-center">{withdrawError}</p>
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
            <div className={`flex justify-between text-sm ${balance.availableToWithdraw > minWithdrawalAmount? "text-green-500": "text-red-500"} mt-1`}>
              <span>Available:</span>
              <span className="font-semibold">{currency} {(balance.availableToWithdraw ?? 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Online / Offline Radio */}
          <div>
            <Label className="mb-2 block">Withdrawal Mode</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={isOnlineSelected}
                  onChange={() => setIsOnlineSelected(true)}
                />
                Online
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!isOnlineSelected}
                  onChange={() => setIsOnlineSelected(false)}
                />
                Offline
              </label>
            </div>
          </div>

          {/* Payment Method */}
          {/* <div>
            <Label htmlFor="paymentMethod" className="mb-2 block">Withdraw Method</Label>
            <Select
              value={selectedMethodId?.toString()}
              onValueChange={(value) => {
                const id = Number(value)
                const method = displayedMethods.find((m) => m.id === id)
                setValue("paymentMethodId", id)
                setValue("paymentMethodName", method?.name || "")
                setValue("isMobileMoney", method?.isMobileMoney || false)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {displayedMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id.toString()}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{method.name}</span>
                      {method.isDefault && <span className="text-xs text-muted-foreground">(Default)</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethodId && <p className="text-sm text-red-600">{errors.paymentMethodId.message}</p>}
          </div> */}

          {/* Payment Method */}
          <div className="border-2 border-dashed p-2">
            <Label className="mb-2 block">Choose Withdraw Method</Label>

            {displayedMethods.length > 0 ? (
              <div className="space-y-3">
                {displayedMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between border rounded-xl p-3 cursor-pointer transition 
                      ${selectedMethodId === method.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-primary/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{method.name}</p>
                        {method.isDefault && (
                          <p className="text-xs text-muted-foreground">(Default)</p>
                        )}
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethodId === method.id}
                      onChange={() => {
                        setValue("paymentMethodId", method.id)
                        setValue("paymentMethodName", method.name)
                        setValue("isMobileMoney", method.isMobileMoney)
                      }}
                      className="form-radio text-primary h-4 w-4"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No payment methods available</p>
            )}

            {errors.paymentMethodId && (
              <p className="text-sm text-red-600 mt-1">{errors.paymentMethodId.message}</p>
            )}
          </div>


          {/* Conditional Fields */}
          {selectedMethod && (isMobileMoneySelected ? (
            <div>
              <Label htmlFor="phoneNumber" className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input id="phoneNumber" placeholder="e.g. 0912345678" {...register("phoneNumber")} />
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>
          ) : (
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
          ))}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.push("/")}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
             disabled={
                processing ||
                displayedMethods.length === 0 ||
                (selectedAmount || 0) > balance.availableToWithdraw ||
                balance.availableToWithdraw < Math.max(minWithdrawalAmount, 50)
              }
            >
              {processing ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />Processing...</>
              ) : "Withdraw"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
