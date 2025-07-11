import express from "express";
import { getFinancialSummary } from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

// GET /api/reports/summary - Protected route for financial summary
router.get(
  "/summary",
  protect,
  authorizeRoles("Manager", "Admin"),
  getFinancialSummary
);

export default router;
