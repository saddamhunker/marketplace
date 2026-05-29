import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { Listing } from "../models/Listing.js";
import { moderateListingDraft } from "../services/scamDetection.service.js";

const router = Router();

const createListingSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(3000),
  photos: z.array(z.object({ url: z.string().url(), publicId: z.string().optional(), hash: z.string().optional() })).min(1),
  price: z.number().nonnegative(),
  category: z.enum(["Mobiles", "Cars", "Bikes", "Properties", "Plots", "Electronics", "Furniture", "Jobs", "Others"]),
  location: z.object({
    label: z.string().min(2),
    longitude: z.number(),
    latitude: z.number()
  }),
  expiresAt: z.string().datetime(),
  contactMode: z.enum(["show_phone", "hide_phone", "whatsapp_only"]).default("hide_phone"),
  whatsappNumber: z.string().optional(),
  verificationDetails: z.object({
    category: z.string().optional(),
    proofSummary: z.string().max(1200).optional(),
    checklist: z.array(z.string()).optional(),
    adminVerified: z.boolean().optional()
  }).optional(),
  deal: z.object({ enabled: z.boolean(), label: z.string().optional(), expiresAt: z.string().datetime().optional() }).optional()
});

router.get("/", async (req, res) => {
  const query = { status: "approved", expiresAt: { $gt: new Date() } };

  if (req.query.category) query.category = req.query.category;
  if (req.query.city) query["location.label"] = { $regex: req.query.city, $options: "i" };
  if (req.query.verified === "true") query["seller.verification.identity"] = true;
  if (req.query.search) query.$text = { $search: req.query.search };

  const listings = await Listing.find(query)
    .populate("seller", "displayName avatarUrl reputation verification contactPreferences phoneNumber")
    .sort({ createdAt: -1 })
    .limit(60);

  res.json({ listings });
});

router.post("/", requireAuth, async (req, res) => {
  const payload = createListingSchema.parse(req.body);
  const listing = new Listing({
    ...payload,
    seller: req.user._id,
    expiresAt: new Date(payload.expiresAt),
    location: {
      label: payload.location.label,
      point: { type: "Point", coordinates: [payload.location.longitude, payload.location.latitude] }
    },
    status: "ai_review"
  });

  listing.moderation = await moderateListingDraft(listing, req.user);
  listing.status = listing.moderation.verdict === "reject" ? "rejected" : "pending_admin";
  await listing.save();

  res.status(201).json({ listing });
});

router.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("seller", "displayName avatarUrl reputation verification contactPreferences phoneNumber");
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  res.json({ listing });
});

export default router;
