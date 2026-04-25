"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-primary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isSigningOut}
      onClick={handleLogout}
      type="button"
    >
      <LogOut className="size-4" aria-hidden="true" />
      {isSigningOut ? "Signing out..." : "Log out"}
    </button>
  );
}
