import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "");
const allowedOrigins = new Set(config.frontendUrls.map(normalizeOrigin));

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server and curl requests that do not send Origin.
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 25,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", service: "victors-events-api" });
});

// Route modules encapsulate table-specific Supabase CRUD and validation.
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`Victor's Events API listening on port ${config.port}`);
});
