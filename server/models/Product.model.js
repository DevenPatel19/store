import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      description: { type: String, required: true },  // Store product name for snapshot
      quantity: { type: Number, required: true, min: 1 },
      rate: { type: Number, required: true, min: 0 }, // Price at time of invoice
      amount: { type: Number, required: true, min: 0 },
    },
  ],
  subtotal: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0 }, // percentage e.g., 10 for 10%
  tax: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 }, // total amount (subtotal + tax)
  notes: { type: String },
  terms: { type: String },
  status: { type: String, enum: ["Paid", "Unpaid", "Pending", "Overdue"], default: "Unpaid" },
  paidDate: { type: Date },
}, { timestamps: true });

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
