import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["Paid", "Unpaid", "Pending"], default: "Unpaid" },
    paidDate: { type: Date }, // useful for reports on paid invoices by date
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
