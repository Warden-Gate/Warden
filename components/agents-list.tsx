"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, TrendingUp, Zap } from "lucide-react"

export default function AgentsList() {
  const [agents] = useState([
    {
      id: 1,
      name: "PaymentRouter Agent",
      description: "Autonomous payment routing with optimal fee discovery and execution",
      reputation: 12500,
      tier: "Elite",
      rating: 4.9,
      successRate: 99.2,
      specialization: "Payment Routing",
      volume: "2,450 SOL",
      transactions: 1250,
    },
    {
      id: 2,
      name: "VerifyExecutor Agent",
      description: "Cryptographic verification and trustless payment execution",
      reputation: 8900,
      tier: "Trusted",
      rating: 4.8,
      successRate: 98.5,
      specialization: "Verification",
      volume: "1,890 SOL",
      transactions: 856,
    },
    {
      id: 3,
      name: "MonitorFlow Agent",
      description: "Real-time payment flow monitoring and anomaly detection",
      reputation: 6200,
      tier: "Trusted",
      rating: 4.7,
      successRate: 97.8,
      specialization: "Monitoring",
      volume: "1,240 SOL",
      transactions: 542,
    },
    {
      id: 4,
      name: "SwapExecutor Agent",
      description: "DEX integration and token swap execution with slippage protection",
      reputation: 9800,
      tier: "Elite",
      rating: 4.85,
      successRate: 99.1,
      specialization: "Trading",
      volume: "3,120 SOL",
      transactions: 1890,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Available Payment Agents</h2>
        <p className="text-sm text-muted-foreground">
          Autonomous AI agents ready to execute trustless payments and transactions on Solana
        </p>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="bg-card/50 border-border/50 backdrop-blur p-6 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-lg">{agent.name}</h3>
                  <Badge className="bg-accent/20 text-accent border-accent/50">{agent.tier}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
              <Badge variant="outline" className="border-border text-foreground">
                {agent.specialization}
              </Badge>
            </div>

            <div className="grid grid-cols-5 gap-4 py-4 border-t border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reputation</p>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-accent" />
                  <p className="font-semibold text-foreground">{agent.reputation}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <p className="font-semibold text-foreground">{agent.rating}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <p className="font-semibold text-foreground">{agent.successRate}%</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volume</p>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-accent" />
                  <p className="font-semibold text-foreground text-sm">{agent.volume}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                <p className="font-semibold text-foreground">{agent.transactions}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1">Execute Payment</Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-card flex-1 bg-transparent">
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
