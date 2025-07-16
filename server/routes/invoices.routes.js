import express from "express";
import {
  sendInvoice,
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoices.controller.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();


router.post(
    "/send",
    protect,
    authorizeRoles("Staff", "Manager", "Admin"),
    sendInvoice
)
router.get(
  "/",
  protect,
  authorizeRoles("Staff", "Manager", "Admin", "Viewer"),
  getAllInvoices
);
router.get(
  "/:id",
  protect,
  authorizeRoles("Staff", "Manager", "Admin", "Viewer"),
  getInvoiceById
);
router.post(
  "/",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  createInvoice
);
router.patch(
  "/:id",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  updateInvoice
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  deleteInvoice
);

export default router;
