import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issue: { type: String, required: true, maxlength: 160 },
    details: { type: String, maxlength: 2500 },
    status: { type: String, enum: ["open", "seller_response", "admin_review", "resolved", "closed"], default: "open" },
    resolution: String,
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Dispute = mongoose.model("Dispute", disputeSchema);
