"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Users, GamepadIcon, Trophy } from "lucide-react"
import { useAdminStore } from "@/lib/stores/admin-store"
import { useState, useEffect } from "react"

export function AdminAnalytics() {
  const { analytics, isLoading, error } = useAdminStore()
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        const result = await response.json()
        if (result.success) {
          useAdminStore.setState({ analytics: result.data })
        }
      } catch (error) {
        console.error("Failed to load analytics:", error)
      }
    }
    loadAnalytics()
  }, [timeRange])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : `$${analytics.totalRevenue}`}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{analytics.revenueGrowth}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : analytics.totalPlayers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{analytics.playerGrowth}% new players
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : analytics.gamesPlayed}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />-{analytics.gamesDecline}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Prize Pool</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : `$${analytics.avgPrizePool}`}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{analytics.prizePoolGrowth}% increase
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Fee Tier</CardTitle>
            <CardDescription>Revenue distribution across different entry fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.revenueByTier.map((tier) => (
                <div key={tier.fee} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">${tier.fee}</Badge>
                    <span className="text-sm">{tier.games} games</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${tier.revenue}</div>
                    <div className="text-xs text-muted-foreground">{tier.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Patterns</CardTitle>
            <CardDescription>Most played bingo patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularPatterns.map((pattern) => (
                <div key={pattern.name} className="flex items-center justify-between">
                  <div className="font-medium">{pattern.name}</div>
                  <div className="text-right">
                    <div className="font-medium">{pattern.games} games</div>
                    <div className="text-xs text-muted-foreground">{pattern.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
