import express from "express";
import cors from "cors";
import { appConfig } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import itinerariesRouter from "./routes/itineraries.js";
import usersRouter from "./routes/users.js";
import reportsRouter from "./routes/reports.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "WE Trip Backend API" });
});

// API routes
app.use("/api/itineraries", itinerariesRouter);
app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = appConfig.port;
app.listen(PORT, () => {
  console.log(`🚀 WE Trip Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API routes:`);
  console.log(`   - GET    /api/itineraries/public`);
  console.log(`   - GET    /api/itineraries/:id`);
  console.log(`   - POST   /api/itineraries (auth required)`);
  console.log(`   - PUT    /api/itineraries/:id (auth required)`);
  console.log(`   - DELETE /api/itineraries/:id (auth required)`);
  console.log(`   - GET    /api/users/:userId`);
  console.log(`   - POST   /api/users (auth required)`);
  console.log(`   - PUT    /api/users/:userId (auth required)`);
  console.log(`   - POST   /api/reports (auth required)`);
  console.log(`   - GET    /api/reports (admin required)`);
  console.log(`   - PUT    /api/reports/:id/status (admin required)`);
  console.log(`   - DELETE /api/reports/:id (admin required)`);
});

