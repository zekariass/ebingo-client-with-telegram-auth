"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Ban, CheckCircle, DollarSign } from "lucide-react"
import { useAdminStore } from "@/lib/stores/admin-store"
import { InputField } from "@/components/ui/form-fields"
import { playerSearchSchema, type PlayerSearchFormData } from "@/lib/schemas/admin-schemas"

export function AdminPlayers() {
  const { players, isLoading, error, banPlayer, unbanPlayer, loadPlayers } = useAdminStore()

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PlayerSearchFormData>({
    resolver: zodResolver(playerSearchSchema),
    defaultValues: {
      searchTerm: "",
    },
  })

  const searchTerm = watch("searchTerm") || ""

  useEffect(() => {
    loadPlayers(searchTerm)
  }, [loadPlayers, searchTerm])

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Player Management</h1>
        <p className="text-muted-foreground">Monitor and manage player accounts</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Player Search</CardTitle>
          <CardDescription>Find and manage player accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <div className="max-w-sm">
              <InputField
                label=""
                placeholder="Search by name or email..."
                {...register("searchTerm")}
                error={errors.searchTerm?.message}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading players...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Games Played</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={player.status === "active" ? "default" : "destructive"}>{player.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {player.balance}
                      </div>
                    </TableCell>
                    <TableCell>{player.gamesPlayed}</TableCell>
                    <TableCell>{player.winRate}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {player.status === "active" ? (
                          <Button size="sm" variant="outline" onClick={() => banPlayer(player.id)} disabled={isLoading}>
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => unbanPlayer(player.id)}
                            disabled={isLoading}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Unban
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
