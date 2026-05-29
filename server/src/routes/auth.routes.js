import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.patch("/profile", requireAuth, async (req, res) => {
  const allowed = ["displayName", "avatarUrl", "location", "contactPreferences"];
  for (const field of allowed) {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  }

  await req.user.save();
  res.json({ user: req.user });
});

export default router;
