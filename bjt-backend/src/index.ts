import "./config/config";
import express from "express";
import cors from "cors";
import jobRoutes from "./routes/job-routes";
import { connectDB } from "./config/db";
import { Db } from "mongodb";

const port = process.env.PORT || process.env.BACKEND_PORT || 3000;

const app = express();
// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : `${process.env.URL}:${process.env.FRONTEND_PORT}`, // localhost for dev
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: false,
  })
);
app.use(express.json());

app.use("/api/jobs", jobRoutes);

// Database variable
let db: Db;

//health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB
    db = await connectDB();
    (global as any).db = db; // make globally accessible

    app.listen(port, () => {
      console.log(`🎉 Server listening on port ${port}`);
      if (process.env.NODE_ENV !== "production") {
        console.log(`Access at: http://localhost:${port}`);
      }
    });
  } catch (e) {
    console.error("Failed to start server due to DB connection error.", e);
    process.exit(1);
  }
}
// Invoke the start server function
startServer();
