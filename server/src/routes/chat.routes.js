import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Conversation } from "../models/Conversation.js";
import { Listing } from "../models/Listing.js";
import { Message } from "../models/Message.js";
import { createUserNotification } from "../services/notification.service.js";
import { scanMessageForUnsafeContact } from "../services/scamDetection.service.js";

const router = Router();

router.post("/conversations", requireAuth, async (req, res) => {
  const listing = await Listing.findById(req.body.listingId);
  if (!listing || listing.status !== "approved") return res.status(404).json({ message: "Approved listing not found" });

  const participants = [req.user._id, listing.seller].sort();
  const conversation = await Conversation.findOneAndUpdate(
    { listing: listing._id, participants: { $all: participants } },
    { listing: listing._id, participants },
    { upsert: true, new: true }
  );

  res.status(201).json({ conversation });
});

router.post("/conversations/:id/messages", requireAuth, async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation?.participants.some((participant) => participant.equals(req.user._id))) {
    return res.status(403).json({ message: "Conversation access denied" });
  }

  const safetyFlags = scanMessageForUnsafeContact(req.body.body);
  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    body: req.body.body,
    safetyFlags
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  for (const participant of conversation.participants) {
    if (!participant.equals(req.user._id)) {
      await createUserNotification({
        user: participant,
        type: "chat",
        title: "New marketplace message",
        body: safetyFlags.length ? "Message contains safety warnings." : req.body.body.slice(0, 80),
        data: { conversationId: conversation._id },
        io: req.app.get("io")
      });
    }
  }

  req.app.get("io")?.to(`listing:${conversation.listing}`).emit("chat:message", message);
  res.status(201).json({ message });
});

export default router;
