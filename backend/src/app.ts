import express from "express";
const app = express();
import cors from "cors";
import helmet from "helmet";
import healthroute from "./routes/health.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";

// middlewares
app.use(
  cors({
    origin: [env.CLIENT_URL],
    credentials: true,
  }),
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(cookieParser());

const frontendPath = path.join(process.cwd(), "public", "dist");
app.use(express.static(frontendPath));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);

// health check route
app.use("/api/health", healthroute);

// SPA catch-all — serve index.html for any non-API route
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorHandler);

export default app;
