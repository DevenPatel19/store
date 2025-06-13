import express from 'express';
import {
  createBusiness,
  getBusiness,
  updateBusiness
} from '../controllers/business.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBusiness);
router.get('/', protect, getBusiness);
router.put('/', protect, updateBusiness);

export default router;