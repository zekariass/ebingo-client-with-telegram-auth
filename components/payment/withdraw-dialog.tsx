"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { usePaymentStore } from "@/lib/stores/payment-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Minus, AlertTriangle, CreditCard } from "lucide-react"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export const withdrawSchema = z.object({
  amount: z
    .number()
    .min(10, "Minimum withdrawal is Br 10")
    .max(1000, "Maximum withdrawal is Br 1000"),

  paymentMethodId: z
    .number()
    .min(1, "Please select a payment method"),

  bankName: z
    .string()
    .min(1, "Bank name is required."),

  accountName: z
    .string()
    .min(1, "Account name is required."),

  accountNumber: z
    .string()
    .min(1, "Account number is required."),
});


type WithdrawForm = z.infer<typeof withdrawSchema>

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawDialog({ open, onOpenChange }: WithdrawDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { paymentMethods, getDefaultPaymentMethod, balance, withdrawFund, fetchWallet } = usePaymentStore()

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
      bankName: ""
    },
  })

  const selectedAmount = watch("amount")
  const maxWithdraw = Math.min(balance.totalAvailableBalance, 1000)

  const onSubmit = async (data: WithdrawForm) => {
    if (data.amount > balance.totalAvailableBalance) {
      console.error(`Insufficient Balance: You can only withdraw up to $${balance.totalAvailableBalance?.toFixed(2)}`)
      return
    }

    setIsProcessing(true)

    try {
      
        const paymentMethodId = data.paymentMethodId;
        const amount = data.amount;
        const bankName = data.bankName;
        const accountName = data.accountName;
        const accountNumber = data.accountNumber

        await withdrawFund(paymentMethodId, amount, bankName, accountName, accountNumber)

        reset()
        onOpenChange(false)
        await fetchWallet(true)

      // } else {
      //   throw new Error(result.error || "Withdrawal failed")
      // }
    } catch (error) {
      console.error("Withdrawal Failed:", error instanceof Error ? error.message : "Please try again")
    } finally {
      setIsProcessing(false)
    }
  }

  // const getPaymentMethodDisplay = (method: any) => {
  //   switch (method.type) {
  //     case "credit_card":
  //     case "debit_card":
  //       return `${method.brand} ****${method.last4}`
  //     case "paypal":
  //       return "PayPal Account"
  //     case "bank_account":
  //       return `Bank ****${method.last4}`
  //     default:
  //       return method.nickname || method.type
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Minus className="h-5 w-5" />
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Withdrawals may take 1-3 business days to process. Amounts over $500 require additional verification.
              </AlertDescription>
            </Alert>


            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="py-2">Amount</Label>
                <div className="space-y-3">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    max={maxWithdraw}
                    {...register("amount", { valueAsNumber: true })}
                    className="text-lg font-semibold"
                  />
                  {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Available to withdraw:</span>
                    <span className="font-semibold">${balance.totalAvailableBalance?.toFixed(2)}</span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("amount", balance.totalAvailableBalance)}
                    disabled={balance.totalAvailableBalance <= 0}
                    className="w-full bg-transparent"
                  >
                    Withdraw All (${balance.totalAvailableBalance?.toFixed(2)})
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="bankName" className="py-2">Bank Name</Label>
                <Input
                    id="bankName"
                    type="text"
                    {...register("bankName")}
                    className="text-lg font-semibold"
                  />
              </div>

              <div>
                <Label htmlFor="accountName" className="py-2">Account Holder Name</Label>
                <Input
                    id="accountName"
                    type="text"
                    {...register("accountName")}
                    className="text-lg font-semibold"
                  />
              </div>

              <div>
                <Label htmlFor="accountNumber" className="py-2">Account Number</Label>
                <Input
                    id="accountNumber"
                    type="text"
                    {...register("accountNumber")}
                    className="text-lg font-semibold"
                  />
              </div>

              <div>
                <Label htmlFor="paymentMethod"  className="py-2">Withdraw Method</Label>
                <Select value={watch("paymentMethodId")?.toString()} onValueChange={(value) => setValue("paymentMethodId", Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      method.name.toLowerCase().includes('bank transfer') && <SelectItem key={method.id} value={method.id?.toString()}>
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
            </div>


            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Withdrawal Amount:</span>
                <span className="font-semibold">${selectedAmount?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>You'll Receive:</span>
                <span>${selectedAmount?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isProcessing || paymentMethods.length === 0 || (selectedAmount || 0) > balance.totalAvailableBalance}
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
        
      </DialogContent>
    </Dialog>
  )
}
