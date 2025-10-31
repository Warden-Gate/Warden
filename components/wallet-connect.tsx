"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle, Copy, Check, Network } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WalletConnectProps {
  onConnect?: (address: string) => void
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const { connect, disconnect, isLoading, error, clearError, isConnected, walletAddress, network } = useWallet()
  const [localError, setLocalError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    setLocalError(null)
    clearError()
    try {
      await connect()
      onConnect?.(walletAddress || "")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet"
      setLocalError(errorMessage)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
  }

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const displayError = error || localError

  if (isConnected && walletAddress) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/50 rounded-lg p-3">
          <Network className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Connected Network</p>
            <p className="text-sm font-medium text-foreground">{network}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 border border-accent/50 rounded-lg p-3">
          <Wallet className="w-4 h-4 text-accent" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Connected Wallet</p>
            <p className="text-sm font-mono truncate">{walletAddress}</p>
          </div>
          <button
            onClick={handleCopyAddress}
            className="p-1 hover:bg-accent/20 rounded transition-colors"
            title="Copy address"
          >
            {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
        <Button onClick={handleDisconnect} variant="outline" className="w-full sm:w-auto bg-transparent" size="lg">
          Disconnect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayError && (
        <Alert className="bg-destructive/10 border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
        size="lg"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
      </Button>
    </div>
  )
}
