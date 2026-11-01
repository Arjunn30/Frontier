import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));
const Trip = mongoose.model("Trip", new mongoose.Schema({
  destination: { type: String, required: true, trim: true, maxlength: 90 },
  days: { type: Number, required: true, min: 1, max: 30 },
  budget: { type: Number, required: true, min: 0, max: 100000000 },
  activities: [{ type: String, maxlength: 100 }]
}, { timestamps: true }));
app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.get("/api/trips", async (_, res) => {
  try { res.json(await Trip.find().sort({ createdAt: -1 }).limit(100)); }
  catch { res.status(500).json({ error: "Unable to load trips" }); }
});
app.post("/api/trips", async (req, res) => {
  try {
    const { destination, days, budget, activities = [] } = req.body || {};
    if (typeof destination !== "string" || !destination.trim() || destination.length > 90 ||
        !Number.isInteger(days) || days < 1 || days > 30 ||
        typeof budget !== "number" || !Number.isFinite(budget) || budget < 0 || budget > 100000000 ||
        !Array.isArray(activities) || activities.length > 20 || activities.some(x => typeof x !== "string" || x.length > 100)) {
      return res.status(400).json({ error: "Invalid trip details" });
    }
    res.status(201).json(await Trip.create({ destination, days, budget, activities }));
  } catch { res.status(500).json({ error: "Unable to save trip" }); }
});
app.delete("/api/trips/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid trip ID" });
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json({ deleted: true });
  } catch { res.status(500).json({ error: "Unable to delete trip" }); }
});
const port = Number(process.env.PORT) || 5000;
try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/frontier", { serverSelectionTimeoutMS: 8000 });
  app.listen(port, () => console.log(`FRONTIER backend: http://localhost:${port}`));
} catch (error) { console.error("MongoDB connection failed:", error.message); process.exit(1); }
