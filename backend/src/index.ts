import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initX402 } from "./middleware/x402";

// 🔗 Import route modules
import paymentRoutes from "./routes/payment";
import reputationRoutes from "./routes/reputation";
import agentRoutes from "./routes/agent";
import accessRoutes from "./routes/access";
import transactionsRoutes from "./routes/transactions";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🚀 Initialize x402 before starting server
initX402()
  .then(() => {
    console.log("✅ x402 Ready — Trust Layer Active");

    // Health check
    app.get("/", (req: Request, res: Response) => {
      res.json({ message: "Warden backend is running 🚀" });
    });

    app.get("/api/status", (req: Request, res: Response) => {
      res.json({ status: "ok", network: "Solana devnet" });
    });

    // Mount API routes
    app.use("/api/payment", paymentRoutes);
    app.use("/api/reputation", reputationRoutes);
    app.use("/api/agent", agentRoutes);
    app.use("/api/access", accessRoutes);
    app.use("/api/transactions", transactionsRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`⚡️ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize x402", err);
  });
