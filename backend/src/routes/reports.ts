import { Router } from "express";
import {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport,
} from "../services/reportsService.js";
import { authenticate, requireAdmin, type AuthenticatedRequest } from "../middleware/auth.js";
import { validateCreateReport } from "../middleware/validation.js";
import type { Response } from "express";

const router = Router();

// Create report (protected)
router.post("/", authenticate, validateCreateReport, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = {
      ...req.body,
      reporterId: req.userId!,
    };
    const id = await createReport(payload);
    res.status(201).json({ id });
  } catch (error: any) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: error.message || "Failed to create report" });
  }
});

// Get reports (admin only)
router.get("/", authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = req.query.status as "open" | "reviewing" | "closed" | undefined;
    const reports = await getReports(status);
    res.json({ reports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update report status (admin only)
router.put("/:id/status", authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!["open", "reviewing", "closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await updateReportStatus(req.params.id, status, req.userId!);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete report (admin only)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await deleteReport(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

