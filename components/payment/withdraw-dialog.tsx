// "use client"

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { usePaymentStore } from "@/lib/stores/payment-store"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Minus, AlertTriangle, CreditCard } from "lucide-react"
// import { ScrollArea } from "@radix-ui/react-scroll-area"

// export const withdrawSchema = z.object({
//   amount: z
//     .number()
//     .min(10, "Minimum withdrawal is Br 10")
//     .max(1000, "Maximum withdrawal is Br 1000"),

//   paymentMethodId: z
//     .number()
//     .min(1, "Please select a payment method"),

//   bankName: z
//     .string()
//     .min(1, "Bank name is required."),

//   accountName: z
//     .string()
//     .min(1, "Account name is required."),

//   accountNumber: z
//     .string()
//     .min(1, "Account number is required."),
// });


// type WithdrawForm = z.infer<typeof withdrawSchema>

// interface WithdrawDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// export function WithdrawDialog({ open, onOpenChange }: WithdrawDialogProps) {
//   const [isProcessing, setIsProcessing] = useState(false)
//   const { paymentMethods, getDefaultPaymentMethod, balance, withdrawFund, fetchWallet } = usePaymentStore()

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<WithdrawForm>({
//     resolver: zodResolver(withdrawSchema),
//     defaultValues: {
//       amount: 50,
//       paymentMethodId: getDefaultPaymentMethod()?.id || 0,
//       bankName: ""
//     },
//   })

//   const selectedAmount = watch("amount")
//   const maxWithdraw = Math.min(balance.totalAvailableBalance, 1000)

//   const onSubmit = async (data: WithdrawForm) => {
//     if (data.amount > balance.totalAvailableBalance) {
//       console.error(`Insufficient Balance: You can only withdraw up to $${balance.totalAvailableBalance?.toFixed(2)}`)
//       return
//     }

//     setIsProcessing(true)

//     try {
      
//         const paymentMethodId = data.paymentMethodId;
//         const amount = data.amount;
//         const bankName = data.bankName;
//         const accountName = data.accountName;
//         const accountNumber = data.accountNumber

//         await withdrawFund(paymentMethodId, amount, bankName, accountName, accountNumber)

//         reset()
//         onOpenChange(false)
//         await fetchWallet(true)

//       // } else {
//       //   throw new Error(result.error || "Withdrawal failed")
//       // }
//     } catch (error) {
//       console.error("Withdrawal Failed:", error instanceof Error ? error.message : "Please try again")
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-md max-h-[100vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Minus className="h-5 w-5" />
//             Withdraw Funds
//           </DialogTitle>
//         </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <Alert>
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>
//                 Withdrawals may take 1-3 business days to process. Amounts over $500 require additional verification.
//               </AlertDescription>
//             </Alert>


//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="amount" className="py-2">Amount</Label>
//                 <div className="space-y-3">
//                   <Input
//                     id="amount"
//                     type="number"
//                     step="0.01"
//                     min="10"
//                     max={maxWithdraw}
//                     {...register("amount", { valueAsNumber: true })}
//                     className="text-lg font-semibold"
//                   />
//                   {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}

//                   <div className="flex justify-between text-sm text-muted-foreground">
//                     <span>Available to withdraw:</span>
//                     <span className="font-semibold">${balance.totalAvailableBalance?.toFixed(2)}</span>
//                   </div>

//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setValue("amount", balance.totalAvailableBalance)}
//                     disabled={balance.totalAvailableBalance <= 0}
//                     className="w-full bg-transparent"
//                   >
//                     Withdraw All (${balance.totalAvailableBalance?.toFixed(2)})
//                   </Button>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="bankName" className="py-2">Bank Name</Label>
//                 <Input
//                     id="bankName"
//                     type="text"
//                     {...register("bankName")}
//                     className="text-lg font-semibold"
//                   />
//               </div>

//               <div>
//                 <Label htmlFor="accountName" className="py-2">Account Holder Name</Label>
//                 <Input
//                     id="accountName"
//                     type="text"
//                     {...register("accountName")}
//                     className="text-lg font-semibold"
//                   />
//               </div>

//               <div>
//                 <Label htmlFor="accountNumber" className="py-2">Account Number</Label>
//                 <Input
//                     id="accountNumber"
//                     type="text"
//                     {...register("accountNumber")}
//                     className="text-lg font-semibold"
//                   />
//               </div>

//               <div>
//                 <Label htmlFor="paymentMethod"  className="py-2">Withdraw Method</Label>
//                 <Select value={watch("paymentMethodId")?.toString()} onValueChange={(value) => setValue("paymentMethodId", Number(value))}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select payment method" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {paymentMethods.map((method) => (
//                       method.name.toLowerCase().includes('bank transfer') && <SelectItem key={method.id} value={method.id?.toString()}>
//                         <div className="flex items-center gap-2">
//                           <CreditCard className="h-4 w-4" />
//                           {method.name}
//                           {method.isDefault && <span className="text-xs text-muted-foreground">(Default)</span>}
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.paymentMethodId && <p className="text-sm text-red-600">{errors.paymentMethodId.message}</p>}
//               </div>
//             </div>


//             <div className="bg-muted p-4 rounded-lg space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Withdrawal Amount:</span>
//                 <span className="font-semibold">${selectedAmount?.toFixed(2) || "0.00"}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span>Processing Fee:</span>
//                 <span className="font-semibold">$0.00</span>
//               </div>
//               <div className="border-t pt-2 flex justify-between font-semibold">
//                 <span>You'll Receive:</span>
//                 <span>${selectedAmount?.toFixed(2) || "0.00"}</span>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1 bg-transparent"
//                 onClick={() => onOpenChange(false)}
//                 disabled={isProcessing}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1"
//                 disabled={isProcessing || paymentMethods.length === 0 || (selectedAmount || 0) > balance.totalAvailableBalance}
//               >
//                 {isProcessing ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//                     Processing...
//                   </>
//                 ) : (
//                   "Withdraw"
//                 )}
//               </Button>
//             </div>
//           </form>
        
//       </DialogContent>
//     </Dialog>
//   )
// }


// =====================================

"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { usePaymentStore } from "@/lib/stores/payment-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Minus, CreditCard, Phone } from "lucide-react"
import { currency } from "@/lib/constant"

const minWithdrawalAmount = 50
var maxWithdrawalAmount = 10000
const withdrawSchema = z.object({
  amount: z
    .number()
    .min(minWithdrawalAmount, `Minimum withdrawal is ${minWithdrawalAmount} ${currency}`)
    .max(maxWithdrawalAmount, `Maximum withdrawal is ${maxWithdrawalAmount} ${currency}`),

  paymentMethodId: z.number().min(1, "Please select a payment method"),
  paymentMethodName: z.string().optional(),

  // Optional fields – validated conditionally below
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  // conditional validation based on method name (attached later)
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
    },
  })

  const selectedAmount = watch("amount")
  const selectedMethodId = watch("paymentMethodId")
  const selectedMethod = useMemo(
    () => paymentMethods.find(m => m.id === selectedMethodId),
    [paymentMethods, selectedMethodId]
  )

  // const maxWithdraw = Math.min(balance.availableToWithdraw, 1000)

  maxWithdrawalAmount = balance.availableToWithdraw;

  const onSubmit = async (data: WithdrawForm) => {
    if (data.amount > balance.totalAvailableBalance) {
      console.error(`Insufficient Balance: You can only withdraw up to Br ${balance.totalAvailableBalance?.toFixed(2)}`)
      return
    }

    const methodName = selectedMethod?.name || ""
    const payload = {
      paymentMethodId: data.paymentMethodId,
      amount: data.amount,
      bankName: methodName.toLowerCase().includes("bank transfer") ? data.bankName : "",
      accountName: methodName.toLowerCase().includes("bank transfer")  ? data.accountName : "",
      accountNumber: methodName.toLowerCase().includes("bank transfer")  ? data.accountNumber : data.phoneNumber || "",
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
      onOpenChange(false)
      await fetchWallet(true)
    } catch (error) {
      console.error("Withdrawal Failed:", error instanceof Error ? error.message : "Please try again")
    } finally {
      setIsProcessing(false)
    }
  }

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
          {/* <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Withdrawals may take 1–3 business days. Please ensure the provided info matches your selected payment method.
            </AlertDescription>
          </Alert> */}

          <div className="space-y-4">
            {/* Amount */}
            <div className="mb-2">
              <Label htmlFor="amount" className=" mb-2">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                // min="10"
                // max={maxWithdrawalAmount}
                {...register("amount", { valueAsNumber: true })}
                className="text-lg font-semibold"
              />
              {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}

              <div className={`flex justify-between text-sm text-muted-foreground mt-1 ${balance.availableToWithdraw > minWithdrawalAmount ? "text-green-600!" : "text-red-600"}`}>
                <span className="">Available to withdraw:</span>
                <span className="font-semibold">Br {balance.availableToWithdraw?.toFixed(2)}</span>
              </div>

              {/* <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue("amount", balance.totalAvailableBalance)}
                disabled={balance.totalAvailableBalance <= 0}
                className="w-full mt-2 bg-transparent"
              >
                Withdraw All (Br {balance.totalAvailableBalance?.toFixed(2)})
              </Button> */}
            </div> 

            {/* Payment Method */}
            <div className="mb-2">
              <Label htmlFor="paymentMethod" className="mb-2">Withdraw Method</Label>
              <Select
                value={selectedMethodId?.toString()}
                onValueChange={(value) => {
                  const id = Number(value)
                  const method = paymentMethods.find(m => m.id === id)
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
                        {method.isDefault && <span className="text-xs text-muted-foreground">(Default)</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paymentMethodId && (
                <p className="text-sm text-red-600">{errors.paymentMethodId.message}</p>
              )}
            </div>

            {/* Conditional Fields */}
            {selectedMethod?.name === "Bank Transfer" && (
              <>
                <div>
                  <Label htmlFor="bankName" className="mb-2">Bank Name</Label>
                  <Input id="bankName" {...register("bankName")} />
                  {errors.bankName && <p className="text-sm text-red-600">{errors.bankName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="accountName" className="mb-2">Account Holder Name</Label>
                  <Input id="accountName" {...register("accountName")} />
                  {errors.accountName && <p className="text-sm text-red-600">{errors.accountName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="mb-2">Account Number</Label>
                  <Input id="accountNumber" {...register("accountNumber")} />
                  {errors.accountNumber && <p className="text-sm text-red-600">{errors.accountNumber.message}</p>}
                </div>
              </>
            )}

            {selectedMethod?.name === "AddisPay" && (
              <div>
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="e.g. 0912345678"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
              </div>
            )}
          </div>

          {/* Summary */}
          {/* <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Withdrawal Amount:</span>
              <span className="font-semibold">Br {selectedAmount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Processing Fee:</span>
              <span className="font-semibold">Br 0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>You'll Receive:</span>
              <span>Br {selectedAmount?.toFixed(2) || "0.00"}</span>
            </div>
          </div> */}

          {/* Buttons */}
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
              disabled={
                isProcessing ||
                paymentMethods.length === 0 ||
                 (selectedAmount || 0) > balance.availableToWithdraw
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
      </DialogContent>
    </Dialog>
  )
}

