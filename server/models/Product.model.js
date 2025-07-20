import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, lowercase: true, trim: true },
  barcodes: { type: String, default: null, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  threshold: { type: Number, default: 5, min: 0 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: "General", trim: true },
  photoUrl: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
