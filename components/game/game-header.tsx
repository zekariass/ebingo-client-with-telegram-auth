// "use client"

// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Wifi, WifiOff } from "lucide-react"
// import { useRouter } from "next/navigation"
// import type { Room } from "@/lib/types"
// import { useGameStore } from "@/lib/stores/game-store"
// import { useRoomStore } from "@/lib/stores/room-store"

// interface GameHeaderProps {
//   room: Room | undefined | null
//   connected: boolean
// }

// export function GameHeader({ room, connected }: GameHeaderProps) {
//   const router = useRouter()
//   const game = useGameStore(state => state.game)
//   const currentRoom = useRoomStore(state => state.room)

//   return (
//     <header className="bg-card border-b px-4 py-3">
//       <div className="container mx-auto flex items-center justify-between">
       
//         <div className="flex flex-row">
//           {[1, 2, 3, 4].map((item) => {
//             if (item === 1)
//               return (
//                 <div key={item} className="mr-1 px-2 bg-blue-600 rounded-xs">
//                   <div className="text-center">Game Id</div>
//                   <div className="text-center"># {game.gameId}</div>
//                 </div>
//               );

//             if (item === 2)
//               return (
//                 <div key={item} className="mr-1 px-2 bg-red-600 rounded-xs">
//                   <div className="text-center">Bet</div>
//                   <div className="text-center">Br {currentRoom?.entryFee}</div>
//                 </div>
//               );

//             if (item === 3)
//               return (
//                 <div key={item} className="mr-1 px-2 bg-green-600 rounded-xs">
//                   <div className="text-center">Prize</div>
//                   <div className="text-center">
//                     Br {room ? game.userSelectedCards.length * room?.entryFee * 0.75: 0}
//                   </div>
//                 </div>
//               );

//             if (item === 4)
//               return (
//                 <div key={item} className="mr-1 px-2 bg-yellow-600 rounded-xs">
//                   <div className="text-center">Players</div>
//                   <div className="text-center">{game.joinedPlayers.length}</div>
//                 </div>
//               );

//             return null;
//           })}
//         </div>



//         <div className="flex items-center gap-2 bg-white rounded-xs m-1 p-2">
//           {connected ? (
//             <div className="flex items-center gap-1 text-green-600">
//               <Wifi className="h-4 w-4" />
//               <span className="text-xs hidden sm:inline">Connected</span>
//             </div>
//           ) : (
//             <div className="flex items-center gap-1 text-red-600">
//               <WifiOff className="h-4 w-4" />
//               <span className="text-xs hidden sm:inline">Disconnected</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

"use client"

import { Wifi, WifiOff } from "lucide-react"
import { useGameStore } from "@/lib/stores/game-store"
import { useRoomStore } from "@/lib/stores/room-store"
import type { Room } from "@/lib/types"
import { currency } from "@/lib/constant"
import { Button } from "../ui/button"
import { useSystemStore } from "@/lib/stores/system-store"
import { number } from "zod"

interface GameHeaderProps {
  room: Room | undefined | null
  connected: boolean
}

export function GameHeader({ room, connected }: GameHeaderProps) {
  const game = useGameStore(state => state.game)
  const currentRoom = useRoomStore(state => state.room)
  const systemConfigs = useSystemStore(state => state.systemConfigs);

  const commisionRate = systemConfigs?.find(config => config.name === "COMMISSION_RATE")?.value || "0.30";

  const stats = [
    {
      label: "Game Id",
      value: `# ${game.gameId}`,
      bg: "bg-blue-600",
    },
    {
      label: "Bet",
      value: `${currency} ${currentRoom?.entryFee ?? 0}`,
      bg: "bg-red-600",
    },
    {
      label: "Prize",
      value: `${currency} ${
        room ? (game.userSelectedCards.length * room.entryFee * 1.0 - Number(commisionRate)).toFixed(2) : 0
      }`,
      bg: "bg-green-600",
    },
    {
      label: "Players",
      value: game.joinedPlayers.length,
      bg: "bg-yellow-600",
    },
  ]

  return (
    <header className="bg-card border-b px-4 py-2">
      <div className="container mx-auto flex items-center justify-between gap-2 whitespace-nowrap">
        {/* Stats */}
        <div className="flex gap-2">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bg} text-white px-3 py-1 rounded-md text-center min-w-[60px]`}
            >
              <div className="text-xs font-medium">{stat.label}</div>
              <div className="text-xs">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Connection Status */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
            connected ? "text-green-600 bg-white-950" : "text-red-600 bg-white"
          }`}
        >
          {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          <span className="hidden sm:inline">{connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>
    </header>
  )
}
