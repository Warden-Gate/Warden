"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Wallet, TrendingUp, Users, Send, Cpu } from "lucide-react"
import Link from "next/link"
import WalletConnect from "@/components/wallet-connect"
import ReputationDisplay from "@/components/reputation-display"
import ServiceRequests from "@/components/service-requests"
import AgentsList from "@/components/agents-list"
import PaymentSimulator from "@/components/payment-simulator"
import { useWallet } from "@/contexts/wallet-context"

export default function Dashboard() {
  const { isConnected, walletAddress, disconnect } = useWallet()
  const [localConnected, setLocalConnected] = useState(isConnected)

  const handleConnect = (address: string) => {
    setLocalConnected(true)
  }

  if (!localConnected && !isConnected) {
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
              <Wallet className="w-16 h-16 text-accent mx-auto" />
              <h1 className="text-3xl font-bold text-foreground">Connect Your Wallet</h1>
              <p className="text-muted-foreground">
                Connect your Solana wallet to access Warden and start executing AI-powered payments
              </p>
              <WalletConnect onConnect={handleConnect} />
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
              {(walletAddress || "").slice(0, 6)}...{(walletAddress || "").slice(-4)}
            </div>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-card bg-transparent"
              onClick={() => {
                disconnect()
                setLocalConnected(false)
              }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reputation Score</p>
                <p className="text-2xl font-bold text-foreground">8,450</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transactions Executed</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <Send className="w-8 h-8 text-accent" />
            </div>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-foreground">98%</p>
              </div>
              <Shield className="w-8 h-8 text-accent" />
            </div>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">125 SOL</p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Payment Simulator Section */}
        {isConnected && walletAddress && (
          <div className="mb-8">
            <PaymentSimulator />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="reputation" className="space-y-6">
          <TabsList className="bg-transparent border-b border-border/50 rounded-none p-0 h-auto gap-8 w-full justify-start">
            <TabsTrigger
              value="reputation"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-transparent cursor-pointer"
            >
              Reputation
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-transparent cursor-pointer"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="rounded-none border-b-2 border-transparent px-0 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-transparent cursor-pointer"
            >
              Available Agents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reputation" className="space-y-6">
            <ReputationDisplay walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <ServiceRequests walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <AgentsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
