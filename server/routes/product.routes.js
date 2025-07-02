// routes/product.routes.js

import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorizeRoles('Staff', 'Manager', 'Admin'),
  createProduct
);

router.get(
  '/',
  protect,
  authorizeRoles('Viewer', 'Staff', 'Manager', 'Admin'),
  getProducts
);

router.get(
  '/:id',
  protect,
  authorizeRoles('Viewer', 'Staff', 'Manager', 'Admin'),
  getProductById
);

router.put(
  '/:id',
  protect,
  authorizeRoles('Staff', 'Manager', 'Admin'),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('Staff', 'Manager', 'Admin'),
  deleteProduct
);

export default router;
