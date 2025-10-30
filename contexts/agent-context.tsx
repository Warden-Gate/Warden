"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface AgentProfile {
  id: string
  name: string
  description: string
  walletAddress: string
  reputation: number
  tier: string
  rating: number
  successRate: number
  specialization: string
  totalRequests: number
  completedRequests: number
  failedRequests: number
  totalEarned: string
  joinedAt: Date
  isActive: boolean
  maxConcurrentRequests: number
  currentRequests: number
  responseTime: number // in minutes
  autoAccept: boolean
  minReputationRequired: number
}

interface AgentContextType {
  agents: AgentProfile[]
  currentAgent: AgentProfile | null
  setCurrentAgent: (agent: AgentProfile) => void
  updateAgentProfile: (id: string, updates: Partial<AgentProfile>) => void
  getAgentById: (id: string) => AgentProfile | undefined
  getTopAgents: (limit: number) => AgentProfile[]
  toggleAutoAccept: (id: string) => void
  updateMaxConcurrentRequests: (id: string, max: number) => void
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

const MOCK_AGENTS: AgentProfile[] = [
  {
    id: "agent-1",
    name: "SwapMaster Agent",
    description: "Specialized in token swaps and DEX interactions",
    walletAddress: "9B5X1234567890ABCDEF1234567890ABCDEF1234",
    reputation: 12500,
    tier: "Elite",
    rating: 4.9,
    successRate: 99.2,
    specialization: "Trading",
    totalRequests: 250,
    completedRequests: 248,
    failedRequests: 2,
    totalEarned: "125.5 SOL",
    joinedAt: new Date("2024-01-15"),
    isActive: true,
    maxConcurrentRequests: 50,
    currentRequests: 12,
    responseTime: 2,
    autoAccept: true,
    minReputationRequired: 1000,
  },
  {
    id: "agent-2",
    name: "VerifyGuard Agent",
    description: "NFT and token verification specialist",
    walletAddress: "9B5X2234567890ABCDEF1234567890ABCDEF1234",
    reputation: 8900,
    tier: "Trusted",
    rating: 4.8,
    successRate: 98.5,
    specialization: "Verification",
    totalRequests: 180,
    completedRequests: 177,
    failedRequests: 3,
    totalEarned: "89.2 SOL",
    joinedAt: new Date("2024-02-20"),
    isActive: true,
    maxConcurrentRequests: 30,
    currentRequests: 8,
    responseTime: 3,
    autoAccept: false,
    minReputationRequired: 500,
  },
  {
    id: "agent-3",
    name: "MonitorPro Agent",
    description: "Real-time monitoring and alert system",
    walletAddress: "9B5X3234567890ABCDEF1234567890ABCDEF1234",
    reputation: 6200,
    tier: "Trusted",
    rating: 4.7,
    successRate: 97.8,
    specialization: "Monitoring",
    totalRequests: 120,
    completedRequests: 117,
    failedRequests: 3,
    totalEarned: "62.1 SOL",
    joinedAt: new Date("2024-03-10"),
    isActive: true,
    maxConcurrentRequests: 20,
    currentRequests: 5,
    responseTime: 1,
    autoAccept: true,
    minReputationRequired: 2000,
  },
]

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<AgentProfile[]>(MOCK_AGENTS)
  const [currentAgent, setCurrentAgent] = useState<AgentProfile | null>(null)

  const updateAgentProfile = useCallback((id: string, updates: Partial<AgentProfile>) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              ...updates,
            }
          : agent,
      ),
    )
  }, [])

  const getAgentById = useCallback(
    (id: string) => {
      return agents.find((agent) => agent.id === id)
    },
    [agents],
  )

  const getTopAgents = useCallback(
    (limit: number) => {
      return agents.sort((a, b) => b.reputation - a.reputation).slice(0, limit)
    },
    [agents],
  )

  const toggleAutoAccept = useCallback(
    (id: string) => {
      updateAgentProfile(id, {
        autoAccept: !agents.find((a) => a.id === id)?.autoAccept,
      })
    },
    [agents, updateAgentProfile],
  )

  const updateMaxConcurrentRequests = useCallback(
    (id: string, max: number) => {
      updateAgentProfile(id, { maxConcurrentRequests: max })
    },
    [updateAgentProfile],
  )

  return (
    <AgentContext.Provider
      value={{
        agents,
        currentAgent,
        setCurrentAgent,
        updateAgentProfile,
        getAgentById,
        getTopAgents,
        toggleAutoAccept,
        updateMaxConcurrentRequests,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}

export function useAgent() {
  const context = useContext(AgentContext)
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider")
  }
  return context
}
