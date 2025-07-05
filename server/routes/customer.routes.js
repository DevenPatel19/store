import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("Viewer", "Staff", "Manager", "Admin"),
  createCustomer
);
router.get(
  "/", 
  protect, 
  getCustomers
);
router.get(
  "/:id", 
  protect, 
  getCustomerById
);
router.put(
  "/:id",
  protect,
  authorizeRoles("Viewer", "Staff", "Manager", "Admin"),
  updateCustomer
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Viewer", "Staff", "Manager", "Admin"),
  deleteCustomer
);

export default router;
