"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Shield, Loader2 } from "lucide-react"
import { useDevnetReputation } from "@/hooks/use-devnet-reputation"
import { useReputation } from "@/contexts/reputation-context"

interface ReputationDisplayProps {
  walletAddress: string | null
}

export default function ReputationDisplay({ walletAddress }: ReputationDisplayProps) {
  const { score, tiers, getProgressToNextTier, getTierBenefits } = useReputation()
  const { data: devnetData, loading, error } = useDevnetReputation()

  const progressPercent = getProgressToNextTier()
  const nextTierThreshold = score.tier.maxPoints

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50 backdrop-blur p-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading reputation data from devnet...
        </div>
      </Card>
    )
  }

  const displayData = devnetData || { score: 0, tier: "Newcomer", transactionsExecuted: 0, successRate: 0 }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50 backdrop-blur p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Reputation</h2>
              <p className="text-muted-foreground">Fetched from Solana Devnet</p>
            </div>
            <Award className="w-8 h-8 text-accent" />
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Score</p>
                <p className="text-4xl font-bold text-foreground">{displayData.score}</p>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/50">{displayData.tier}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to next tier</span>
                <span className="text-foreground font-semibold">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Transactions Executed", value: displayData.transactionsExecuted.toString(), icon: TrendingUp },
          { label: "Success Rate", value: displayData.successRate.toFixed(1) + "%", icon: Shield },
          { label: "Last Updated", value: new Date(displayData.lastUpdated).toLocaleDateString(), icon: Award },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="bg-card/50 border-border/50 backdrop-blur p-6">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5 text-accent" />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {error && (
        <Card className="bg-red-500/10 border-red-500/50 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}

      <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
        <h3 className="font-semibold text-foreground mb-4">Reputation Tiers</h3>
        <div className="space-y-2 text-sm">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex justify-between">
              <span className={tier.name === displayData.tier ? "text-accent font-semibold" : "text-muted-foreground"}>
                {tier.name} {tier.name === displayData.tier && "(Current)"}
              </span>
              <span className="text-foreground">
                {tier.minPoints.toLocaleString()} - {tier.maxPoints.toLocaleString()} points
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
