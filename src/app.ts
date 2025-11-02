import { Server } from "http";
import express, { Express } from "express";
import morgan from "morgan";

import loansRoutes from "./api/v1/routes/loans";

const app: Express = express();

const PORT: number = parseInt(process.env.PORT || '3000');

app.use(express.json());
app.use(morgan("combined"));

// I had to add an underscore infront of req to stop the TS errors
app.get("/", (_req, res) => {
    res.send("Hello, Cordelia! Application is Working!");
});

app.get("/health", (_req, res) => {
    res.send("Server is healthy")
});

app.use("/api/v1/loans", loansRoutes)

const server: Server = app.listen(PORT, '0.0.0.0', 0, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, server };