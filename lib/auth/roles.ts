import type { AppRole } from "@/lib/supabase/database.types";

export const ROLE_HOME: Record<AppRole, string> = {
  user: "/dashboard",
  worker: "/dashboard",
  admin: "/admin"
};

export const PROTECTED_ROUTES = ["/dashboard", "/post-job", "/post-product"];
export const WORKER_ROUTES = ["/dashboard"];
export const ADMIN_ROUTES = ["/admin"];

export function hasRouteAccess(pathname: string, role?: AppRole | null) {
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    return role === "admin";
  }

  if (WORKER_ROUTES.some((route) => pathname.startsWith(route))) {
    return role === "worker" || role === "admin" || role === "user";
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return Boolean(role);
  }

  return true;
}
