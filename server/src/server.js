import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "node:http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import listingRoutes from "./routes/listings.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import offerRoutes from "./routes/offers.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import { User } from "./models/User.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }
});

app.set("io", io);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 140 }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "trustloop-api",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

io.on("connection", (socket) => {
  socket.on("join:user", (userId) => socket.join(`user:${userId}`));
  socket.on("join:listing", (listingId) => socket.join(`listing:${listingId}`));
});

const port = process.env.PORT ?? 8080;

httpServer.listen(port, () => {
  console.log(`TrustLoop API running on http://localhost:${port}`);
});

connectDatabase()
  .then(async () => {
    console.log("Database connected");
    try {
      const indexes = await User.collection.indexes();
      const geoIndex = indexes.find((index) => index.key?.["location.point"] === "2dsphere");
      if (geoIndex) {
        await User.collection.dropIndex(geoIndex.name);
        console.log(`Dropped unused user geolocation index: ${geoIndex.name}`);
      }
      await User.updateMany(
        { "location.point.coordinates": { $size: 0 } },
        { $unset: { "location.point": "" } }
      );
    } catch (error) {
      console.warn("User geolocation cleanup skipped", error.message);
    }
  })
  .catch((error) => {
    console.error("Database connection failed. API is running in degraded mode.", error.message);
  });
