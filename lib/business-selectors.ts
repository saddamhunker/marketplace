import type { Business } from "@/lib/data";

export const SHOPPING_PLACE_CATEGORIES = [
  "Shops",
  "Grocery stores",
  "Medical stores",
  "Hardware shops",
  "Electronics shops",
  "Mobile repair shops"
];

export function byCategory(businesses: Business[], category: string) {
  return businesses.filter((business) => business.category === category);
}

export function openBusinesses(businesses: Business[]) {
  return businesses.filter((business) => business.openNow);
}

export function trendingBusinesses(businesses: Business[]) {
  return businesses.filter((business) => business.trending);
}

export function shoppingBusinesses(businesses: Business[]) {
  return businesses.filter((business) => SHOPPING_PLACE_CATEGORIES.includes(business.category));
}
