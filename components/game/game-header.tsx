"use client"

import {  EarIcon, EarOffIcon } from "lucide-react"
import { useGameStore } from "@/lib/stores/game-store"
import { useRoomStore } from "@/lib/stores/room-store"
import type { Room } from "@/lib/types"
import { currency } from "@/lib/constant"
import { useSystemStore } from "@/lib/stores/system-store"

interface GameHeaderProps {
  room: Room | undefined | null
  connected: boolean
}

export function GameHeader({ room, connected }: GameHeaderProps) {
  const game = useGameStore(state => state.game)
  const currentRoom = useRoomStore(state => state.room)
  const {systemConfigs, voiceOn, setVoiceOn} = useSystemStore();

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
        room ? (game.allSelectedCardsIds.length * room.entryFee * (1.0 - Number(commisionRate))).toFixed(2) : 0
      }`,
      bg: "bg-green-600",
    },
    {
      label: "Players",
      value: game.joinedPlayers.length,
      bg: "bg-yellow-600",
    },
  ]

  // alert(commisionRate)

  return (
    // <header className={`bg-card border-1 px-4 py-2 ${connected ? "border-green-500" : "border-red-500"}`}>
    //   <div className="container flex items-center justify-between gap-2 whitespace-nowrap">
    //     {/* Stats */}
    //     <div className="flex gap-2">
    //       {stats.map((stat, idx) => (
    //         <div
    //           key={idx}
    //           className={`${stat.bg} text-white px-3 py-1 rounded-md text-center min-w-[60px]`}
    //         >
    //           <div className="text-xs font-medium">{stat.label}</div>
    //           <div className="text-xs">{stat.value}</div>
    //         </div>
    //       ))}
    //     </div>

        
    //     <div className="bg-yellow-500 px-3 py-1 rounded-md min-w-[60px] flex items-center justify-center">
    //       <div onClick={() => setVoiceOn(!voiceOn)} className="cursor-pointer flex flex-col items-center">
    //         {voiceOn ? (
    //           <div className="text-blue-500 flex flex-col items-center">
    //             <EarIcon className="w-4 h-4" />
    //             <p className="text-xs">Mute</p>
    //           </div>
    //         ) : (
    //           <div className="text-red-500 flex flex-col items-center">
    //             <EarOffIcon className="w-4 h-4" />
    //             <p className="text-xs">Unmute</p>
    //           </div>
    //         )}
    //       </div>
    //     </div>


    //     {/* Connection Status */}
    //     {/* <div
    //       className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
    //         connected ? "text-green-600 bg-white-950" : "text-red-600 bg-white"
    //       }`}
    //     >
    //       {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
    //       <span className="hidden sm:inline">{connected ? "Connected" : "Disconnected"}</span>
    //     </div> */}
    //   </div>
    // </header>



    <header
        className={`bg-card border px-3 sm:px-4 py-2 ${
          connected ? "border-green-500" : "border-red-500"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mx-auto max-w-screen-xl">
          {/* Stats */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start flex-grow">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.bg} text-white px-2 sm:px-3 py-1 rounded-md text-center flex flex-col items-center min-w-[60px] sm:min-w-[80px]`}
              >
                <div className="text-[10px] sm:text-xs font-medium">{stat.label}</div>
                <div className="text-[10px] sm:text-xs">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Voice Toggle */}
          <div className="bg-yellow-500 px-2 sm:px-3 py-1 rounded-md flex items-center justify-center">
            <button
              onClick={() => setVoiceOn(!voiceOn)}
              className="cursor-pointer flex flex-col items-center"
            >
              {voiceOn ? (
                <div className="text-blue-700 flex flex-col items-center">
                  <EarIcon className="w-4 h-4" />
                  <p className="text-[10px] sm:text-xs">Mute</p>
                </div>
              ) : (
                <div className="text-red-700 flex flex-col items-center">
                  <EarOffIcon className="w-4 h-4" />
                  <p className="text-[10px] sm:text-xs">Unmute</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>


  )
}
