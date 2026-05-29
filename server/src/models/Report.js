import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    reason: {
      type: String,
      enum: ["fake_listing", "scam_payment", "duplicate", "misleading", "unsafe_contact", "other"],
      required: true
    },
    description: { type: String, maxlength: 2000 },
    evidence: [{ url: String, publicId: String }],
    status: { type: String, enum: ["open", "investigating", "resolved", "dismissed"], default: "open" },
    adminNotes: String
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
