"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftRight, Phone, Send } from "lucide-react"
import { usePaymentStore } from "@/lib/stores/payment-store"
import { useRouter } from "next/navigation"
import { useTelegramInit } from "@/lib/hooks/use-telegram-init"
import Link from "next/link"

const minTransfer = 10

// Phone validation pattern for Ethiopian numbers
const phoneRegex = /^(09|07|\+2519|\+2517|2519|2517)\d{8}$/;

// 🔹 Dynamic Zod schema builder
const buildTransferSchema = (maxTransferable: number) =>
  z.object({
    phone: z
      .string()
      .regex(phoneRegex, "Phone must start with 09, 07, +2519, or +2517 and contain valid digits")
      .min(10, "Phone number too short")
      .max(15, "Phone number too long"),
    amount: z
      .number()
      .min(minTransfer, `Minimum transfer is Br ${minTransfer}`)
      .max(maxTransferable, `Insufficient fund: ${maxTransferable}`),
  })

type TransferForm = z.infer<ReturnType<typeof buildTransferSchema>>

export default function TransferPage() {
  const router = useRouter()
  const { balance, transferFunds, transferError, setTransferError, fetchWallet } = usePaymentStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const maxTransferable = useMemo(
    () => Math.min(10000, Math.max(0, (balance?.availableToWithdraw ?? 0) - minTransfer)),
    [balance?.availableToWithdraw]
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

  useEffect(()=>{
    setTransferError(null)
  },[])

  useEffect(() => {
    fetchWallet(true)
  }, [fetchWallet])

  
  const onSubmit = async (data: TransferForm) => {
      if (data.amount > balance.availableToWithdraw) {
        setTransferError("Insufficient balance");
        return;
      }

      setIsProcessing(true);

      try {
        const success = await transferFunds(data.amount, data.phone);

        if (success) {
          router.push("/transfer/success"); 
        }else {
          router.push("/transfer/failure"); 
        }
        // if not success, error will be in transferError and displayed automatically
      } catch (error) {
        console.error("Transfer failed:", error);
      } finally {
        setIsProcessing(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Transfer Funds</h2>
            </div>
            <Link href="/wallet" className="text-blue-500 text-sm">
                See Wallet
            </Link>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            onClick={() => {
              if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.close()
              }
            }}
          >
            X
          </button>
        </div>

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
              {...register("amount", { valueAsNumber: true })}
              className="text-lg font-semibold"
            />
            {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>}

            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Available Balance:</span>
              <span className="font-semibold">Br {balance.availableToWithdraw?.toFixed(2)}</span>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Max transferable: <span className="font-semibold">Br {maxTransferable.toFixed(2)}</span>
            </p>
          </div>

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
              disabled={isProcessing || (selectedAmount || 0) > balance.availableToWithdraw}
            >
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
          <p className="text-red-500 text-center">{transferError}</p>
        </form>
      </div>
    </div>
  )
}
