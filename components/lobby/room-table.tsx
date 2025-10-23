
// "use client"

// import { useMemo } from "react"
// import { useLobbyStore } from "@/lib/stores/lobby-store"
// import { RoomStatus, type Room } from "@/lib/types"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { motion } from "framer-motion"
// import { ChevronDown } from "lucide-react"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
// import { useRouter } from "next/navigation"
// import i18n from "@/i18n"
// import { currency } from "@/lib/constant"

// interface RoomGridProps {
//   rooms: Room[]
//   loading: boolean
// }

// export function RoomGrid({ rooms, loading }: RoomGridProps) {
//   const { filters } = useLobbyStore()
//   const safeRooms = Array.isArray(rooms) ? rooms : []
  

//   // Filter logic
//   const filteredRooms = useMemo(() => {
//     return safeRooms.filter((room) => {
//       if (filters.fee && room.entryFee !== filters.fee) return false
//       if (filters.status && room.status !== filters.status) return false
//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase()
//         return room.name.toLowerCase().includes(searchLower)
//       }
//       return true
//     })
//   }, [safeRooms, filters])

//   const { practiceRooms, regularRooms } = useMemo(() => {
//     const test = filteredRooms.filter((r) => r.isForPractice)
//     const regular = filteredRooms.filter((r) => !r.isForPractice)
//     return { practiceRooms: test, regularRooms: regular }
//   }, [filteredRooms])

//   const roomsByFee = useMemo(() => {
//     const grouped = regularRooms.reduce((acc, room) => {
//       if (!acc[room.entryFee]) acc[room.entryFee] = []
//       acc[room.entryFee].push(room)
//       return acc
//     }, {} as Record<number, Room[]>)

//     return Object.entries(grouped)
//       .sort(([a], [b]) => Number(a) - Number(b))
//       .map(([fee, rooms]) => ({ fee: Number(fee), rooms }))
//   }, [regularRooms])


  

  // // Loading state
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center py-16">
  //       <div className="text-lg text-muted-foreground animate-pulse">Loading rooms...</div>
  //     </div>
  //   )
  // }

//   // Empty state
//   if (practiceRooms.length === 0 && roomsByFee.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <h3 className="text-lg font-semibold text-muted-foreground">No rooms found</h3>
//         <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-10">
//       {/* Regular Rooms by Fee */}
//       {roomsByFee.map(({ fee, rooms }) => (
//         <div key={fee} className="space-y-4">
//           <div className="flex items-center justify-between">
//             {/* <h2 className="text-xl font-semibold text-foreground">Entry Fee: {fee}</h2> */}
//             {/* <Badge variant="outline">{rooms.length} rooms</Badge> */}
//           </div>
//           <ResponsiveRoomGrid rooms={rooms} />
//         </div>
//       ))}
//     </div>
//   )
// }

// function ResponsiveRoomGrid({ rooms }: { rooms: Room[] }) {
//   const router = useRouter();

//   const handleJoinClick = (room: Room) => {
//     if (room.status === RoomStatus.OPEN) {
//       router.push(`/${i18n.language}/rooms/${room.id}`);
//     } else {
//       router.push(`/${i18n.language}/rooms/${room.id}`);
//     }
//   };

//   return (
//     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//       {rooms.map((room) => (
//         <motion.div
//           key={room.id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="flex flex-col rounded-2xl bg-gray-900 hover:shadow-2xl transition-shadow duration-300"
//         >
//           {/* Room Status */}
//           <div className="px-5 py-4 flex justify-end items-center border-b border-gray-700">
//             <Badge
//               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 room.status === RoomStatus.OPEN
//                   ? "bg-green-600 text-white"
//                   : room.status === RoomStatus.CLOSED
//                   ? "bg-red-600 text-white"
//                   : "bg-yellow-600 text-white"
//               }`}
//             >
//               {room.status}
//             </Badge>
//           </div>

//           {/* Room Details */}
//           <div className="px-5 py-4 flex flex-col gap-3 text-white text-sm">
//             <div className="flex justify-between">
//               <span className="font-medium">Capacity</span>
//               <span className="font-semibold">{room.capacity} Players</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-medium">Entry Fee</span>
//               <span className="font-semibold">{currency} {room.entryFee}</span>
//             </div>
//           </div>

//           {/* Join Button */}
//           <div className="px-5 pb-4">
//             <button
//               onClick={() => handleJoinClick(room)}
//               disabled={room.status !== RoomStatus.OPEN}
//               className={`w-full py-2 rounded-xl font-medium text-white transition-colors duration-200 ${
//                 room.status === RoomStatus.OPEN
//                   ? "bg-indigo-600 hover:bg-indigo-700"
//                   : "bg-gray-700 cursor-not-allowed"
//               }`}
//             >
//               {room.status === RoomStatus.OPEN ? "Join Room" : "View Game"}
//             </button>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }


// "use client"

