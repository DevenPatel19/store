import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

// Create Product
router.post(
  "/",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  async (req, res) => {
    const {
      name,
      sku,
      barcodes,
      quantity,
      price,
      category,
      photoUrl,
      threshold,
    } = req.body;

    try {
      // console.log("Received body:", req.body); // payload received from form
      if (
        !name || 
        !sku || 
        price == null || 
        quantity == null
      ) {
        return res.status(400).json({ message: "Please fill all fields" });
      }
      const product = await Product.create({
        name,
        sku: sku.toLowerCase(), // maintain uniformity of data
        barcodes: barcodes || undefined, // keep optional, don't send empty string
        quantity,
        threshold: threshold ?? 5, // default if not provided
        price,
        category: category || "General1",
        photoUrl: photoUrl || undefined,
        createdBy: req.user._id, // set ownership here
      });
      res.status(201).json(product);
    } catch (err) {
      console.log("Add product error: ", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get Product
router.get(
  "/",
  authorizeRoles("Staff", "Manager", "Admin", "Viewer"),
  async (req, res) => {
    const { category } = req.query;
    try {
      const query = category ? { category } : {};
      const products = await Product.find(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get a Product
router.get(
  "/:id",
  authorizeRoles("Viewer", "Staff", "Manager", "Admin"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update a Product
router.put(
  "/:id",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  async (req, res) => {
    const { name, sku, barcodes, quantity, price, category, photoUrl, threshold } =
      req.body;

    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      
      if (name !== undefined) product.name = name;
      if (sku !== undefined) product.sku = sku.toLowerCase();
      if (barcodes !== undefined) product.barcodes = barcodes || undefined; 
      if (category !== undefined) product.category = category;
      if (photoUrl !== undefined) product.photoUrl = photoUrl;
      if (quantity !== undefined) product.quantity = quantity;
      if (price !== undefined) product.price = price;
      if (threshold !== undefined) product.threshold = threshold;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a Product
router.delete(
  "/:id",
  protect,
  authorizeRoles("Staff", "Manager", "Admin"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      await product.deleteOne();
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
