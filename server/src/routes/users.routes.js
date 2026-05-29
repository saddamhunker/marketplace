import { Router } from "express";
import { requireAuth, requireVerifiedUser } from "../middleware/auth.js";
import { Review } from "../models/Review.js";
import { recalculateSellerReputation } from "../services/reputation.service.js";

const router = Router();

router.post("/:sellerId/reviews", requireAuth, requireVerifiedUser, async (req, res) => {
  const review = await Review.create({
    seller: req.params.sellerId,
    buyer: req.user._id,
    listing: req.body.listingId,
    rating: req.body.rating,
    comment: req.body.comment,
    verifiedPurchase: Boolean(req.body.verifiedPurchase)
  });

  const stats = await Review.aggregate([
    { $match: { seller: review.seller, status: "visible" } },
    { $group: { _id: "$seller", ratingAverage: { $avg: "$rating" }, ratingCount: { $sum: 1 } } }
  ]);

  await recalculateSellerReputation(req.params.sellerId, {
    ratingAverage: stats[0]?.ratingAverage ?? 0,
    ratingCount: stats[0]?.ratingCount ?? 0
  });

  res.status(201).json({ review });
});

export default router;
