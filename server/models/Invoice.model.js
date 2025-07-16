import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
    }
  ],
  amount: { type: Number, required: true, min: 0 }, // total amount
  status: { type: String, enum: ["Paid", "Unpaid", "Pending", "Overdue"], default: "Unpaid" },
  paidDate: { type: Date },
}, { timestamps: true });


export default mongoose.model("Invoice", invoiceSchema);
