// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Play, Pause, Square, RotateCcw } from "lucide-react"
// import { useAdminStore } from "@/lib/stores/admin-store"
// import { useEffect } from "react"
// import { ManualNumberCalling } from "./manual-number-calling"

// export function AdminGames() {
//   const { activeGames, isLoading, error, controlGame, loadGames } = useAdminStore()

//   useEffect(() => {
//     loadGames()
//   }, [loadGames])

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Game Control</h1>
//         <p className="text-muted-foreground">Monitor and control active bingo games</p>
//       </div>

//       {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

//       <Card>
//         <CardHeader>
//           <CardTitle>Active Games</CardTitle>
//           <CardDescription>Currently running games</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="text-center py-8">Loading games...</div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Room</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Numbers Called</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {activeGames.map((game) => (
//                   <TableRow key={game.id}>
//                     <TableCell className="font-medium">{game.roomName}</TableCell>
//                     <TableCell>
//                       <Badge variant={game.status === "playing" ? "default" : "secondary"}>{game.status}</Badge>
//                     </TableCell>
//                     <TableCell>{game.numbersCalledCount}/75</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => controlGame(game.id, game.status === "playing" ? "pause" : "resume")}
//                           disabled={isLoading}
//                         >
//                           {game.status === "playing" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => controlGame(game.id, "stop")}
//                           disabled={isLoading}
//                         >
//                           <Square className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => controlGame(game.id, "reset")}
//                           disabled={isLoading}
//                         >
//                           <RotateCcw className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       <ManualNumberCalling />
//     </div>
//   )
// }
