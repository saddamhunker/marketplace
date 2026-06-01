import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const OLD_ENV_PATH = "E:/mistrihub/.env.local";
const DEMO_EMAIL_SUFFIX = "@mistrihub.local";

const demoWorkerIds = [
  "rajesh-electrician",
  "imran-plumber",
  "sunita-painter",
  "ravi-mechanic",
  "balram-labour",
  "arif-ac",
  "meena-tailor",
  "manoj-carpenter",
  "pooja-cleaning",
  "ganesh-driver",
  "naseem-mobile",
  "kavita-cook",
  "prakash-camera",
  "jaspreet-welder",
  "shahid-fridge",
  "deepa-beauty",
  "vivek-pest",
  "omkar-tutor",
  "suresh-shifting",
  "farida-nurse"
];

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const value = line.trim();
    if (!value || value.startsWith("#") || !value.includes("=")) continue;

    const index = value.indexOf("=");
    env[value.slice(0, index).trim()] = value
      .slice(index + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
  }

  return env;
}

function makeClient(env, label, serviceRequired = false) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = serviceRequired
    ? env.SUPABASE_SERVICE_ROLE_KEY
    : env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(`Missing ${label} Supabase URL or key.`);
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function findUserByEmail(admin, email) {
  let page = 1;
  while (page < 30) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;

    const user = data.users.find((item) => item.email === email);
    if (user) return user;
    if (data.users.length < 100) return null;

    page += 1;
  }

  return null;
}

async function cleanupDemoWorkers(admin) {
  let removed = 0;

  for (const id of demoWorkerIds) {
    const user = await findUserByEmail(admin, `${id}${DEMO_EMAIL_SUFFIX}`);
    if (!user) continue;

    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
    removed += 1;
  }

  return removed;
}

function normalizePhone(value) {
  return String(value || "").trim();
}

function normalizeWhatsapp(phone, whatsapp) {
  const raw = String(whatsapp || phone || "").replace(/\D/g, "");
  if (!raw) return null;
  return raw.startsWith("91") ? raw : `91${raw.slice(-10)}`;
}

function splitPrice(value) {
  const price = Number(value || 0);
  return {
    min: Number.isFinite(price) && price > 0 ? price : 199,
    max: Number.isFinite(price) && price > 0 ? Math.max(price * 3, price + 300) : 999
  };
}

function levelFromRating(rating) {
  if (rating >= 4.85) return "Elite";
  if (rating >= 4.65) return "Gold";
  if (rating >= 4.4) return "Silver";
  return "Bronze";
}

function scoreFromWorker(worker) {
  const ratingScore = Math.round(Number(worker.rating || 4.2) * 18);
  const reviewBonus = Math.min(Number(worker.review_count || 0), 20);
  return Math.max(45, Math.min(99, ratingScore + reviewBonus));
}

function emailForWorker(worker) {
  return `${String(worker.id).replace(/[^a-z0-9-]/gi, "").toLowerCase()}${DEMO_EMAIL_SUFFIX}`;
}

async function ensureAuthUser(admin, worker) {
  const email = emailForWorker(worker);
  const existing = await findUserByEmail(admin, email);
  if (existing) return existing;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: `MistriHub-${worker.id}-2026`,
    email_confirm: true,
    user_metadata: {
      full_name: worker.name,
      role: "worker"
    }
  });

  if (error) throw error;
  return data.user;
}

async function migrateWorker(admin, worker) {
  const user = await ensureAuthUser(admin, worker);
  const price = splitPrice(worker.starting_price);
  const score = scoreFromWorker(worker);
  const city = worker.city || String(worker.location || "").split(",").at(-1)?.trim() || null;
  const area = String(worker.location || "").split(",")[0]?.trim() || null;

  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id,
    role: "worker",
    full_name: worker.name,
    phone: normalizePhone(worker.phone),
    whatsapp: normalizeWhatsapp(worker.phone, worker.whatsapp),
    avatar_url: worker.profile_photo || null,
    city,
    area,
    referral_code: String(worker.id).replace(/[^a-z0-9]/gi, "").slice(0, 12).toUpperCase()
  }, { onConflict: "id" });
  if (profileError) throw profileError;

  const { error: trustError } = await admin.from("trust_scores").upsert({
    profile_id: user.id,
    score,
    phone_verified: Boolean(worker.phone),
    id_verified: score >= 85,
    jobs_completed: Math.max(0, Number(worker.review_count || 0) * 4),
    reviews_count: Math.max(0, Number(worker.review_count || 0)),
    avg_response_minutes: score >= 90 ? 7 : 15
  }, { onConflict: "profile_id" });
  if (trustError) throw trustError;

  const { error: workerError } = await admin.from("worker_profiles").upsert({
    profile_id: user.id,
    skill: worker.category || "Local Service",
    experience_years: Number(worker.experience_years || 0),
    price_min: price.min,
    price_max: price.max,
    location: worker.location || city || "Nearby",
    distance_label: "Nearby",
    bio: worker.bio || worker.short_description || "Verified local worker on MistriHub.",
    level: levelFromRating(Number(worker.rating || 4.2)),
    availability: worker.available_today ? "Available Now" : "Busy Today",
    verification_status: score >= 85 ? "verified" : "pending"
  }, { onConflict: "profile_id" });
  if (workerError) throw workerError;
}

const currentEnv = loadEnv(path.join(process.cwd(), ".env.local"));
const oldEnv = loadEnv(OLD_ENV_PATH);
const currentAdmin = makeClient(currentEnv, "current", true);
const oldClient = makeClient(oldEnv, "old");

const { data: oldWorkers, error: oldError } = await oldClient
  .from("workers")
  .select("*")
  .order("rating", { ascending: false });

if (oldError) throw oldError;
if (!oldWorkers?.length) throw new Error("No old workers found in E:/mistrihub Supabase workers table.");

const removed = await cleanupDemoWorkers(currentAdmin);
console.log(`Removed ${removed} seeded demo workers from current Supabase.`);

let migrated = 0;
for (const worker of oldWorkers) {
  await migrateWorker(currentAdmin, worker);
  migrated += 1;
  console.log(`Migrated ${migrated}/${oldWorkers.length}: ${worker.name}`);
}

console.log(`Done. ${migrated} old MistriHub workers moved into current MistriHub Market Supabase.`);
