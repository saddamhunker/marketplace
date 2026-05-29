import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Dispute } from "../models/Dispute.js";
import { Listing } from "../models/Listing.js";
import { Report } from "../models/Report.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const listing = req.body.listingId ? await Listing.findById(req.body.listingId) : null;
  const report = await Report.create({
    reporter: req.user._id,
    listing: listing?._id,
    seller: listing?.seller ?? req.body.sellerId,
    reason: req.body.reason,
    description: req.body.description,
    evidence: req.body.evidence ?? []
  });

  if (listing) {
    await Listing.findByIdAndUpdate(listing._id, { $inc: { "metrics.reportCount": 1 } });
  }

  res.status(201).json({ report });
});

router.post("/disputes", requireAuth, async (req, res) => {
  const listing = await Listing.findById(req.body.listingId);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  const dispute = await Dispute.create({
    listing: listing._id,
    buyer: req.user._id,
    seller: listing.seller,
    issue: req.body.issue,
    details: req.body.details
  });

  res.status(201).json({ dispute });
});

export default router;
