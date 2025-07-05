import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      require: false

    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    contact: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true }
    },
    status: {
      type: String,
      enum: ["active", "inactive", "lead"],
      default: "active"
    },
    tags: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
    lastInteraction: Date
  },
  { timestamps: true }
);

// Indexes
customerSchema.index({ name: "text" });
customerSchema.index({ "contact.email": 1 });
customerSchema.index({ business: 1, status: 1 });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;