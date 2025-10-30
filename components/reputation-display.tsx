"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Shield } from "lucide-react"
import { useReputation } from "@/contexts/reputation-context"

interface ReputationDisplayProps {
  walletAddress: string | null
}

export default function ReputationDisplay({ walletAddress }: ReputationDisplayProps) {
  const { score, tiers, getProgressToNextTier, getTierBenefits } = useReputation()
  const progressPercent = getProgressToNextTier()
  const nextTierThreshold = score.tier.maxPoints

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50 backdrop-blur p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Reputation</h2>
              <p className="text-muted-foreground">Build trust through successful transactions</p>
            </div>
            <Award className="w-8 h-8 text-accent" />
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Score</p>
                <p className="text-4xl font-bold text-foreground">{score.totalPoints}</p>
              </div>
              <Badge className={`${score.tier.color} bg-opacity-20 border-opacity-50`}>
                Tier {score.tier.id}: {score.tier.name}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Progress to {score.tier.id < 4 ? `Tier ${score.tier.id + 1}` : "Max Tier"}
                </span>
                <span className="text-foreground font-semibold">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {score.tier.id < 4 ? `${nextTierThreshold - score.totalPoints} points needed` : "Maximum tier reached"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Successful Requests", value: score.successfulRequests.toString(), icon: TrendingUp },
          { label: "Failed Requests", value: score.failedRequests.toString(), icon: Shield },
          { label: "Average Rating", value: score.averageRating.toFixed(1) + "/5", icon: Award },
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

      <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-border/50 backdrop-blur p-6">
        <h3 className="font-semibold text-foreground mb-3">Reputation Tiers</h3>
        <div className="space-y-2 text-sm">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex justify-between">
              <span className={tier.id === score.tier.id ? `${tier.color} font-semibold` : "text-muted-foreground"}>
                Tier {tier.id}: {tier.name} {tier.id === score.tier.id && "(Current)"}
              </span>
              <span className="text-foreground">
                {tier.minPoints.toLocaleString()} -{" "}
                {tier.maxPoints === Number.POSITIVE_INFINITY ? "∞" : tier.maxPoints.toLocaleString()} points
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
        <h3 className="font-semibold text-foreground mb-4">Your Tier Benefits</h3>
        <ul className="space-y-2">
          {getTierBenefits().map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="text-accent mt-1">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Activity tracking coming soon</p>
        </div>
      </Card>
    </div>
  )
}
