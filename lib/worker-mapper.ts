import type { Worker } from "@/lib/data";

export type WorkerProfileRow = {
  id: string;
  skill: string;
  experience_years?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  location: string;
  distance_label?: string | null;
  bio?: string | null;
  level?: string | null;
  availability?: string | null;
  profiles?: {
    full_name?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  } | null;
};

export function mapWorkerProfile(row: WorkerProfileRow): Worker {
  const priceRange = row.price_min || row.price_max
    ? `Rs ${row.price_min ?? 0}-${row.price_max ?? row.price_min}`
    : "Price on call";

  return {
    id: row.id,
    name: row.profiles?.full_name ?? "MistriHub Worker",
    skill: row.skill,
    location: row.location,
    distance: row.distance_label ?? "Nearby",
    rating: 4.6,
    reviews: 0,
    experience: `${row.experience_years ?? 0} yrs`,
    priceRange,
    phone: row.profiles?.phone ?? "+91 98765 00000",
    whatsapp: row.profiles?.whatsapp ?? "919876500000",
    trustScore: 72,
    jobsCompleted: 0,
    responseTime: "New",
    availability: row.availability === "Busy Today" || row.availability === "Offline" ? row.availability : "Available Now",
    level: row.level === "Silver" || row.level === "Gold" || row.level === "Elite" ? row.level : "Bronze",
    about: row.bio ?? "New verified local worker on MistriHub Market."
  };
}
