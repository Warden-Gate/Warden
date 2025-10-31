import { clusterApiUrl, Connection, PublicKey, SystemProgram } from "@solana/web3.js"

// Solana Devnet Configuration
export const SOLANA_NETWORK = "devnet"
export const RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK)

export const solanaConnection = new Connection(RPC_ENDPOINT, "confirmed")

// Use SystemProgram.programId for both - these are pre-verified and always valid
// X402_PROGRAM_ID: System program for basic transactions
export const X402_PROGRAM_ID = SystemProgram.programId

// WARDEN_PROGRAM_ID: Also use system program initially
// In production, replace with your deployed program ID
export const WARDEN_PROGRAM_ID = SystemProgram.programId

export const DEVNET_INDICATORS = {
  network: "Devnet",
  rpcEndpoint: RPC_ENDPOINT,
  testMode: true,
  faucetUrl: "https://faucet.solana.com/",
}

export function getNetworkLabel(): string {
  return `${DEVNET_INDICATORS.network} (Test Network)`
}

// Helper function to safely create a program ID from a string
export function createProgramId(address: string): PublicKey {
  try {
    return new PublicKey(address)
  } catch (error) {
    console.error(`[v0] Invalid program ID: ${address}`, error)
    return SystemProgram.programId
  }
}
