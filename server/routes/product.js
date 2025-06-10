import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

// Create Product
router.post("/", protect, authorizeRoles("Staff", "Manager", "Admin"), async (req, res) => {
  const { name, sku, barcodes, quantity, price, category, photoUrl } =
    req.body;

  try {
    if (
      !name ||
      !sku ||
      !barcodes ||
      !category ||
      !price    ||
      !photoUrl ||
      !quantity
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const product = await Product.create({
      name,
      sku,
      barcodes,
      category,
      category,
      photoUrl,
      quantity,
      price,
      createdBy: req.user._id,  // set ownership here
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Product
router.get("/",authorizeRoles("Staff", "Manager", "Admin", "Viewer"), async (req, res) => {
  const { category } = req.query;
  try {
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a Product
router.get("/:id", authorizeRoles("Viewer", "Staff", "Manager", "Admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a Product
router.put("/:id", protect, authorizeRoles("Staff", "Manager", "Admin"), async (req, res) => {
  const { name, sku, barcodes, quantity, price, category, photoUrl } =
    req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.barcodes = barcodes || product.barcodes;
    product.category = category || product.category;
    product.photoUrl = photoUrl || recipe.photoUrl;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a Product
router.delete("/:id", protect, authorizeRoles("Staff", "Manager", "Admin"), async (req, res) => {
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
});

export default router;