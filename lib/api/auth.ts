import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AppRole } from "@/lib/supabase/database.types";

export async function getApiUser(request?: Request) {
  try {
    const token = request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();

    if (token) {
      const admin = createAdminClient();
      const { data: authData, error } = await admin.auth.getUser(token);

      if (error || !authData.user) {
        return { supabase: admin, user: null, profile: null, setupError: null };
      }

      const { data: profile } = await admin
        .from("profiles")
        .select("id, role, full_name")
        .eq("id", authData.user.id)
        .single();

      if (profile) {
        return { supabase: admin, user: authData.user, profile, setupError: null };
      }

      const createdProfile = await ensureProfile(authData.user);
      return { supabase: admin, user: authData.user, profile: createdProfile, setupError: null };
    }

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

    if (profile) {
      return { supabase, user: authData.user, profile, setupError: null };
    }

    const createdProfile = await ensureProfile(authData.user);

    return { supabase, user: authData.user, profile: createdProfile, setupError: null };
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
