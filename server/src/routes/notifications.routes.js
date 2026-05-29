import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(80);
  res.json({ notifications });
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { readAt: new Date() },
    { new: true }
  );

  res.json({ notification });
});

export default router;
