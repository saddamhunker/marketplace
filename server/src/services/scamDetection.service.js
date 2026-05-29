const riskyPhrases = [
  "advance payment",
  "urgent transfer",
  "no inspection",
  "pay token",
  "outside app",
  "courier only"
];

const medianPriceByCategory = {
  Mobiles: 42000,
  Cars: 650000,
  Bikes: 85000,
  Properties: 4500000,
  Plots: 2500000,
  Electronics: 28000,
  Furniture: 18000,
  Jobs: 0,
  Others: 10000
};

export async function moderateListingDraft(listing, seller) {
  const signals = [];
  let riskScore = 0;
  const text = `${listing.title} ${listing.description}`.toLowerCase();

  for (const phrase of riskyPhrases) {
    if (text.includes(phrase)) {
      signals.push(`Risky phrase: "${phrase}"`);
      riskScore += 18;
    }
  }

  const medianPrice = medianPriceByCategory[listing.category] ?? 0;
  if (medianPrice > 0 && listing.price < medianPrice * 0.45) {
    signals.push("Suspiciously low price compared with local category median");
    riskScore += 26;
  }

  const duplicatePhoto = listing.photos?.find((photo) => Number(photo.moderation?.duplicateScore ?? 0) > 0.82);
  if (duplicatePhoto) {
    signals.push("Possible duplicate image detected");
    riskScore += 30;
  }

  if ((seller?.reputation?.unresolvedReports ?? 0) >= 2) {
    signals.push("Seller has unresolved reports");
    riskScore += 24;
  }

  if (!seller?.isVerified) {
    signals.push("Seller profile is not fully verified");
    riskScore += 12;
  }

  if (!listing.verificationDetails?.proofSummary) {
    signals.push("Category proof summary is missing");
    riskScore += 10;
  }

  const verdict = riskScore >= 70 ? "reject" : riskScore >= 30 ? "review" : "approve";
  return { riskScore: Math.min(riskScore, 100), verdict, signals };
}

export function scanMessageForUnsafeContact(body) {
  const text = body.toLowerCase();
  return riskyPhrases.filter((phrase) => text.includes(phrase));
}
