import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    contact: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true }
    },
    settings: {
      currency: { type: String, default: "USD" },
      timezone: { type: String, default: "America/New_York" }
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "trial", "expired"],
      default: "trial"
    }
  },
  { timestamps: true }
);

// Indexes
businessSchema.index({ name: "text" });
businessSchema.index({ "contact.email": 1 });
businessSchema.index({ owner: 1 });

const Business = mongoose.model("Business", businessSchema);

export default Business;