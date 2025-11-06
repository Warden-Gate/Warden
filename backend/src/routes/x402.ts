import express, { Request, Response } from "express";
import { Transaction, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  x402Middleware,
  RECIPIENT_WALLET,
  RECIPIENT_TOKEN_ACCOUNT,
  connection, // import the Solana connection
} from "../middleware/x402";

const router = express.Router();

/**
 * @route POST /api/pay
 * Purpose: initiate or verify a payment via x402 header
 */
router.post("/pay", x402Middleware, (req: Request, res: Response) => {
  const txSignature = res.locals.paymentSignature;
  res.json({
    success: true,
    message: "Payment verified successfully",
    txSignature,
  });
});

/**
 * @route POST /api/verify
 * Purpose: verify a serialized transaction separately
 */
router.post("/verify", async (req: Request, res: Response) => {
  const { serializedTransaction } = req.body;

  if (!serializedTransaction)
    return res.status(400).json({ error: "Missing serializedTransaction" });

  try {
    const txBuffer = Buffer.from(serializedTransaction, "base64");
    const tx = Transaction.from(txBuffer);

    let valid = false;
    for (const ix of tx.instructions) {
      if (
        ix.programId.equals(TOKEN_PROGRAM_ID) &&
        ix.data[0] === 3 &&
        ix.keys[1].pubkey.equals(RECIPIENT_TOKEN_ACCOUNT)
      ) {
        valid = true;
        break;
      }
    }

    if (!valid) return res.status(400).json({ error: "Invalid transfer" });

    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(signature, "confirmed");

    res.json({
      verified: true,
      txSignature: signature,
      recipient: RECIPIENT_WALLET.toBase58(),
    });
  } catch (e) {
    res.status(500).json({
      verified: false,
      error: e instanceof Error ? e.message : "Unknown error",
    });
  }
});

export default router;
