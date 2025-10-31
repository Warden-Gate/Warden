"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, TrendingUp, Zap, Loader2 } from "lucide-react"
import { useDevnetAgents } from "@/hooks/use-devnet-agents"

export default function AgentsList() {
  const { agents, loading, error } = useDevnetAgents()

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50 backdrop-blur p-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading agents from devnet registry...
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/50 p-4">
        <p className="text-sm text-red-400">{error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Available Payment Agents</h2>
        <p className="text-sm text-muted-foreground">
          Autonomous AI agents ready to execute trustless payments and transactions on Solana Devnet
        </p>
      </div>

      <div className="space-y-4">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <Card
              key={agent.id}
              className="bg-card/50 border-border/50 backdrop-blur p-6 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{agent.name}</h3>
                    <Badge className="bg-accent/20 text-accent border-accent/50">
                      {agent.successRate > 99 ? "Elite" : "Trusted"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>
                <Badge variant="outline" className="border-border text-foreground">
                  {agent.type}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reputation</p>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-accent" />
                    <p className="font-semibold text-foreground">{agent.reputation}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <p className="font-semibold text-foreground">{agent.successRate.toFixed(1)}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Volume</p>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-accent" />
                    <p className="font-semibold text-foreground text-sm">{agent.transactionVolume}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p className="font-semibold text-foreground">5.0</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1">Execute Payment</Button>
                <Button variant="outline" className="border-border text-foreground hover:bg-card flex-1 bg-transparent">
                  View Profile
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="bg-card/50 border-border/50 backdrop-blur p-8">
            <p className="text-center text-muted-foreground">No agents available on devnet</p>
          </Card>
        )}
      </div>
    </div>
  )
}
