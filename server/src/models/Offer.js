import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    message: { type: String, maxlength: 700 },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["sent", "accepted", "rejected", "expired", "withdrawn"], default: "sent" }
  },
  { timestamps: true }
);

export const Offer = mongoose.model("Offer", offerSchema);
