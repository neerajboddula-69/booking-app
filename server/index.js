import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import referenceRoutes from "./routes/referenceRoutes.js";
import { connectToDatabase } from "./db.js";
import { initializeAppointmentReminders } from "./services/reminderService.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", referenceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chat", chatRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

initializeAppointmentReminders().catch((error) => {
  console.error("Unable to initialize appointment reminders.");
  console.error(error);
});

connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });
