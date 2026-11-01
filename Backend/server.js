
import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
}));

app.use(express.json({ limit: "20kb" }));

// MongoDB Trip Model
const Trip = mongoose.model("Trip", new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    trim: true,
    maxlength: 90
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
    max: 100000000
  },
  activities: [{
    type: String,
    maxlength: 100
  }]
}, { timestamps: true }));

// Health Check
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// Get Trips
app.get("/api/trips", async (_, res) => {
  try {
    const trips = await Trip.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(trips);
  } catch {
    res.status(500).json({
      error: "Unable to load trips"
    });
  }
});

// Save Trip
app.post("/api/trips", async (req, res) => {
  try {
    const {
      destination,
      days,
      budget,
      activities = []
    } = req.body || {};

    if (
      typeof destination !== "string" ||
      !destination.trim() ||
      destination.length > 90 ||
      !Number.isInteger(days) ||
      days < 1 ||
      days > 30 ||
      typeof budget !== "number" ||
      !Number.isFinite(budget) ||
      budget < 0 ||
      budget > 100000000 ||
      !Array.isArray(activities) ||
      activities.length > 20 ||
      activities.some(
        x => typeof x !== "string" || x.length > 100
      )
    ) {
      return res.status(400).json({
        error: "Invalid trip details"
      });
    }

    const trip = await Trip.create({
      destination,
      days,
      budget,
      activities
    });

    res.status(201).json(trip);
  } catch {
    res.status(500).json({
      error: "Unable to save trip"
    });
  }
});

// Delete Trip
app.delete("/api/trips/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      error: "Invalid trip ID"
    });
  }

  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found"
      });
    }

    res.json({ deleted: true });
  } catch {
    res.status(500).json({
      error: "Unable to delete trip"
    });
  }
});

// Serve React Frontend
const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

const frontendPath = path.resolve(__dirname, "../Frontend/dist");

app.use(express.static(frontendPath));

// React Router Fallback (Express 4 & 5 compatible)
app.use((req, res, next) => {
  if (
    req.method !== "GET" ||
    req.path.startsWith("/api/")
  ) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
const port = Number(process.env.PORT) || 5000;

try {
  await mongoose.connect(
    process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/frontier",
    {
      serverSelectionTimeoutMS: 8000
    }
  );

  app.listen(port, "0.0.0.0", () => {
    console.log(
      `FRONTIER running on port ${port}`
    );
  });
} catch (error) {
  console.error(
    "MongoDB connection failed:",
    error.message
  );
  process.exit(1);
}
