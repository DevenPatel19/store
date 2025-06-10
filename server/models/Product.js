import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku:        // Was in an array however that impedes uniueness checking
      {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
    
    barcodes: {
      type: String,
      required: false,  // optional if based on SKU
      unique: true,
      sparse: true,   // allows nulls
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    threshold: {
      type: Number,
      default: 5,   // Low-stock alert threshold
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: 'General1',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true, // AUTO createdAt & updatedAt logged
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;