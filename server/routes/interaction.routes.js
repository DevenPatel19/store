import express from 'express';
import {
  createInteraction,
  getCustomerInteractions,
  updateInteraction,
  deleteInteraction
} from '../controllers/interaction.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createInteraction);
router.get('/customer/:customerId', protect, getCustomerInteractions);
router.put('/:id', protect, updateInteraction);
router.delete('/:id', protect, deleteInteraction);

export default router;