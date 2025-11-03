"use client"

import { Button } from "@/components/ui/button"
import { WalletBalance } from "@/components/payment/wallet-balance"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { TransactionHistory } from "@/components/payment/transaction-history"
import Link from "next/link"
import { DialogTitle } from "@radix-ui/react-dialog"
import { userStore } from "@/lib/stores/user-store"
import { UserRole } from "@/lib/types"
import { GameTransactionHistory } from "../payment/game-transaction-history"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CreditCard, Info, ReceiptIcon, Settings, Wallet } from "lucide-react"
import GameInstructions from "../common/game-insructions"
import { Badge } from "../ui/badge"

export function LobbyHeader() {
  const [walletOpen, setWalletOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [gameHistoryOpen, setGameHistoryOpen] = useState(false)
  const [instructionOPen, setInstructionOPen] = useState(false)

  // const {user, loading} = useSession();
  const user = userStore((state) => state.user);

  const router =  useRouter()

  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl sm:text-2xl font-bold dark:text-white">
                Bingo Fam
              </Link>
              {/* <Link href="/chapa-test">Chapa</Link> */}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {!user && 
              <>
              {/* <LoginButton />
              <SignupButton /> */}
              </>
              }
              {user && 
              <>
              
              <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <Wallet className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Wallet</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Your Wallet
                    </DialogTitle>
                  </DialogHeader>
                  <WalletBalance />
                </DialogContent>
              </Dialog>

              <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <ReceiptIcon className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Transactions</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Deposits and Withdrawals
                    </DialogTitle>
                  </DialogHeader>
                  <TransactionHistory />
                </DialogContent>
              </Dialog>

              <Dialog open={gameHistoryOpen} onOpenChange={setGameHistoryOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <CreditCard className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Game Payments</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Game fees and prizes
                    </DialogTitle>
                  </DialogHeader>
                  <GameTransactionHistory />
                </DialogContent>
              </Dialog>

              {user?.role === UserRole.ADMIN && 
              <Button variant="secondary" size="sm" asChild>
                <Link href="/admin/rooms">
                  <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>}
              
              <Dialog open={instructionOPen} onOpenChange={setInstructionOPen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <Info className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Game Instructions</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Game Instructions
                    </DialogTitle>
                  </DialogHeader>
                  <GameInstructions />
                </DialogContent>
              </Dialog>


              {/* <HeaderUserDropdown /> */}
              {/* <ModeToggle /> */}
            
              {user && <Badge variant="outline"><span className="font-bold text-blue-500">Hi,</span> <span className="text-green-800 font-bold">{user.firstName?.split(' ')[0]}</span></Badge>}

              </>}
            </div>
              {/* <ConnectionStatus /> */}

          </div>
        </div>
      </header>
    </>
  )
}
