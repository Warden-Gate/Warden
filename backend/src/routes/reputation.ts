import express from "express";
import {
  getReputation,
  updateReputation,
  getLeaderboard,
} from "../services/reputationService";

const router = express.Router();

router.get("/:wallet", (req, res) => {
  const wallet = req.params.wallet;
  const record = getReputation(wallet);
  if (!record)
    return res.status(404).json({ error: "No reputation record found" });
  return res.json(record);
});

router.post("/update", (req, res) => {
  const { wallet, delta } = req.body;
  if (!wallet || typeof delta !== "number") {
    return res.status(400).json({ error: "wallet and numeric delta required" });
  }
  const updated = updateReputation(wallet, delta);
  return res.json(updated);
});

router.get("/leaderboard/all", (req, res) => {
  const board = getLeaderboard();
  return res.json(board);
});

export default router;
