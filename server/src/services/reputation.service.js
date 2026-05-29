import { User } from "../models/User.js";

export async function recalculateSellerReputation(sellerId, { ratingAverage, ratingCount, reportCount = 0 }) {
  const trustScore = Math.max(
    0,
    Math.min(100, Math.round(55 + ratingAverage * 9 + ratingCount * 0.4 - reportCount * 8))
  );
  const badge = trustScore >= 90 ? "elite" : trustScore >= 78 ? "trusted" : trustScore >= 65 ? "verified" : "new";

  await User.findByIdAndUpdate(sellerId, {
    "reputation.ratingAverage": ratingAverage,
    "reputation.ratingCount": ratingCount,
    "reputation.trustScore": trustScore,
    "reputation.badge": badge,
    "reputation.unresolvedReports": reportCount
  });
}
