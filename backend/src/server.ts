import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.routes";

export const app = express();

export const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", dashboardRoutes);

export function startServer(): void {
  app.listen(PORT, () => {
    console.log(`Telemetry backend running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}
