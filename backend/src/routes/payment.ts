import express from "express";
import { x402Middleware } from "../middleware/x402";
import { verifySolanaTx } from "../utils/solanaUtils";

const router = express.Router();

/**
 * @route POST /api/pay
 * Initiates x402 payment challenge
 */
router.post("/pay", x402Middleware, async (req, res) => {
  return res.status(402).json({
    message: "Payment Required",
    details: req.body,
  });
});

/**
 * @route POST /api/verify
 * Verifies transaction and returns proof
 */
router.post("/verify", async (req, res) => {
  try {
    const { txHash, payer } = req.body;
    if (!txHash || !payer) {
      return res.status(400).json({ error: "txHash and payer are required" });
    }

    const verified = await verifySolanaTx(txHash, payer);
    if (!verified) {
      return res.status(400).json({ verified: false, error: "Invalid transaction" });
    }

    return res.status(200).json({
      verified: true,
      proof: {
        txHash,
        payer,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("verify error:", error);
    return res.status(500).json({ error: "Internal verification error" });
  }
});

export default router;
