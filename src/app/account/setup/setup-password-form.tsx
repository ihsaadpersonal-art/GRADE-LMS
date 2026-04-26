"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SetupPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Account setup is not available right now. Please check the Supabase setup.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="password">
          New password
        </label>
        <input
          autoComplete="new-password"
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
          disabled={isLoading}
          id="password"
          minLength={8}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          required
          type="password"
          value={password}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="confirm-password">
          Confirm password
        </label>
        <input
          autoComplete="new-password"
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
          disabled={isLoading}
          id="confirm-password"
          minLength={8}
          name="confirmPassword"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
          required
          type="password"
          value={confirmPassword}
        />
      </div>
      {error ? (
        <p className="rounded-xl border border-danger/20 bg-[#fff6f6] px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <button
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_14px_32px_rgba(21,95,67,0.22)] transition hover:bg-[#104d36] focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? "Setting password..." : "Set Password"}
      </button>
    </form>
  );
}
