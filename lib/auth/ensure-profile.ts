import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AppRole, Database } from "@/lib/supabase/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const validRoles: AppRole[] = ["user", "worker", "admin"];

function normalizeRole(value: unknown): AppRole {
  return validRoles.includes(value as AppRole) ? (value as AppRole) : "user";
}

function fallbackName(user: User, fullName?: string) {
  return fullName?.trim() || String(user.user_metadata?.full_name ?? "").trim() || user.email || "MistriHub User";
}

export async function ensureProfile(user: User, input?: { fullName?: string; role?: AppRole; phone?: string; whatsapp?: string; city?: string; area?: string }) {
  const admin = createAdminClient();
  const role = normalizeRole(input?.role ?? user.user_metadata?.role);

  const payload = {
    id: user.id,
    full_name: fallbackName(user, input?.fullName),
    role,
    phone: input?.phone ?? null,
    whatsapp: input?.whatsapp ?? null,
    city: input?.city ?? null,
    area: input?.area ?? null,
    referral_code: user.id.replaceAll("-", "").slice(0, 8).toUpperCase()
  };

  const { data, error } = await admin
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: trustError } = await admin
    .from("trust_scores")
    .upsert({ profile_id: user.id }, { onConflict: "profile_id" });

  if (trustError) {
    throw new Error(trustError.message);
  }

  return data as ProfileRow;
}
