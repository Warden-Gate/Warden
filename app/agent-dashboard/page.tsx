"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, TrendingUp, Award, Zap, LogOut, BarChart3, Clock, Target, Cpu } from "lucide-react"
import Link from "next/link"
import { useAgent } from "@/contexts/agent-context"
import { useServiceRequests } from "@/contexts/service-request-context"
import { useWallet } from "@/contexts/wallet-context"

export default function AgentDashboard() {
  const { agents, currentAgent, setCurrentAgent, toggleAutoAccept, updateMaxConcurrentRequests } = useAgent()
  const { requests } = useServiceRequests()
  const { walletAddress, disconnect } = useWallet()
  const [selectedAgent, setSelectedAgent] = useState<(typeof agents)[0] | null>(agents[0] || null)
  const [maxRequests, setMaxRequests] = useState(selectedAgent?.maxConcurrentRequests || 20)

  const agentRequests = selectedAgent ? requests.filter((r) => r.assignedAgent === selectedAgent.id) : []
  const pendingRequests = agentRequests.filter((r) => r.status === "pending").length
  const inProgressRequests = agentRequests.filter((r) => r.status === "in_progress").length
  const completedRequests = agentRequests.filter((r) => r.status === "completed").length

  const handleMaxRequestsChange = () => {
    if (selectedAgent) {
      updateMaxConcurrentRequests(selectedAgent.id, maxRequests)
    }
  }

  if (!selectedAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
        <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-accent" />
              <span className="text-xl font-bold text-foreground">Warden</span>
            </Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="bg-card/50 border-border/50 backdrop-blur p-12">
            <div className="text-center space-y-6">
              <p className="text-muted-foreground">No agent selected</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-foreground">Warden</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </div>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-card bg-transparent"
              onClick={disconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Agent Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{selectedAgent.name}</h1>
              <p className="text-muted-foreground">{selectedAgent.description}</p>
            </div>
            <Badge
              className={`text-lg px-4 py-2 ${selectedAgent.tier === "Elite" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" : "bg-accent/20 text-accent border-accent/50"}`}
            >
              {selectedAgent.tier}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-5 gap-4">
            <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reputation</p>
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.reputation}</p>
                </div>
                <Award className="w-8 h-8 text-accent" />
              </div>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.rating}/5</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.successRate}%</p>
                </div>
                <Zap className="w-8 h-8 text-accent" />
              </div>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.totalEarned}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-accent" />
              </div>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                  <p className="text-2xl font-bold text-foreground">{selectedAgent.responseTime}m</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card/50 border-border/50 backdrop-blur">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Active Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="agents">All Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Total Transactions</h3>
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">{selectedAgent.totalRequests}</p>
                <div className="space-y-1 text-sm">
                  <p className="text-green-400">Completed: {selectedAgent.completedRequests}</p>
                  <p className="text-red-400">Failed: {selectedAgent.failedRequests}</p>
                </div>
              </Card>

              <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Current Load</h3>
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">
                  {selectedAgent.currentRequests}/{selectedAgent.maxConcurrentRequests}
                </p>
                <div className="w-full bg-border/50 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{
                      width: `${(selectedAgent.currentRequests / selectedAgent.maxConcurrentRequests) * 100}%`,
                    }}
                  />
                </div>
              </Card>

              <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Status</h3>
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-3">
                  {selectedAgent.isActive ? "Active" : "Inactive"}
                </Badge>
                <p className="text-sm text-muted-foreground">Joined {selectedAgent.joinedAt.toLocaleDateString()}</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingRequests}</p>
              </Card>
              <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                <p className="text-3xl font-bold text-accent">{inProgressRequests}</p>
              </Card>
              <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-400">{completedRequests}</p>
              </Card>
            </div>

            <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
              <h3 className="font-semibold text-foreground mb-4">Transaction Details</h3>
              <div className="space-y-3">
                {agentRequests.length === 0 ? (
                  <p className="text-muted-foreground">No transactions assigned yet</p>
                ) : (
                  agentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{req.title}</p>
                        <p className="text-sm text-muted-foreground">{req.description}</p>
                      </div>
                      <Badge
                        className={
                          req.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : req.status === "in_progress"
                              ? "bg-accent/20 text-accent"
                              : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
              <h3 className="font-semibold text-foreground mb-6">Agent Settings</h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                  <div>
                    <p className="font-semibold text-foreground">Auto-Execute Transactions</p>
                    <p className="text-sm text-muted-foreground">Automatically execute matching transactions</p>
                  </div>
                  <Switch
                    checked={selectedAgent.autoAccept}
                    onCheckedChange={() => toggleAutoAccept(selectedAgent.id)}
                  />
                </div>

                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-foreground">Max Concurrent Transactions</p>
                      <p className="text-sm text-muted-foreground">Limit simultaneous transaction handling</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={maxRequests}
                      onChange={(e) => setMaxRequests(Number.parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                    />
                    <Button
                      onClick={handleMaxRequestsChange}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Update
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <p className="font-semibold text-foreground mb-2">Minimum Reputation Required</p>
                  <p className="text-2xl font-bold text-accent">{selectedAgent.minReputationRequired}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Only accept transactions from users with this reputation
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="space-y-4">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  className={`bg-card/50 border-border/50 backdrop-blur p-6 cursor-pointer hover:border-accent/50 transition-colors ${selectedAgent.id === agent.id ? "border-accent/50" : ""}`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{agent.name}</h3>
                        <Badge className="bg-accent/20 text-accent border-accent/50">{agent.tier}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Reputation</p>
                      <p className="font-semibold text-foreground">{agent.reputation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Rating</p>
                      <p className="font-semibold text-foreground">{agent.rating}/5</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                      <p className="font-semibold text-foreground">{agent.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
                      <p className="font-semibold text-accent">{agent.totalEarned}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
