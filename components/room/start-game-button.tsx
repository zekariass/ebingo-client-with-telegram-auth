// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { useRoomStore } from "@/lib/stores/room-store"
// import { usePaymentStore } from "@/lib/stores/payment-store"
// import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
// import { CreditCard } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useToast } from "@/components/ui/use-toast"
// import { useGameStore } from "@/lib/stores/game-store"
// import { userStore } from "@/lib/stores/user-store"
// import i18n from "@/i18n"
// import { currency } from "@/lib/constant"

// interface StartGameButtonProps {
//   disabled: boolean
//   selectedCards: number
//   fee: number
// }

// export function StartGameButton({ disabled, selectedCards, fee }: StartGameButtonProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

//   const { room } = useRoomStore()
//   const { game: {gameId, started} } = useGameStore()
//   const userProfileId = userStore(state => state.user?.id)
//   const { balance } = usePaymentStore()
//   const router = useRouter()
//   const { toast } = useToast()

//   const { connected, joinGame } = useWebSocketEvents({
//     roomId: room?.id || -1,
//     enabled: true,
//   })

//   const totalCost = fee * selectedCards
//   const canAfford = balance.totalAvailableBalance >= totalCost

//   // Prefetch the game page
//   router.prefetch(`/${i18n.language}/rooms/${room?.id}/game`)

//   const handleStartGame = () => {
//     // if (joinedPlayers.includes(telegramId.toString())){
//     //   router.push(`/${i18n.language}/rooms/${room?.id}/game`)
//     //   return false
//     // }
//     if (totalCost || canAfford){
//       return true
//     }
//     return false
//   }

//   const handleConfirmAndPay = async () => {
//     if (!canAfford) {
//       toast({
//         variant: "destructive",
//         title: "Insufficient Balance",
//         description: `You need $${totalCost.toFixed(2)} but only have $${balance.totalAvailableBalance.toFixed(2)}`,
//       })
//       return
//     }

//     if (!connected) {
//       toast({
//         title: "Connection Required",
//         description: "Please wait for connection to be established",
//       })
//       return
//     }

//     setIsProcessing(true)

//     try {
      
//       if (userProfileId){
//         joinGame(gameId, totalCost)
//       }else {
//         throw new Error("userProfileId (playerId) is null or undefined!")
//       }

//       if (started){
//         toast({
//         title: "Game Started!",
//         description: `Successfully joined with ${selectedCards} card${selectedCards > 1 ? "s" : ""}.`,
//       })
//       }

//       setIsOpen(false)
//       // router.push(`/rooms/${room?.id}/game`)
//     } catch (error) {
//       console.error("Game Start Failed:", error)
//       toast({
//         variant: "destructive",
//         title: "Game Start Failed",
//         description: "Please try again or contact support",
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <Button
//           size="lg"
//           className="w-full flex flex-col items-center justify-center gap-1 text-center"
//           disabled={disabled || !canAfford || !connected}
//           variant={canAfford ? "default" : "destructive"}
//           onClick={() => {
//             const ok = handleStartGame()
//             if (!ok) setIsOpen(true)
//             if (ok) handleConfirmAndPay()
//           }}
//         >
//           {(canAfford && connected) && <span>
//             Start Game ({totalCost.toFixed(2)} {currency})
//           </span>}
          
//           {!canAfford && (
//             <span className="text-sm font-medium text-yellow-500 leading-none">
//               Insufficient Funds - ({totalCost.toFixed(2)} {currency})
//             </span>
//           )}
//         </Button>


//       <DialogContent className="pr-8">
//         <DialogHeader>
//           <DialogTitle>Confirm Game Entry</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="bg-muted p-4 rounded-lg space-y-2">
//             <div className="flex justify-between">
//               <span>Selected Cards:</span>
//               <span className="font-semibold">{selectedCards}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Bet per Card:</span>
//               <span className="font-semibold">{fee.toFixed(2)} {currency}</span>
//             </div>
//             <div className="border-t pt-2 flex justify-between text-lg font-bold">
//               <span>Total Cost:</span>
//               <span>{totalCost.toFixed(2)} {currency}</span>
//             </div>
//           </div>

