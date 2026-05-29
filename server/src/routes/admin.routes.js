import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { Category } from "../models/Category.js";
import { Dispute } from "../models/Dispute.js";
import { Listing } from "../models/Listing.js";
import { Report } from "../models/Report.js";
import { User } from "../models/User.js";
import { createUserNotification, notifyUsersNearListing } from "../services/notification.service.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/dashboard", async (_req, res) => {
  const [pendingListings, openReports, disputes, users, highRisk] = await Promise.all([
    Listing.countDocuments({ status: "pending_admin" }),
    Report.countDocuments({ status: { $in: ["open", "investigating"] } }),
    Dispute.countDocuments({ status: { $nin: ["resolved", "closed"] } }),
    User.countDocuments({ status: "active" }),
    Listing.countDocuments({ "moderation.riskScore": { $gte: 70 } })
  ]);

  res.json({ pendingListings, openReports, disputes, users, highRisk });
});

router.get("/listings/pending", async (_req, res) => {
  const listings = await Listing.find({ status: "pending_admin" }).populate("seller", "displayName reputation verification").sort({ createdAt: 1 });
  res.json({ listings });
});

router.patch("/listings/:id/decision", async (req, res) => {
  const approved = req.body.decision === "approve";
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    {
      status: approved ? "approved" : "rejected",
      adminDecision: {
        decidedBy: req.user._id,
        decidedAt: new Date(),
        reason: req.body.reason
      }
    },
    { new: true }
  );

  if (!listing) return res.status(404).json({ message: "Listing not found" });

  await createUserNotification({
    user: listing.seller,
    type: "listing_decision",
    title: approved ? "Listing approved" : "Listing rejected",
    body: approved ? `${listing.title} is now live.` : req.body.reason ?? "Admin rejected the listing.",
    data: { listingId: listing._id },
    io: req.app.get("io")
  });

  if (approved) {
    await notifyUsersNearListing(listing, req.app.get("io"));
  }

  res.json({ listing });
});

router.get("/reports", async (_req, res) => {
  const reports = await Report.find().populate("reporter seller listing").sort({ createdAt: -1 }).limit(100);
  res.json({ reports });
});

router.patch("/reports/:id", async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ report });
});

router.get("/disputes", async (_req, res) => {
  const disputes = await Dispute.find().populate("buyer seller listing").sort({ createdAt: -1 }).limit(100);
  res.json({ disputes });
});

router.patch("/disputes/:id", async (req, res) => {
  const dispute = await Dispute.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ dispute });
});

router.post("/categories", async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ category });
});

export default router;
