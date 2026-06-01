import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
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

const env = loadEnv();
const credentials = fs.readFileSync("private-worker-logins.txt", "utf8");
const email = credentials.match(/Email: (.+)/)?.[1]?.trim();
const password = credentials.match(/Password: (.+)/)?.[1]?.trim();

if (!email || !password) throw new Error("No worker credentials found in private-worker-logins.txt");

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

if (error) throw error;

console.log(JSON.stringify({ loginOk: Boolean(data.user), email: data.user?.email, role: data.user?.user_metadata?.role }, null, 2));
await supabase.auth.signOut();
