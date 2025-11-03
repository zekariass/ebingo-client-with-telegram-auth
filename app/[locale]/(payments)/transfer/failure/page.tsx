"use client"

import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export default function TransferFailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason") || "Something went wrong during your transfer."

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
          Transfer Failed 😞
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {reason}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/transfer")}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/wallet")}
            className="w-full"
          >
            Go to Wallet
          </Button>

          <Button
            variant="outline"
            onClick={() => window.Telegram?.WebApp.close()}
            className="w-full"
          >
            Back To Telegram
          </Button>
        </div>
      </div>
    </div>
  )
}
