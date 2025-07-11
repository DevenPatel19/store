import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  clearCompletedTasks,
} from '../controllers/tasks.controller.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorizeRoles('Viewer', 'Staff', 'Manager', 'Admin'), getTasks)
  .post(protect, authorizeRoles('Staff', 'Manager', 'Admin'), createTask); // ✅ Viewer removed

router
  .route('/:id')
  .put(protect, authorizeRoles('Staff', 'Manager', 'Admin'), updateTask)
  .delete(protect, authorizeRoles('Staff', 'Manager', 'Admin'), deleteTask);

router
  .route('/complete')
  .post(protect, authorizeRoles('Staff', 'Manager', 'Admin'), clearCompletedTasks);

  export default router