import express from "express";

const router = express.Router();
const agents: Record<string, any> = {};

router.post("/register", (req, res) => {
  const { id, name, wallet, role } = req.body;
  if (!id || !name || !wallet) {
    return res.status(400).json({ error: "id, name, and wallet required" });
  }
  agents[id] = {
    id,
    name,
    wallet,
    role,
    registeredAt: new Date().toISOString(),
  };
  return res.status(201).json(agents[id]);
});

router.get("/", (req, res) => res.json(Object.values(agents)));
router.get("/:id", (req, res) => {
  const agent = agents[req.params.id];
  if (!agent) return res.status(404).json({ error: "Agent not found" });
  res.json(agent);
});

export default router;
