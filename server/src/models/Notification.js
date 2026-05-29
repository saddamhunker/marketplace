import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["nearby_listing", "offer", "offer_expiring", "chat", "report_update", "listing_decision"],
      required: true
    },
    title: String,
    body: String,
    data: mongoose.Schema.Types.Mixed,
    readAt: Date,
    sentAt: Date
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
