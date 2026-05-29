import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 1200 },
    verifiedPurchase: { type: Boolean, default: false },
    status: { type: String, enum: ["visible", "hidden", "reported"], default: "visible" }
  },
  { timestamps: true }
);

reviewSchema.index({ listing: 1, buyer: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
