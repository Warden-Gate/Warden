"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import type { ConfirmedSignatureInfo } from "@solana/web3.js"

interface Transaction {
  signature: string
  timestamp: number
  status: "success" | "failed"
  amount?: number
  type: string
}

export function useDevnetTransactions() {
  const { walletAddress, connection } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!walletAddress) return

    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const publicKey = new (await import("@solana/web3.js")).PublicKey(walletAddress)
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 100 })

        const txList: Transaction[] = signatures.map((sig: ConfirmedSignatureInfo) => ({
          signature: sig.signature,
          timestamp: (sig.blockTime || 0) * 1000,
          status: sig.err ? "failed" : "success",
          type: sig.memo ? "Payment" : "Transfer",
        }))

        setTransactions(txList)
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching transactions:", err)
        setError("Failed to fetch transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()

    const interval = setInterval(fetchTransactions, 30000)
    return () => clearInterval(interval)
  }, [walletAddress, connection])

  return { transactions, loading, error }
}
