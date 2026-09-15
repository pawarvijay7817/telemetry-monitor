import { Router } from "express";
import { telemetryService } from "../services/telemetry.service";

const router = Router();

router.get("/dashboard", (_req, res) => {
  try {
    const dashboard = telemetryService.getDashboard();

    res.status(200).json(dashboard);
  } catch (error) {
    console.error("Dashboard API error:", error);

    res.status(500).json({
      message: "Unable to retrieve telemetry data",
    });
  }
});

export default router;
