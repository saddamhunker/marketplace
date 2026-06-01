import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const workers = [
  { id: "rajesh-electrician", name: "Rajesh Kumar", skill: "Electrician", location: "Lajpat Nagar, Delhi", distance: "1.8 km", experience: 9, priceMin: 250, priceMax: 600, phone: "+91 98765 10101", whatsapp: "919876510101", trustScore: 96, jobsCompleted: 628, responseMinutes: 4, availability: "Available Now", level: "Elite", about: "Switch boards, inverter wiring, MCB repair, and emergency night calls with clean finishing." },
  { id: "imran-plumber", name: "Imran Ansari", skill: "Plumber", location: "Indiranagar, Bengaluru", distance: "2.2 km", experience: 7, priceMin: 199, priceMax: 700, phone: "+91 98765 10102", whatsapp: "919876510102", trustScore: 93, jobsCompleted: 511, responseMinutes: 6, availability: "Available Now", level: "Gold", about: "Leak repair, tap fitting, motor setup, bathroom line checks, and same-day service." },
  { id: "sunita-painter", name: "Sunita Sharma", skill: "Painter", location: "Kothrud, Pune", distance: "3.0 km", experience: 11, priceMin: 8, priceMax: 22, phone: "+91 98765 10103", whatsapp: "919876510103", trustScore: 98, jobsCompleted: 742, responseMinutes: 8, availability: "Busy Today", level: "Elite", about: "Texture walls, waterproof coating, rental repainting, and color consultation." },
  { id: "ravi-mechanic", name: "Ravi Verma", skill: "Bike Mechanic", location: "Gomti Nagar, Lucknow", distance: "1.1 km", experience: 6, priceMin: 150, priceMax: 1200, phone: "+91 98765 10104", whatsapp: "919876510104", trustScore: 89, jobsCompleted: 386, responseMinutes: 5, availability: "Available Now", level: "Gold", about: "Doorstep bike repair, battery jump, puncture, oil change, and pickup support." },
  { id: "balram-labour", name: "Balram Yadav", skill: "Labour Contractor", location: "Patna City, Patna", distance: "4.6 km", experience: 12, priceMin: 600, priceMax: 900, phone: "+91 98765 10105", whatsapp: "919876510105", trustScore: 86, jobsCompleted: 332, responseMinutes: 12, availability: "Available Now", level: "Silver", about: "Daily wage labour team for shifting, construction, loading, and urgent site work." },
  { id: "arif-ac", name: "Arif Khan", skill: "AC Technician", location: "Andheri West, Mumbai", distance: "2.9 km", experience: 8, priceMin: 399, priceMax: 1800, phone: "+91 98765 10106", whatsapp: "919876510106", trustScore: 94, jobsCompleted: 557, responseMinutes: 7, availability: "Available Now", level: "Gold", about: "AC service, gas refill, deep cleaning, installation, and annual maintenance." },
  { id: "meena-tailor", name: "Meena Devi", skill: "Tailor", location: "Vaishali, Jaipur", distance: "2.7 km", experience: 10, priceMin: 120, priceMax: 950, phone: "+91 98765 10107", whatsapp: "919876510107", trustScore: 91, jobsCompleted: 408, responseMinutes: 14, availability: "Busy Today", level: "Gold", about: "Blouse fitting, alterations, school uniforms, and urgent festival orders." },
  { id: "manoj-carpenter", name: "Manoj Tiwari", skill: "Carpenter", location: "Salt Lake, Kolkata", distance: "3.4 km", experience: 13, priceMin: 350, priceMax: 2500, phone: "+91 98765 10108", whatsapp: "919876510108", trustScore: 92, jobsCompleted: 489, responseMinutes: 10, availability: "Available Now", level: "Gold", about: "Modular repair, shelves, doors, polish, and small furniture builds." },
  { id: "pooja-cleaning", name: "Pooja Rani", skill: "Home Cleaning", location: "Sector 62, Noida", distance: "1.5 km", experience: 5, priceMin: 499, priceMax: 2500, phone: "+91 98765 10109", whatsapp: "919876510109", trustScore: 95, jobsCompleted: 602, responseMinutes: 9, availability: "Available Now", level: "Elite", about: "Bathroom, kitchen, sofa, and full home cleaning with verified helpers." },
  { id: "ganesh-driver", name: "Ganesh Pawar", skill: "Driver", location: "Hadapsar, Pune", distance: "5.2 km", experience: 14, priceMin: 800, priceMax: 2200, phone: "+91 98765 10110", whatsapp: "919876510110", trustScore: 84, jobsCompleted: 280, responseMinutes: 18, availability: "Offline", level: "Silver", about: "City, outstation, wedding duty, and monthly driver service." },
  { id: "naseem-mobile", name: "Naseem Ali", skill: "Mobile Repair", location: "Charminar, Hyderabad", distance: "0.9 km", experience: 7, priceMin: 199, priceMax: 4500, phone: "+91 98765 10111", whatsapp: "919876510111", trustScore: 90, jobsCompleted: 456, responseMinutes: 6, availability: "Available Now", level: "Gold", about: "Screen, battery, charging port, software, and data transfer help." },
  { id: "kavita-cook", name: "Kavita Solanki", skill: "Cook", location: "Satellite, Ahmedabad", distance: "2.4 km", experience: 9, priceMin: 2500, priceMax: 8500, phone: "+91 98765 10112", whatsapp: "919876510112", trustScore: 88, jobsCompleted: 319, responseMinutes: 16, availability: "Busy Today", level: "Silver", about: "Gujarati, Punjabi, Jain, tiffin prep, and party cooking." },
  { id: "prakash-camera", name: "Prakash Sahu", skill: "CCTV Installer", location: "Raipur Junction, Raipur", distance: "3.8 km", experience: 6, priceMin: 499, priceMax: 9000, phone: "+91 98765 10113", whatsapp: "919876510113", trustScore: 85, jobsCompleted: 244, responseMinutes: 20, availability: "Available Now", level: "Silver", about: "CCTV setup, DVR repair, Wi-Fi cameras, and shop security packages." },
  { id: "jaspreet-welder", name: "Jaspreet Singh", skill: "Welder", location: "Model Town, Ludhiana", distance: "4.1 km", experience: 16, priceMin: 500, priceMax: 6000, phone: "+91 98765 10114", whatsapp: "919876510114", trustScore: 82, jobsCompleted: 231, responseMinutes: 22, availability: "Available Now", level: "Bronze", about: "Gate, grill, shutter, railing, and on-site welding jobs." },
  { id: "shahid-fridge", name: "Shahid Qureshi", skill: "Fridge Repair", location: "Bhopal New Market", distance: "2.1 km", experience: 8, priceMin: 299, priceMax: 2500, phone: "+91 98765 10115", whatsapp: "919876510115", trustScore: 87, jobsCompleted: 297, responseMinutes: 11, availability: "Available Now", level: "Silver", about: "Cooling issue, compressor check, gas refill, and same-day diagnosis." },
  { id: "deepa-beauty", name: "Deepa Nair", skill: "Beauty Service", location: "Kakkanad, Kochi", distance: "1.7 km", experience: 6, priceMin: 299, priceMax: 3500, phone: "+91 98765 10116", whatsapp: "919876510116", trustScore: 92, jobsCompleted: 371, responseMinutes: 8, availability: "Busy Today", level: "Gold", about: "At-home grooming, bridal trial, facial, waxing, and party makeup." },
  { id: "vivek-pest", name: "Vivek Maurya", skill: "Pest Control", location: "Rohini, Delhi", distance: "3.2 km", experience: 5, priceMin: 799, priceMax: 4500, phone: "+91 98765 10117", whatsapp: "919876510117", trustScore: 83, jobsCompleted: 220, responseMinutes: 15, availability: "Available Now", level: "Bronze", about: "Cockroach, termite, bed bug, and home sanitization service." },
  { id: "omkar-tutor", name: "Omkar Kulkarni", skill: "Home Tutor", location: "Nashik Road, Nashik", distance: "2.5 km", experience: 4, priceMin: 350, priceMax: 900, phone: "+91 98765 10118", whatsapp: "919876510118", trustScore: 90, jobsCompleted: 188, responseMinutes: 13, availability: "Offline", level: "Gold", about: "Maths and science for classes 6-10 with weekly progress reports." },
  { id: "suresh-shifting", name: "Suresh Patel", skill: "Packers & Movers", location: "Vesu, Surat", distance: "5.8 km", experience: 10, priceMin: 1200, priceMax: 18000, phone: "+91 98765 10119", whatsapp: "919876510119", trustScore: 81, jobsCompleted: 251, responseMinutes: 19, availability: "Available Now", level: "Bronze", about: "Local shifting, loading team, mini truck, and careful packing." },
  { id: "farida-nurse", name: "Farida Sheikh", skill: "Elder Care", location: "Civil Lines, Nagpur", distance: "2.0 km", experience: 9, priceMin: 700, priceMax: 1800, phone: "+91 98765 10120", whatsapp: "919876510120", trustScore: 97, jobsCompleted: 414, responseMinutes: 5, availability: "Available Now", level: "Elite", about: "Elder support, medicine reminders, patient care, and verified home assistance." }
];

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const value = line.trim();
      if (!value || value.startsWith("#") || !value.includes("=")) continue;
      const index = value.indexOf("=");
      env[value.slice(0, index).trim()] = value.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    }
  }
  return env;
}

