import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessageAt: Date,
    status: { type: String, enum: ["active", "blocked", "archived"], default: "active" }
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
