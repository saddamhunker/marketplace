import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/supabase/database.types";

export async function getApiUser() {
  try {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.getUser();

    if (error || !authData.user) {
      return { supabase, user: null, profile: null, setupError: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", authData.user.id)
      .single();

    return { supabase, user: authData.user, profile, setupError: null };
  } catch (error) {
    return {
      supabase: null,
      user: null,
      profile: null,
      setupError: error instanceof Error ? error.message : "Supabase is not configured"
    };
  }
}

export async function requireApiRole(roles: AppRole[]) {
  const context = await getApiUser();

  if (!context.user || !context.profile) {
    return { ...context, allowed: false as const, reason: "unauthorized" as const };
  }

  if (!roles.includes(context.profile.role)) {
    return { ...context, allowed: false as const, reason: "forbidden" as const };
  }

  return { ...context, allowed: true as const };
}
