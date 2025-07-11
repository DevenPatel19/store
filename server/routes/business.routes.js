import express from 'express';
import {
  createBusiness,
  getBusiness,
  updateBusiness
} from '../controllers/business.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect,  authorizeRoles("Staff",  "Admin"), createBusiness);
router.get('/', protect, getBusiness);
router.put('/', protect, authorizeRoles("Staff",  "Admin"),  updateBusiness);

export default router;