//           <div className="flex justify-between items-center p-3 bg-card border rounded-lg">
//             <span>Current Balance:</span>
//             <span
//               className={`font-semibold ${
//                 canAfford ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {balance.totalAvailableBalance.toFixed(2)} {currency}
//             </span>
//           </div>

//           {!canAfford && (
//             <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
//               <p className="text-red-700 dark:text-red-300 text-sm">
//                 Insufficient balance. Please add funds to your account.
//               </p>
//             </div>
//           )}

//           {!connected && (
//             <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
//               <p className="text-yellow-700 dark:text-yellow-300 text-sm">
//                 Connection required. Please wait for connection to be established.
//               </p>
//             </div>
//           )}

//           <div className="flex gap-3">
//             <Button
//               variant="outline"
//               className="flex-1 bg-transparent"
//               onClick={() => setIsOpen(false)}
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             {/* <Button
//               className="flex-1"
//               onClick={handleConfirmAndPay}
//               disabled={!canAfford || isProcessing}
//             >
//               {isProcessing ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <CreditCard className="h-4 w-4 mr-2" />
//                   Confirm & Pay
//                 </>
//               )}
//             </Button> */}
//           </div>
//         </div>
//       </DialogContent>
//   </Dialog>

//   )
// }



"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRoomStore } from "@/lib/stores/room-store"
import { usePaymentStore } from "@/lib/stores/payment-store"
import { useWebSocketEvents } from "@/lib/hooks/websockets/use-websocket-events"
import { useGameStore } from "@/lib/stores/game-store"
import { userStore } from "@/lib/stores/user-store"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import i18n from "@/i18n"
import { currency } from "@/lib/constant"

interface StartGameButtonProps {
  disabled?: boolean
  selectedCards: number
  fee: number
}

export function StartGameButton({ disabled = false, selectedCards, fee }: StartGameButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const { room } = useRoomStore()
  const { game: { gameId } } = useGameStore()
  const userProfileId = userStore(state => state.user?.id)
  const { balance } = usePaymentStore()
  const { toast } = useToast()
  const router = useRouter()

  const totalCost = fee * selectedCards
  const canAfford = balance.totalAvailableBalance >= totalCost

  const { connected, joinGame } = useWebSocketEvents({
    roomId: room?.id ?? undefined,
    enabled: !!room?.id,
  })

  // Prefetch game page once
  useEffect(() => {
    if (room?.id) {
      router.prefetch(`/${i18n.language}/rooms/${room.id}/game`)
    }
  }, [room?.id, router])

  const handleStartGame = async () => {
    if (!canAfford) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `You need $${totalCost.toFixed(2)} but only have $${balance.totalAvailableBalance.toFixed(2)}`,
      })
      return
    }

    if (!connected) {
      toast({
        title: "Connection Required",
        description: "Please wait for connection to be established.",
      })
      return
    }

    if (!userProfileId) {
      toast({
        variant: "destructive",
        title: "User Not Found",
        description: "Unable to identify your profile.",
      })
      return
    }

    setIsProcessing(true)
    try {
      await joinGame(gameId, totalCost)

      toast({
        title: "Game Started!",
        description: `You joined with ${selectedCards} card${selectedCards > 1 ? "s" : ""}.`,
      })

      router.push(`/${i18n.language}/rooms/${room?.id}/game`)
    } catch (error) {
      console.error("Game Start Failed:", error)
      toast({
        variant: "destructive",
        title: "Game Start Failed",
        description: "Please try again or contact support.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Decide button text
  let buttonText = ""
  if (!connected) buttonText = "Connecting..."
  else if (!canAfford) buttonText = `Insufficient Funds (${totalCost.toFixed(2)} ${currency})`
  else buttonText = `Start Game (${totalCost.toFixed(2)} ${currency})`

  return (
    <Button
      size="lg"
      className={`w-full flex items-center justify-center gap-2 text-center ${!connected ? "bg-red-700 text-white": ""}`}
      disabled={disabled || !connected || !canAfford || isProcessing}
      variant={!connected ? "secondary" : canAfford ? "default" : "destructive"}
      onClick={handleStartGame}
    >
      {isProcessing && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
      )}
      {buttonText}
    </Button>
  )
}
