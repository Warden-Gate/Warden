type ReputationRecord = {
  wallet: string;
  score: number;
  lastUpdated: string;
};

const reputationDB: Record<string, ReputationRecord> = {};

export const getReputation = (wallet: string): ReputationRecord | null => {
  return reputationDB[wallet] || null;
};

export const updateReputation = (
  wallet: string,
  delta: number
): ReputationRecord => {
  const current = reputationDB[wallet] || {
    wallet,
    score: 0,
    lastUpdated: new Date().toISOString(),
  };
  const updated = {
    ...current,
    score: Math.max(0, current.score + delta),
    lastUpdated: new Date().toISOString(),
  };
  reputationDB[wallet] = updated;
  return updated;
};

export const getLeaderboard = (): ReputationRecord[] => {
  return Object.values(reputationDB).sort((a, b) => b.score - a.score);
};
