// "use client"

// import { useMemo } from "react"
// import { useLobbyStore } from "@/lib/stores/lobby-store"
// import type { Room } from "@/lib/types"
// import { RoomCarousel } from "./room-carousel"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
// import { ChevronDown } from "lucide-react"

// interface RoomGridProps {
//   rooms: Room[]
//   loading: boolean
// }

// export function RoomGrid({ rooms, loading }: RoomGridProps) {
//   const { filters } = useLobbyStore()

//   const safeRooms = Array.isArray(rooms) ? rooms : []

//   const filteredRooms = useMemo(() => {
//     return safeRooms.filter((room) => {
//       // Fee filter
//       if (filters.fee && room.entryFee !== filters.fee) {
//         return false
//       }

//       // Status filter
//       if (filters.status && room.status !== filters.status) {
//         return false
//       }

//       // Search filter
//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase()
//         return room.name.toLowerCase().includes(searchLower)
//       }

//       return true
//     })
//   }, [safeRooms, filters])

//   const { practiceRooms, regularRooms } = useMemo(() => {
//     const test = filteredRooms.filter((room) => room.isForPractice)
//     const regular = filteredRooms.filter((room) => !room.isForPractice)
//     return { practiceRooms: test, regularRooms: regular }
//   }, [filteredRooms])

//   const roomsByFee = useMemo(() => {
//     const grouped = regularRooms.reduce(
//       (acc, room) => {
//         if (!acc[room.entryFee]) {
//           acc[room.entryFee] = []
//         }
//         acc[room.entryFee].push(room)
//         return acc
//       },
//       {} as Record<number, Room[]>,
//     )

//     // Sort by fee ascending
//     return Object.entries(grouped)
//       .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
//       .map(([fee, rooms]) => ({
//         fee: Number.parseInt(fee),
//         rooms: rooms.sort((a, b) => {
//           // Sort by status priority: open > starting > in-game
//           const statusPriority = { OPEN: 0, CLOSED: 1}
//           const aPriority = statusPriority[a.status]
//           const bPriority = statusPriority[b.status]
//           // if (aPriority !== bPriority) return aPriority - bPriority
//           return aPriority - bPriority

//           // Then by occupancy (less full first for open rooms)
//           // return a / a.capacity - b.players / b.capacity
//         }),
//       }))
//   }, [regularRooms])

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-lg text-muted-foreground">Loading rooms...</div>
//       </div>
//     )
//   }

//   if (practiceRooms.length === 0 && roomsByFee.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <h3 className="text-lg font-semibold text-muted-foreground">No rooms found</h3>
//         <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* {practiceRooms.length > 0 && (
//         <div className="space-y-4">
//           <div className="flex items-center gap-2">
//             <h2 className="text-2xl font-bold">Test Room</h2>
//             <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Demo Mode</span>
//           </div>
//           <RoomCarousel fee={10} rooms={practiceRooms} />
//         </div>
//       )} */}

//       {practiceRooms.length > 0 && (
//         <Accordion
//           type="single"
//           collapsible
//           className="w-full rounded-2xl border border-gray-400 dark:bg-gray-600 shadow-sm"
//         >
//           <AccordionItem value="test-room" className="border-b-0">
//             <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-left">
//               <div className="flex items-center gap-2">
//                 <h2 className="text-xl font-semibold text-gray-900">Practice Room</h2>
//                 {/* <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//                   Demo Mode
//                 </span> */}
//               </div>
//               {/* Chevron indicator */}
//               <div className="flex justify-end">
//                 <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 accordion-trigger-icon" />
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="px-4 pb-4">
//               <RoomCarousel fee={10} rooms={practiceRooms} />
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion>
//       )}

//       {roomsByFee.length > 0 && (
//         <>
//           {practiceRooms.length > 0 && <div className="border-t border-border" />}
//           {roomsByFee.map(({ fee, rooms }) => (
//             <RoomCarousel key={fee} fee={fee} rooms={rooms} />
//           ))}
//         </>
//       )}
//     </div>
//   )
// }



