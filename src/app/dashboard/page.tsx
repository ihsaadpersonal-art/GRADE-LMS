import { redirect } from "next/navigation";
import { getCurrentProfile, roleHome } from "@/lib/auth";

export default async function DashboardIndex() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/dashboard/student");
  }

  redirect(roleHome[profile.role] ?? "/dashboard/student");
}
