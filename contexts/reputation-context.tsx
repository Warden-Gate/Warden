"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface ReputationTier {
  id: number
  name: string
  minPoints: number
  maxPoints: number
  benefits: string[]
  color: string
}

export interface ReputationScore {
  totalPoints: number
  tier: ReputationTier
  successfulRequests: number
  failedRequests: number
  averageRating: number
  lastUpdated: Date
}

export interface ReputationActivity {
  id: string
  type: "request_completed" | "request_failed" | "rating_received" | "penalty"
  points: number
  description: string
  timestamp: Date
}

const REPUTATION_TIERS: ReputationTier[] = [
  {
    id: 1,
    name: "Newcomer",
    minPoints: 0,
    maxPoints: 1000,
    benefits: ["Access to basic requests", "Limited to 5 concurrent requests"],
    color: "text-blue-400",
  },
  {
    id: 2,
    name: "Contributor",
    minPoints: 1001,
    maxPoints: 5000,
    benefits: ["Access to standard requests", "Up to 15 concurrent requests", "1% fee reduction"],
    color: "text-cyan-400",
  },
  {
    id: 3,
    name: "Trusted",
    minPoints: 5001,
    maxPoints: 10000,
    benefits: ["Access to premium requests", "Up to 30 concurrent requests", "5% fee reduction", "Priority support"],
    color: "text-accent",
  },
  {
    id: 4,
    name: "Elite",
    minPoints: 10001,
    maxPoints: Number.POSITIVE_INFINITY,
    benefits: [
      "Access to all requests",
      "Unlimited concurrent requests",
      "10% fee reduction",
      "24/7 priority support",
      "Custom request parameters",
    ],
    color: "text-yellow-400",
  },
]

const SCORING_RULES = {
  REQUEST_COMPLETED: 100,
  REQUEST_FAILED: -50,
  PERFECT_RATING: 50,
  GOOD_RATING: 25,
  POOR_RATING: -25,
  PENALTY_FRAUD: -500,
}

interface ReputationContextType {
  score: ReputationScore
  activities: ReputationActivity[]
  tiers: ReputationTier[]
  addPoints: (points: number, description: string, type: ReputationActivity["type"]) => void
  completeRequest: (rating: number) => void
  failRequest: () => void
  getProgressToNextTier: () => number
  getTierBenefits: () => string[]
}

const ReputationContext = createContext<ReputationContextType | undefined>(undefined)

export function ReputationProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState<ReputationScore>({
    totalPoints: 8450,
    tier: REPUTATION_TIERS[2],
    successfulRequests: 24,
    failedRequests: 1,
    averageRating: 4.9,
    lastUpdated: new Date(),
  })

  const [activities, setActivities] = useState<ReputationActivity[]>([
    {
      id: "1",
      type: "request_completed",
      points: 100,
      description: "Completed token swap request",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      type: "rating_received",
      points: 50,
      description: "Received 5-star rating",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ])

  const getTierForPoints = useCallback((points: number): ReputationTier => {
    return REPUTATION_TIERS.find((tier) => points >= tier.minPoints && points <= tier.maxPoints) || REPUTATION_TIERS[0]
  }, [])

  const addPoints = useCallback(
    (points: number, description: string, type: ReputationActivity["type"]) => {
      const newPoints = Math.max(0, score.totalPoints + points)
      const newTier = getTierForPoints(newPoints)

      setScore((prev) => ({
        ...prev,
        totalPoints: newPoints,
        tier: newTier,
        lastUpdated: new Date(),
      }))

      setActivities((prev) => [
        {
          id: Date.now().toString(),
          type,
          points,
          description,
          timestamp: new Date(),
        },
        ...prev,
      ])
    },
    [score.totalPoints, getTierForPoints],
  )

  const completeRequest = useCallback(
    (rating: number) => {
      let points = SCORING_RULES.REQUEST_COMPLETED

      if (rating >= 4.5) {
        points += SCORING_RULES.PERFECT_RATING
      } else if (rating >= 3.5) {
        points += SCORING_RULES.GOOD_RATING
      } else if (rating < 3) {
        points += SCORING_RULES.POOR_RATING
      }

      setScore((prev) => ({
        ...prev,
        successfulRequests: prev.successfulRequests + 1,
        averageRating: (prev.averageRating * prev.successfulRequests + rating) / (prev.successfulRequests + 1),
      }))

      addPoints(points, `Request completed with ${rating}-star rating`, "request_completed")
    },
    [addPoints],
  )

  const failRequest = useCallback(() => {
    setScore((prev) => ({
      ...prev,
      failedRequests: prev.failedRequests + 1,
    }))

    addPoints(SCORING_RULES.REQUEST_FAILED, "Request failed", "request_failed")
  }, [addPoints])

  const getProgressToNextTier = useCallback((): number => {
    const currentTier = score.tier
    const nextTier = REPUTATION_TIERS[currentTier.id]

    if (!nextTier || nextTier.id === currentTier.id) {
      return 100
    }

    const pointsInCurrentTier = score.totalPoints - currentTier.minPoints
    const tierRange = nextTier.minPoints - currentTier.minPoints

    return Math.min(100, (pointsInCurrentTier / tierRange) * 100)
  }, [score.totalPoints, score.tier])

  const getTierBenefits = useCallback((): string[] => {
    return score.tier.benefits
  }, [score.tier])

  return (
    <ReputationContext.Provider
      value={{
        score,
        activities,
        tiers: REPUTATION_TIERS,
        addPoints,
        completeRequest,
        failRequest,
        getProgressToNextTier,
        getTierBenefits,
      }}
    >
      {children}
    </ReputationContext.Provider>
  )
}

export function useReputation() {
  const context = useContext(ReputationContext)
  if (context === undefined) {
    throw new Error("useReputation must be used within a ReputationProvider")
  }
  return context
}
