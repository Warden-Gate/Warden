import dotenv from "dotenv";
dotenv.config();

import { Request, Response, NextFunction } from "express";
import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { airdropSol, createDevnetWallet } from "../utils/solanaUtils";

// ============================
// ⚙️ Config
// ============================
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Devnet USDC
const PRICE_USDC = 100; // 0.0001 USDC (in base units)
const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

// ============================
// 🌐 Solana Connection
// ============================
export const connection = new Connection(RPC_URL, "confirmed");

// Wallet placeholders
export let RECIPIENT_WALLET: PublicKey;
export let RECIPIENT_KEYPAIR: Keypair;
export let RECIPIENT_TOKEN_ACCOUNT: PublicKey;

// ============================
// 🚀 Initialize x402 Wallet
// ============================
export async function initX402() {
  // ✅ FIX: await the async call
  const wallet = await createDevnetWallet();
  RECIPIENT_WALLET = wallet.publicKey;
  RECIPIENT_KEYPAIR = wallet.keypair;

  try {
    await airdropSol(connection, RECIPIENT_WALLET, 1);
    console.log("💧 Airdropped 1 SOL to recipient wallet");
  } catch (err) {
    console.warn("⚠️ Airdrop failed (devnet busy), continuing anyway...");
  }

  RECIPIENT_TOKEN_ACCOUNT = await getAssociatedTokenAddress(
    USDC_MINT,
    RECIPIENT_WALLET
  );

  console.log("✅ x402 Initialized");
  console.log("Recipient Wallet:", RECIPIENT_WALLET.toBase58());
  console.log("Recipient Token Account:", RECIPIENT_TOKEN_ACCOUNT.toBase58());
  console.log("RPC URL:", RPC_URL);
}

// ============================
// 🧩 Middleware to Validate x402 Payment
// ============================
export async function x402Middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!RECIPIENT_TOKEN_ACCOUNT) {
    return res.status(500).json({
      error: "x402 not initialized. Call initX402() before starting server.",
    });
  }

  const xPaymentHeader = req.header("X-Payment");

  if (!xPaymentHeader) {
    // No payment — client must send USDC first
    return res.status(402).json({
      payment: {
        recipientWallet: RECIPIENT_WALLET.toBase58(),
        tokenAccount: RECIPIENT_TOKEN_ACCOUNT.toBase58(),
        mint: USDC_MINT.toBase58(),
        amount: PRICE_USDC,
        amountUSDC: PRICE_USDC / 1_000_000,
        cluster: "devnet",
        message: "Send USDC to this token account to unlock access",
      },
    });
  }

  try {
    const paymentData = JSON.parse(
      Buffer.from(xPaymentHeader, "base64").toString("utf-8")
    ) as {
      x402Version: number;
      scheme: string;
      network: string;
      payload: { serializedTransaction: string };
    };

    const txBuffer = Buffer.from(
      paymentData.payload.serializedTransaction,
      "base64"
    );
    const tx = Transaction.from(txBuffer);

    let validTransfer = false;
    let transferAmount = 0;

    for (const ix of tx.instructions) {
      if (ix.programId.equals(TOKEN_PROGRAM_ID)) {
        if (ix.data.length >= 9 && ix.data[0] === 3) {
          transferAmount = Number(ix.data.readBigUInt64LE(1));
          const dest = ix.keys[1].pubkey;
          if (
            dest.equals(RECIPIENT_TOKEN_ACCOUNT) &&
            transferAmount >= PRICE_USDC
          ) {
            validTransfer = true;
            break;
          }
        }
      }
    }

    if (!validTransfer) {
      return res.status(402).json({ error: "Invalid USDC transfer" });
    }

    const signature = await connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    await connection.confirmTransaction(signature, "confirmed");

    res.locals.paymentSignature = signature;
    console.log("💰 Verified payment:", signature);
    next();
  } catch (e) {
    return res.status(402).json({
      error: "Payment verification failed",
      details: e instanceof Error ? e.message : "Unknown",
    });
  }
}
