const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function fetchListings(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE}/listings?${query}`);
  if (!response.ok) throw new Error("Unable to load listings");
  return response.json();
}

export async function createListing(payload, idToken) {
  const response = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {})
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Listing submission failed");
  return data;
}

export function mapListingFromApi(listing) {
  return {
    id: listing._id,
    title: listing.title,
    category: listing.category,
    price: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(listing.price || 0),
    location: listing.location?.label || "Nearby",
    distance: "Live",
    score: listing.seller?.reputation?.trustScore || 72,
    rating: listing.seller?.reputation?.ratingAverage || 4.5,
    expires: listing.deal?.expiresAt ? "Deal active" : "Admin approved",
    image: listing.photos?.[0]?.url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    tags: [listing.status === "approved" ? "Admin approved" : "Pending review", listing.moderation?.verdict ? `AI: ${listing.moderation.verdict}` : "AI checked", "Verified flow"]
  };
}

export async function fetchAdminDashboard(idToken) {
  const response = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Admin dashboard unavailable");
  return data;
}

export async function fetchPendingListings(idToken) {
  const response = await fetch(`${API_BASE}/admin/listings/pending`, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Pending listings unavailable");
  return data;
}

export async function decideListing(listingId, decision, idToken, reason = "") {
  const response = await fetch(`${API_BASE}/admin/listings/${listingId}/decision`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({ decision, reason })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Admin decision failed");
  return data;
}
