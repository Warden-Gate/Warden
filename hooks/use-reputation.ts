"use client"

import { useReputation } from "@/contexts/reputation-context"

export function useReputationScore() {
  const { score, completeRequest, failRequest, addPoints } = useReputation()

  return {
    score: score.totalPoints,
    tier: score.tier.name,
    tierId: score.tier.id,
    successRate:
      score.successfulRequests > 0
        ? (score.successfulRequests / (score.successfulRequests + score.failedRequests)) * 100
        : 0,
    averageRating: score.averageRating,
    successfulRequests: score.successfulRequests,
    failedRequests: score.failedRequests,
    completeRequest,
    failRequest,
    addPoints,
  }
}
