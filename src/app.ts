// Load environment variables first, before any other imports
import * as dotenv from "dotenv";
dotenv.config();

import { Server } from "http";
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import loansRoutes from "./api/v1/routes/loans";
import adminRoutes from "./api/v1/routes/admin";
import errorHandler from "./api/v1/middleware/errorHandler";
import {
  accessLogger,
  consoleLogger,
  errorLogger,
} from "./api/v1/middleware/logger";
import { getHelmetConfig } from "./config/helmetConfig";
import { getCorsOptions } from "./config/corsConfig";
import setupSwagger from "./config/swagger";

const app: Express = express();

const PORT: number = parseInt(process.env.PORT || "3000");

if (process.env.NODE_ENV !== "production") {
  app.use(consoleLogger);
}

app.use(accessLogger);

app.use(express.json());
app.use(morgan("combined"));

app.use(getHelmetConfig());

app.use(cors(getCorsOptions()));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Basic endpoint to verify the application is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is running successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello, Cordelia! Application is Working!
 */
app.get("/", (_req, res) => {
  res.send("Hello, Cordelia! Application is Working!");
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy and operational
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Server is healthy
 */
app.get("/health", (_req, res) => {
  res.send("Server is healthy");
});

app.use("/api/v1/loans", loansRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use(errorLogger);

app.use(errorHandler);

setupSwagger(app);

const server: Server = app.listen(PORT, "0.0.0.0", 0, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server };
