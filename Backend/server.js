
import dns from "node:dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      ...(process.env.FRONTEND_ORIGIN || "")
        .split(",")
        .map(url => url.trim())
        .filter(Boolean)
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  }
}));

app.use(express.json({ limit: "20kb" }));

// MongoDB Connection
let mongoConnectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongoConnectionPromise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    mongoConnectionPromise = mongoose.connect(
      process.env.MONGODB_URI,
      { serverSelectionTimeoutMS: 10000 }
    ).catch(error => {
      mongoConnectionPromise = null;
      throw error;
    });
  }

  return mongoConnectionPromise;
}

// Trip Model
const Trip = mongoose.models.Trip ||
  mongoose.model("Trip", new mongoose.Schema({
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
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Ensure MongoDB connection for trip routes
app.use("/api/trips", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB error:", error.message);
    res.status(503).json({
      error: "Database connection unavailable"
    });
  }
});

// Get Trips
app.get("/api/trips", async (req, res) => {
  try {
    const trips = await Trip.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(trips);
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to delete trip"
    });
  }
});

// Error Handler
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error"
  });
});

// Vercel Express Entry Point
export default app;
