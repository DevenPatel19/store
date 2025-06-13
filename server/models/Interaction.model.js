import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["call", "email", "meeting", "note", "sale"],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    details: {
      type: String,
      trim: true
    },
    outcome: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Indexes
interactionSchema.index({ customer: 1 });
interactionSchema.index({ user: 1 });
interactionSchema.index({ createdAt: -1 });

const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;