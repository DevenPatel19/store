import express from "express";
import {
  createInteraction,
  getCustomerInteractions,
  updateInteraction,
  deleteInteraction,
} from "../controllers/interaction.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  createInteraction
);
router.get("/customer/:customerId", protect, getCustomerInteractions);
router.put(
  "/:id",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  updateInteraction
);
router.delete(
  "/:id",
  authorizeRoles("Staff", "Manager", "Admin"),
  protect,
  deleteInteraction
);

export default router;
