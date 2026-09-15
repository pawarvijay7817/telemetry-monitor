import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

const PORT = 3000;

app.use(cors());

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Telemetry backend running on http://localhost:${PORT}`);
});
