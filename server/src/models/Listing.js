import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 3000 },
    photos: [
      {
        url: String,
        publicId: String,
        hash: String,
        moderation: {
          duplicateScore: Number,
          adultScore: Number,
          unsafeScore: Number
        }
      }
    ],
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Mobiles", "Cars", "Bikes", "Properties", "Plots", "Electronics", "Furniture", "Jobs", "Others"],
      required: true,
      index: true
    },
    location: {
      label: { type: String, required: true },
      point: { type: { type: String, enum: ["Point"], default: "Point" }, coordinates: { type: [Number], required: true } }
    },
    expiresAt: { type: Date, required: true, index: true },
    contactMode: { type: String, enum: ["show_phone", "hide_phone", "whatsapp_only"], default: "hide_phone" },
    whatsappNumber: String,
    verificationDetails: {
      category: String,
      proofSummary: String,
      checklist: [String],
      adminVerified: { type: Boolean, default: false }
    },
    status: {
      type: String,
      enum: ["draft", "ai_review", "pending_admin", "approved", "rejected", "expired", "suspended"],
      default: "ai_review",
      index: true
    },
    adminDecision: {
      decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      decidedAt: Date,
      reason: String
    },
    moderation: {
      riskScore: { type: Number, default: 0 },
      verdict: { type: String, enum: ["approve", "review", "reject"], default: "review" },
      signals: [String]
    },
    deal: {
      enabled: { type: Boolean, default: false },
      label: String,
      expiresAt: Date
    },
    metrics: {
      views: { type: Number, default: 0 },
      offerCount: { type: Number, default: 0 },
      reportCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

listingSchema.index({ "location.point": "2dsphere" });
listingSchema.index({ title: "text", description: "text", category: "text", "location.label": "text" });

export const Listing = mongoose.model("Listing", listingSchema);
