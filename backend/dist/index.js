"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check route
app.get("/", (req, res) => {
    res.json({ message: "Warden backend is running 🚀" });
});
// Example placeholder route (we’ll expand this later)
app.get("/api/status", (req, res) => {
    res.json({ status: "ok", network: "Solana devnet" });
});
// Start server
app.listen(PORT, () => {
    console.log(`⚡️ Server running on http://localhost:${PORT}`);
});
