import { redirect } from "next/navigation";
import type { Role } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const roleHome: Record<Role, string> = {
  student: "/dashboard/student",
  parent: "/dashboard/parent",
  teacher: "/dashboard/teacher",
  admin: "/dashboard/admin",
  super_admin: "/dashboard/admin",
};

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function requireRole(allowed: Role[]) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!allowed.includes(profile.role)) {
    redirect(roleHome[profile.role]);
  }

  return profile;
}
