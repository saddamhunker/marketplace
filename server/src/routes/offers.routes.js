import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Listing } from "../models/Listing.js";
import { Offer } from "../models/Offer.js";
import { createUserNotification } from "../services/notification.service.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const listing = await Listing.findById(req.body.listingId);
  if (!listing || listing.status !== "approved") return res.status(404).json({ message: "Approved listing not found" });

  const offer = await Offer.create({
    listing: listing._id,
    buyer: req.user._id,
    seller: listing.seller,
    amount: req.body.amount,
    message: req.body.message,
    expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  await Listing.findByIdAndUpdate(listing._id, { $inc: { "metrics.offerCount": 1 } });
  await createUserNotification({
    user: listing.seller,
    type: "offer",
    title: "New offer received",
    body: `A buyer offered ₹${offer.amount}`,
    data: { offerId: offer._id, listingId: listing._id },
    io: req.app.get("io")
  });

  res.status(201).json({ offer });
});

router.patch("/:id", requireAuth, async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: "Offer not found" });
  if (!offer.seller.equals(req.user._id) && !offer.buyer.equals(req.user._id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  offer.status = req.body.status ?? offer.status;
  await offer.save();
  res.json({ offer });
});

export default router;
