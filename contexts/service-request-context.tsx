"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type RequestStatus = "pending" | "in_progress" | "completed" | "failed" | "cancelled"
export type RequestType = "token_swap" | "nft_verification" | "price_alert" | "custom"

export interface ServiceRequest {
  id: string
  title: string
  description: string
  type: RequestType
  status: RequestStatus
  requiredReputation: number
  reward: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  assignedAgent?: string
  parameters: Record<string, unknown>
  completedAt?: Date
  rating?: number
  feedback?: string
}

interface ServiceRequestContextType {
  requests: ServiceRequest[]
  createRequest: (request: Omit<ServiceRequest, "id" | "createdAt" | "updatedAt">) => string
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => void
  acceptRequest: (id: string, agentAddress: string) => void
  completeRequest: (id: string, rating: number, feedback?: string) => void
  failRequest: (id: string) => void
  cancelRequest: (id: string) => void
  getRequestById: (id: string) => ServiceRequest | undefined
  getRequestsByStatus: (status: RequestStatus) => ServiceRequest[]
  getRequestsByAgent: (agentAddress: string) => ServiceRequest[]
  getRequestsByCreator: (creatorAddress: string) => ServiceRequest[]
}

const ServiceRequestContext = createContext<ServiceRequestContextType | undefined>(undefined)

const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: "req-1",
    title: "Execute Token Swap",
    description: "Swap 100 USDC to SOL on Jupiter",
    type: "token_swap",
    status: "pending",
    requiredReputation: 5000,
    reward: "0.5 SOL",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdBy: "user-1",
    parameters: { amount: 100, fromToken: "USDC", toToken: "SOL", dex: "Jupiter" },
  },
  {
    id: "req-2",
    title: "Verify NFT Ownership",
    description: "Check if wallet holds Magic Eden NFT",
    type: "nft_verification",
    status: "completed",
    requiredReputation: 1000,
    reward: "0.1 SOL",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    createdBy: "user-2",
    assignedAgent: "agent-1",
    parameters: { collection: "Magic Eden", walletAddress: "9B5X..." },
    completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
    rating: 5,
    feedback: "Perfect execution",
  },
  {
    id: "req-3",
    title: "Monitor Price Alert",
    description: "Alert when SOL reaches $150",
    type: "price_alert",
    status: "in_progress",
    requiredReputation: 2000,
    reward: "0.2 SOL",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdBy: "user-3",
    assignedAgent: "agent-2",
    parameters: { token: "SOL", targetPrice: 150, condition: "above" },
  },
]

export function ServiceRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS)

  const createRequest = useCallback((request: Omit<ServiceRequest, "id" | "createdAt" | "updatedAt">) => {
    const id = `req-${Date.now()}`
    const newRequest: ServiceRequest = {
      ...request,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setRequests((prev) => [newRequest, ...prev])
    return id
  }, [])

  const updateRequest = useCallback((id: string, updates: Partial<ServiceRequest>) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              ...updates,
              updatedAt: new Date(),
            }
          : req,
      ),
    )
  }, [])

  const acceptRequest = useCallback(
    (id: string, agentAddress: string) => {
      updateRequest(id, {
        status: "in_progress",
        assignedAgent: agentAddress,
      })
    },
    [updateRequest],
  )

  const completeRequest = useCallback(
    (id: string, rating: number, feedback?: string) => {
      updateRequest(id, {
        status: "completed",
        completedAt: new Date(),
        rating,
        feedback,
      })
    },
    [updateRequest],
  )

  const failRequest = useCallback(
    (id: string) => {
      updateRequest(id, {
        status: "failed",
        updatedAt: new Date(),
      })
    },
    [updateRequest],
  )

  const cancelRequest = useCallback(
    (id: string) => {
      updateRequest(id, {
        status: "cancelled",
        updatedAt: new Date(),
      })
    },
    [updateRequest],
  )

  const getRequestById = useCallback(
    (id: string) => {
      return requests.find((req) => req.id === id)
    },
    [requests],
  )

  const getRequestsByStatus = useCallback(
    (status: RequestStatus) => {
      return requests.filter((req) => req.status === status)
    },
    [requests],
  )

  const getRequestsByAgent = useCallback(
    (agentAddress: string) => {
      return requests.filter((req) => req.assignedAgent === agentAddress)
    },
    [requests],
  )

  const getRequestsByCreator = useCallback(
    (creatorAddress: string) => {
      return requests.filter((req) => req.createdBy === creatorAddress)
    },
    [requests],
  )

  return (
    <ServiceRequestContext.Provider
      value={{
        requests,
        createRequest,
        updateRequest,
        acceptRequest,
        completeRequest,
        failRequest,
        cancelRequest,
        getRequestById,
        getRequestsByStatus,
        getRequestsByAgent,
        getRequestsByCreator,
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  )
}

export function useServiceRequests() {
  const context = useContext(ServiceRequestContext)
  if (context === undefined) {
    throw new Error("useServiceRequests must be used within a ServiceRequestProvider")
  }
  return context
}
