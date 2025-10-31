"use client"

import { useState, useEffect } from "react"

interface Agent {
  id: string
  name: string
  type: string
  successRate: number
  transactionVolume: number
  reputation: number
  description: string
}

export function useDevnetAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true)
      try {
        setAgents([
          {
            id: "1",
            name: "PaymentRouter",
            type: "Payment Processing",
            successRate: 99.2,
            transactionVolume: 1250,
            reputation: 9800,
            description: "Routes payments with optimal fee calculation",
          },
          {
            id: "2",
            name: "VerifyExecutor",
            type: "Verification",
            successRate: 98.5,
            transactionVolume: 856,
            reputation: 8900,
            description: "Executes cryptographically verified transactions",
          },
          {
            id: "3",
            name: "MonitorFlow",
            type: "Monitoring",
            successRate: 99.8,
            transactionVolume: 2100,
            reputation: 9950,
            description: "Monitors transaction flow and ensures consistency",
          },
        ])
      } catch (err) {
        console.error("[v0] Error fetching agents:", err)
        setError("Failed to fetch agents")
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  return { agents, loading, error }
}
