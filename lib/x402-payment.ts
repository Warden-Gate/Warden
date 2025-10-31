import { type Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"
import { solanaConnection } from "./solana-config"

export interface PaymentParams {
  fromAddress: PublicKey
  toAddress: PublicKey
  lamports: number
  description: string
  agentId: string
}

export interface TransactionResult {
  signature: string
  success: boolean
  error?: string
  timestamp: number
}

// X402 Payment Handler
export class X402PaymentHandler {
  private connection: Connection

  constructor(connection?: Connection) {
    this.connection = connection || solanaConnection
  }

  async createPaymentTransaction(params: PaymentParams): Promise<Transaction> {
    const transaction = new Transaction()

    // Add system program transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: params.fromAddress,
        toPubkey: params.toAddress,
        lamports: params.lamports,
      }),
    )

    // Add memo instruction for payment metadata
    const memoInstruction = {
      keys: [
        {
          pubkey: params.fromAddress,
          isSigner: true,
          isWritable: true,
        },
      ],
      programId: new PublicKey("MemoSq4gDiJb2TS87PB44a7JysJstEZwByzqEgZiZY8"),
      data: Buffer.from(
        JSON.stringify({
          type: "x402_payment",
          agentId: params.agentId,
          description: params.description,
          timestamp: Date.now(),
        }),
      ),
    }

    transaction.add(memoInstruction)
    return transaction
  }

  async simulatePayment(transaction: Transaction, signerAddress: PublicKey): Promise<boolean> {
    try {
      transaction.feePayer = signerAddress
      const latestBlockhash = await this.connection.getLatestBlockhash()
      transaction.recentBlockhash = latestBlockhash.blockhash

      const simulation = await this.connection.simulateTransaction(transaction)

      if (simulation.value.err) {
        console.error("[v0] Transaction simulation failed:", simulation.value.err)
        return false
      }

      console.log("[v0] Transaction simulation successful")
      return true
    } catch (error) {
      console.error("[v0] Simulation error:", error)
      return false
    }
  }

  async getAccountBalance(address: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(address)
      return balance
    } catch (error) {
      console.error("[v0] Error fetching balance:", error)
      return 0
    }
  }

  formatLamports(lamports: number): string {
    return (lamports / 1000000000).toFixed(4)
  }
}

export const x402Handler = new X402PaymentHandler()
