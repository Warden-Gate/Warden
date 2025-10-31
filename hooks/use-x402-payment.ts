"use client"

import { useState, useCallback } from "react"
import { PublicKey } from "@solana/web3.js"
import { x402Handler, type TransactionResult } from "@/lib/x402-payment"
import { useWallet } from "@/contexts/wallet-context"

export function useX402Payment() {
  const { walletAddress, connection } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TransactionResult | null>(null)

  const getBalance = useCallback(async () => {
    if (!walletAddress) return null
    try {
      const balance = await x402Handler.getAccountBalance(new PublicKey(walletAddress))
      return x402Handler.formatLamports(balance)
    } catch (err) {
      console.error("[v0] Error fetching balance:", err)
      return null
    }
  }, [walletAddress])

  const simulatePayment = useCallback(
    async (toAddress: string, lamports: number, agentId: string, description: string) => {
      if (!walletAddress) {
        setError("Wallet not connected")
        return false
      }

      setIsProcessing(true)
      setError(null)

      try {
        const transaction = await x402Handler.createPaymentTransaction({
          fromAddress: new PublicKey(walletAddress),
          toAddress: new PublicKey(toAddress),
          lamports,
          agentId,
          description,
        })

        const isValid = await x402Handler.simulatePayment(transaction, new PublicKey(walletAddress))

        if (!isValid) {
          setError("Transaction simulation failed")
          return false
        }

        console.log("[v0] Payment simulation successful")
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Payment simulation failed"
        setError(errorMessage)
        console.error("[v0] Payment error:", errorMessage)
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [walletAddress],
  )

  return {
    isProcessing,
    error,
    result,
    getBalance,
    simulatePayment,
  }
}
