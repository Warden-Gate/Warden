"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, Send, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useX402Payment } from "@/hooks/use-x402-payment"
import { useWallet } from "@/contexts/wallet-context"

export default function PaymentSimulator() {
  const { walletAddress } = useWallet()
  const { isProcessing, error, simulatePayment, getBalance } = useX402Payment()
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [agentId, setAgentId] = useState("agent-001")
  const [description, setDescription] = useState("Test payment via x402")
  const [simulationSuccess, setSimulationSuccess] = useState(false)

  const handleSimulate = async () => {
    if (!recipientAddress || !amount) {
      return
    }

    const lamports = Math.floor(Number.parseFloat(amount) * 1000000000)
    const success = await simulatePayment(recipientAddress, lamports, agentId, description)

    if (success) {
      setSimulationSuccess(true)
      setTimeout(() => setSimulationSuccess(false), 3000)
    }
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">x402 Payment Simulator</h3>
        <p className="text-sm text-muted-foreground">Test Solana payments on devnet using x402 protocol</p>
      </div>

      {error && (
        <Alert className="bg-destructive/10 border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {simulationSuccess && (
        <Alert className="bg-emerald-500/10 border-emerald-500/50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Payment simulation successful! Transaction validated on devnet.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Recipient Address</label>
          <Input
            placeholder="Enter recipient wallet address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="bg-background/50 border-border"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Amount (SOL)</label>
          <Input
            placeholder="0.1"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background/50 border-border"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Agent ID</label>
          <Input
            placeholder="agent-001"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="bg-background/50 border-border"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Description</label>
          <Input
            placeholder="Payment description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background/50 border-border"
          />
        </div>
      </div>

      <Button
        onClick={handleSimulate}
        disabled={isProcessing || !recipientAddress || !amount}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <Send className="w-4 h-4 mr-2" />
        {isProcessing ? "Simulating Payment..." : "Simulate Payment"}
      </Button>

      <div className="text-xs text-muted-foreground p-3 bg-background/30 rounded border border-border/50">
        <p>
          <strong>Note:</strong> This is a simulation on Solana Devnet. No real funds are transferred. Use the devnet
          faucet to get test SOL: https://faucet.solana.com/
        </p>
      </div>
    </Card>
  )
}
