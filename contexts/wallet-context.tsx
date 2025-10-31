"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Connection } from "@solana/web3.js"
import { getNetworkLabel } from "@/lib/solana-config"
import { solanaConnection } from "@/lib/solana-config"

interface WalletContextType {
  isConnected: boolean
  walletAddress: string | null
  isLoading: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  clearError: () => void
  network: string
  connection: Connection
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPhantomInstalled = useCallback(() => {
    return typeof window !== "undefined" && (window as any).solana?.isPhantom
  }, [])

  useEffect(() => {
    if (!isPhantomInstalled()) return

    const phantom = (window as any).solana

    // Remove any existing event listeners that might cause auto-connect
    const handleConnect = () => {
      console.log("[v0] Phantom connect event fired (ignoring auto-connect)")
      // Do nothing - we only connect on explicit user action
    }

    const handleDisconnect = () => {
      console.log("[v0] Phantom disconnect event fired")
      setIsConnected(false)
      setWalletAddress(null)
    }

    // Remove listeners if they exist
    phantom.removeAllListeners?.()

    // Add listeners but don't auto-connect
    phantom.on?.("connect", handleConnect)
    phantom.on?.("disconnect", handleDisconnect)

    return () => {
      phantom.removeListener?.("connect", handleConnect)
      phantom.removeListener?.("disconnect", handleDisconnect)
    }
  }, [isPhantomInstalled])

  const connect = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    console.log("[v0] Starting explicit wallet connection")

    try {
      if (!isPhantomInstalled()) {
        throw new Error("Phantom wallet is not installed. Please install it from https://phantom.app")
      }

      const phantom = (window as any).solana

      // This will show the Phantom dialog and only connect if user approves
      const response = await phantom.connect({ onlyIfTrusted: false })
      const address = response.publicKey.toString()

      console.log("[v0] User approved wallet connection:", address)

      // Only set connected state if we successfully got a response
      setWalletAddress(address)
      setIsConnected(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet"
      console.log("[v0] Connection error:", errorMessage)

      if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("cancelled") ||
        errorMessage.includes("User closed") ||
        errorMessage.includes("4001") ||
        errorMessage.includes("User did not approve")
      ) {
        console.log("[v0] User cancelled wallet connection - not connecting")
        setError(null) // Don't show error for user cancellation
        setIsConnected(false)
        setWalletAddress(null)
      } else {
        console.log("[v0] Wallet connection error:", errorMessage)
        setError(errorMessage)
        setIsConnected(false)
        setWalletAddress(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [isPhantomInstalled])

  const disconnect = useCallback(async () => {
    try {
      if (isPhantomInstalled()) {
        const phantom = (window as any).solana
        await phantom.disconnect()
      }
    } catch (err) {
      console.log("[v0] Error disconnecting:", err)
    }
    setIsConnected(false)
    setWalletAddress(null)
    setError(null)
  }, [isPhantomInstalled])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        isLoading,
        error,
        connect,
        disconnect,
        clearError,
        network: getNetworkLabel(),
        connection: solanaConnection,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
