import express, { Request, Response } from "express";
const router = express.Router();

// Example: locked endpoint that requires verified tip
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Access granted ✅" });
});

export default router;
