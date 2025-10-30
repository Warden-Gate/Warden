"use client"

import { useWallet } from "@/contexts/wallet-context"
import { useCallback } from "react"

export function useAuth() {
  const { isConnected, walletAddress, connect, disconnect } = useWallet()

  const isAuthenticated = isConnected && walletAddress !== null

  const login = useCallback(
    async (address: string) => {
      await connect(address)
    },
    [connect],
  )

  const logout = useCallback(() => {
    disconnect()
  }, [disconnect])

  return {
    isAuthenticated,
    walletAddress,
    login,
    logout,
  }
}
