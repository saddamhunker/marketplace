import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/supabase/database.types";

export type CurrentUser = {
  id: string;
  email?: string;
  role: AppRole;
  fullName: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", authData.user.id)
    .single();

  if (!profile) {
    return {
      id: authData.user.id,
      email: authData.user.email,
      role: "user",
      fullName: authData.user.email ?? "MistriHub User"
    };
  }

  return {
    id: profile.id,
    email: authData.user.email,
    role: profile.role,
    fullName: profile.full_name
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(roles: AppRole[]) {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }

  return user;
}
