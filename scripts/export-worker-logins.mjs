import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    if (!fs.existsSync(file)) continue;

    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const value = line.trim();
      if (!value || value.startsWith("#") || !value.includes("=")) continue;

      const index = value.indexOf("=");
      env[value.slice(0, index).trim()] = value
        .slice(index + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
    }
  }
  return env;
}

async function listAllUsers(admin) {
  const users = [];
  let page = 1;

  while (page < 50) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;

    users.push(...data.users);
    if (data.users.length < 100) break;
    page += 1;
  }

  return users;
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

const { data: workers, error } = await admin
  .from("worker_profiles")
  .select("profile_id, skill, profiles(full_name)")
  .order("created_at", { ascending: false });

if (error) throw error;

const users = await listAllUsers(admin);
const byId = new Map(users.map((user) => [user.id, user]));
const lines = [
  "MistriHub Market worker login credentials",
  "Keep this file private. Do NOT upload to GitHub.",
  "",
  "URL: https://mistrihub.in/login",
  ""
];

for (const worker of workers ?? []) {
  const user = byId.get(worker.profile_id);
  if (!user?.email?.endsWith("@mistrihub.local")) continue;

  const idPart = user.email.replace("@mistrihub.local", "");
  const password = `MistriHub-${idPart}-2026`;
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    user_metadata: {
      full_name: worker.profiles?.full_name ?? "Worker",
      role: "worker"
    }
  });

  if (updateError) throw updateError;

  lines.push(`Name: ${worker.profiles?.full_name ?? "Worker"}`);
  lines.push(`Skill: ${worker.skill}`);
  lines.push(`Email: ${user.email}`);
  lines.push(`Password: ${password}`);
  lines.push("");
}

fs.writeFileSync("private-worker-logins.txt", lines.join("\n"));
console.log(`Exported ${Math.max(0, (lines.length - 5) / 5)} worker logins to private-worker-logins.txt`);