async function findUserByEmail(admin, email) {
  let page = 1;
  while (page < 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const user = data.users.find((item) => item.email === email);
    if (user) return user;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

async function ensureAuthUser(admin, worker) {
  const email = `${worker.id}@mistrihub.local`;
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

const env = loadEnv();
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

let inserted = 0;
for (const worker of workers) {
  const user = await ensureAuthUser(admin, worker);

  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id,
    role: "worker",
    full_name: worker.name,
    phone: worker.phone,
    whatsapp: worker.whatsapp,
    city: worker.location.split(",").at(-1)?.trim() ?? null,
    area: worker.location.split(",")[0]?.trim() ?? null,
    referral_code: worker.id.replace(/[^a-z0-9]/gi, "").slice(0, 12).toUpperCase()
  }, { onConflict: "id" });
  if (profileError) throw profileError;

  const { error: trustError } = await admin.from("trust_scores").upsert({
    profile_id: user.id,
    score: worker.trustScore,
    phone_verified: true,
    id_verified: worker.trustScore >= 90,
    jobs_completed: worker.jobsCompleted,
    reviews_count: 0,
    avg_response_minutes: worker.responseMinutes
  }, { onConflict: "profile_id" });
  if (trustError) throw trustError;

  const { error: workerError } = await admin.from("worker_profiles").upsert({
    profile_id: user.id,
    skill: worker.skill,
    experience_years: worker.experience,
    price_min: worker.priceMin,
    price_max: worker.priceMax,
    location: worker.location,
    distance_label: worker.distance,
    bio: worker.about,
    level: worker.level,
    availability: worker.availability,
    verification_status: worker.trustScore >= 90 ? "verified" : "pending"
  }, { onConflict: "profile_id" });
  if (workerError) throw workerError;

  inserted += 1;
  console.log(`Seeded ${inserted}/${workers.length}: ${worker.name}`);
}

console.log(`Done. ${inserted} workers merged into Supabase.`);