// import { RoomStatus, type Room } from "@/lib/types"
// import { Badge } from "@/components/ui/badge"
// import { useRouter } from "next/navigation"
// import i18n from "@/i18n"
// import { currency } from "@/lib/constant"

// interface RoomTableProps {
//   rooms: Room[]
//   loading: boolean
// }

// export function RoomTable({ rooms, loading }: RoomTableProps) {
//   const router = useRouter()

//   const handleJoinClick = (room: Room) => {
//     if (room.status === RoomStatus.OPEN) {
//       router.push(`/${i18n.language}/rooms/${room.id}`)
//     } else {
//       router.push(`/${i18n.language}/rooms/${room.id}`)
//     }
//   }

//     // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-16">
//         <div className="text-lg text-muted-foreground animate-pulse">Loading rooms...</div>
//       </div>
//     )
//   }

//   if (!rooms || rooms.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <h3 className="text-lg font-semibold text-muted-foreground">No rooms found</h3>
//         <p className="text-sm text-muted-foreground mt-2">Check your connection.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full overflow-x-auto">
//       <table className="w-full text-left border-separate border-spacing-y-2 text-sm sm:text-base">
//         <thead>
//           <tr className="text-gray-400 uppercase tracking-wider text-xs sm:text-sm">
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Bet</th>
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Status</th>
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Capacity</th>
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {(Array.isArray(rooms)? rooms : []).map((room) => (
//             <tr
//               key={room.id}
//               className="bg-stone-100 transition-colors duration-200 rounded-lg text-sm py-3 shadow-xl"
//             >
//               <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-white text-sm"> {room.entryFee} {currency}</td>
//               <td className="px-2 sm:px-4 py-1 sm:py-2">
//                 <Badge
//                   className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
//                     room.status === RoomStatus.OPEN
//                       ? "bg-green-600 text-white"
//                       : room.status === RoomStatus.CLOSED
//                       ? "bg-red-600 text-white"
//                       : "bg-yellow-600 text-white"
//                   }`}
//                 >
//                   {room.status}
//                 </Badge>
//               </td>
//               <td className="px-2 sm:px-4 py-1 sm:py-2 text-white font-semibold">{room.capacity} Players</td>
//               <td className="px-2 sm:px-4 py-1 sm:py-2">
//                 <button
//                   onClick={() => handleJoinClick(room)}
//                   disabled={room.status !== RoomStatus.OPEN}
//                   className={`w-full px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium text-white transition-colors duration-200 text-xs sm:text-sm cursor-pointer ${
//                     room.status === RoomStatus.OPEN
//                       ? "bg-indigo-600 hover:bg-indigo-700"
//                       : "bg-gray-700 cursor-not-allowed"
//                   }`}
//                 >
//                   {room.status === RoomStatus.OPEN ? "Enter" : "____"}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }



"use client"

import { RoomStatus, type Room } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import i18n from "@/i18n"
import { currency } from "@/lib/constant"

interface RoomTableProps {
  rooms: Room[]
  loading: boolean
}

export function RoomTable({ rooms, loading }: RoomTableProps) {
  const router = useRouter()

  const handleJoinClick = (room: Room) => {
    router.push(`/${i18n.language}/rooms/${room.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg text-gray-400 animate-pulse">Loading rooms...</div>
      </div>
    )
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-gray-400">No rooms found</h3>
        <p className="text-sm text-gray-500 mt-2">Check your connection.</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="hidden sm:flex bg-gray-200 rounded-lg p-3 text-gray-700 font-semibold text-sm sm:text-base">
        <div className="w-1/4">Bet</div>
        <div className="w-1/4">Status</div>
        <div className="w-1/4">Capacity</div>
        <div className="w-1/4">Action</div>
      </div>

      {/* Rows */}
      {rooms.map((room) => {
        const canJoin = room.status === RoomStatus.OPEN
        return (
          <div
            key={room.id}
            className="bg-stone-800 rounded-lg shadow-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-colors duration-200 hover:bg-stone-700"
          >
            {/* Bet */}
            <div className="w-full sm:w-1/4 font-semibold text-white text-sm sm:text-base mb-2 sm:mb-0">
              {room.entryFee} {currency}
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/4 mb-2 sm:mb-0">
              <Badge
                className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                  room.status === RoomStatus.OPEN
                    ? "bg-green-600 text-white"
                    : room.status === RoomStatus.CLOSED
                    ? "bg-red-600 text-white"
                    : "bg-yellow-600 text-white"
                }`}
              >
                {room.status}
              </Badge>
            </div>

            {/* Capacity */}
            <div className="w-full sm:w-1/4 font-semibold text-white text-sm sm:text-base mb-2 sm:mb-0">
              {room.capacity} Players
            </div>

            {/* Action */}
            <div className="w-full sm:w-1/4">
              <button
                onClick={() => handleJoinClick(room)}
                disabled={!canJoin}
                className={`w-full px-4 py-2 rounded-lg font-medium text-white text-sm sm:text-base transition-colors duration-200 ${
                  canJoin ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                {canJoin ? "Enter" : "____"}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

