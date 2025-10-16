"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { WalletBalance } from "@/components/payment/wallet-balance"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { TransactionHistory } from "@/components/payment/transaction-history"
import { CreditCard, FileTextIcon, History, ListOrdered, ListOrderedIcon, ReceiptIcon, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "@/hooks/use-session"
import HeaderUserDropdown from "./header-user-dropdown"
import LoginButton from "../auth/login-button"
import SignupButton from "../auth/signup-button"
import { DialogTitle } from "@radix-ui/react-dialog"
import { userStore } from "@/lib/stores/user-store"
import { UserRole } from "@/lib/types"
import { GameTransactionHistory } from "../payment/game-transaction-history"
import { useRouter } from "next/navigation"
import i18n from "@/i18n"

export function LobbyHeader() {
  const [walletOpen, setWalletOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [gameHistoryOpen, setGameHistoryOpen] = useState(false)

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
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {!user && 
              <>
              <LoginButton />
              <SignupButton />
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
              <HeaderUserDropdown />
              {/* <ModeToggle /> */}
              </>}
            </div>

          </div>
        </div>
      </header>
    </>
  )
}