"use client"

import { useMemo } from "react"
import { useLobbyStore } from "@/lib/stores/lobby-store"
import { RoomStatus, type Room } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import { useRouter } from "next/navigation"
import i18n from "@/i18n"
import { currency } from "@/lib/constant"

interface RoomGridProps {
  rooms: Room[]
  loading: boolean
}

export function RoomGrid({ rooms, loading }: RoomGridProps) {
  const { filters } = useLobbyStore()
  const safeRooms = Array.isArray(rooms) ? rooms : []
  

  // Filter logic
  const filteredRooms = useMemo(() => {
    return safeRooms.filter((room) => {
      if (filters.fee && room.entryFee !== filters.fee) return false
      if (filters.status && room.status !== filters.status) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return room.name.toLowerCase().includes(searchLower)
      }
      return true
    })
  }, [safeRooms, filters])

  const { practiceRooms, regularRooms } = useMemo(() => {
    const test = filteredRooms.filter((r) => r.isForPractice)
    const regular = filteredRooms.filter((r) => !r.isForPractice)
    return { practiceRooms: test, regularRooms: regular }
  }, [filteredRooms])

  const roomsByFee = useMemo(() => {
    const grouped = regularRooms.reduce((acc, room) => {
      if (!acc[room.entryFee]) acc[room.entryFee] = []
      acc[room.entryFee].push(room)
      return acc
    }, {} as Record<number, Room[]>)

    return Object.entries(grouped)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([fee, rooms]) => ({ fee: Number(fee), rooms }))
  }, [regularRooms])


  

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg text-muted-foreground animate-pulse">Loading rooms...</div>
      </div>
    )
  }

  // Empty state
  if (practiceRooms.length === 0 && roomsByFee.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-muted-foreground">No rooms found</h3>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Regular Rooms by Fee */}
      {roomsByFee.map(({ fee, rooms }) => (
        <div key={fee} className="space-y-4">
          <div className="flex items-center justify-between">
            {/* <h2 className="text-xl font-semibold text-foreground">Entry Fee: {fee}</h2> */}
            {/* <Badge variant="outline">{rooms.length} rooms</Badge> */}
          </div>
          <ResponsiveRoomGrid rooms={rooms} />
        </div>
      ))}
    </div>
  )
}

function ResponsiveRoomGrid({ rooms }: { rooms: Room[] }) {
  const router =  useRouter();
  const handleCardClick = (room: Room) => {
      if (room.status === RoomStatus.OPEN) {
        // Navigate to room
  
        // enterRoom(room.id);
        router.push(`/${i18n.language}/rooms/${room.id}`);
      } else {
        // View game
        router.push(`/${i18n.language}/rooms/${room.id}`);
      }
    }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {rooms.map((room) => (
      <motion.button
        key={room.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        onClick={() => handleCardClick(room)}
        className="cursor-pointer rounded-2xl overflow-hidden bg-slate-950 hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border-1/2 border-white"
      >
        <div className="px-4 py-2 border-b border-border text-center flex items-center justify-between">
          <div className="text-lg font-semibold">
            {room.name}
          </div>

          <div className="">
            {/* <span className="text-muted-foreground">Status</span> */}
            <Badge
              variant={
                room.status === RoomStatus.OPEN
                  ? "default"
                  : room.status === RoomStatus.CLOSED
                  ? "destructive"
                  : "secondary"
              }
              className={
                room.status === RoomStatus.OPEN
                  ? "bg-green-700 text-white"
                  : "bg-red-700 text-white"
              }
            >
              {room.status}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="dark:text-white font-bold text-lg">Capacity</span>
            <span className="dark:text-white font-bold text-lg">{room.capacity} Players</span>
          </div>

          

          <div className="flex justify-between">
            <span className="dark:text-white font-bold text-lg">Fee</span>
            <span className="dark:text-white font-bold text-lg">{currency} {room.entryFee}</span>
          </div>
        </div>
      </motion.button>
    ))}
</div>

  )
}
