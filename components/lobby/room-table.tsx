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
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Room Name</th>
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Bet</th>
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Status</th>
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Capacity</th>
//             <th className="px-2 sm:px-4 py-1 sm:py-2 w-1/4">Action</th>
//           </tr>
//         </thead>
//         <tbody className="rouded-2xl">
//           {(Array.isArray(rooms)? rooms : []).map((room) => (
//             <tr
//               key={room.id}
//               className="bg-white transition-colors duration-200 rounded-lg text-sm py-3 shadow-xl"
//             >
//               <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-gray-950 text-sm  bg-gray-300 w-fit"> {room.name}</td>
//               <td className="px-2 sm:px-4 py-1 sm:py-2 font-semibold text-gray-950 text-sm bg-gray-400"> {room.entryFee} {currency}</td>
//               <td className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-300 w-fit">
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
//               <td className="px-2 sm:px-4 py-1 sm:py-2 text-gray-950 font-semibold bg-gray-400">{room.capacity} Players</td>
//               <td className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-300 w-fit">
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

  const sortedRooms = rooms.sort((r1, r2) => r1.entryFee - r2.entryFee)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg text-muted-foreground animate-pulse">
          Loading rooms...
        </div>
      </div>
    )
  }

  if (!sortedRooms || sortedRooms.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-muted-foreground">
          No rooms found
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Check your connection or filters.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3 text-sm sm:text-base">
        <thead>
          <tr className="text-gray-400 uppercase tracking-wider text-xs sm:text-sm">
            <th className="px-3 py-2">Room Name</th>
            <th className="px-3 py-2">Bet</th>
            {/* <th className="px-3 py-2">Status</th> */}
            <th className="px-3 py-2">Capacity</th>
            <th className="px-3 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {(Array.isArray(sortedRooms) ? sortedRooms : []).map((room) => (
            <tr
              key={room.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg cursor-pointer text-white"
            >
              {/* Room Name */}
              <td className="px-3 py-3 font-semibold rounded-l-xl">
                {room.name}
              </td>

              {/* Entry Fee */}
              <td className="px-3 py-3 font-semibold text-yellow-400">
                {room.entryFee} {currency}
              </td>

              {/* Status */}
              {/* <td className="px-3 py-3">
                <Badge
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    room.status === RoomStatus.OPEN
                      ? "bg-green-600 text-white"
                      : room.status === RoomStatus.CLOSED
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {room.status}
                </Badge>
              </td> */}

              {/* Capacity */}
              <td className="px-3 py-3 text-gray-200 font-medium">
                {room.capacity} Players
              </td>

              {/* Action */}
              <td className="px-3 py-3 rounded-r-xl text-center">
                <button
                  onClick={() => handleJoinClick(room)}
                  disabled={room.status !== RoomStatus.OPEN}
                  className={`px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 ${
                    room.status === RoomStatus.OPEN
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {room.status === RoomStatus.OPEN ? "Enter" : "___"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
