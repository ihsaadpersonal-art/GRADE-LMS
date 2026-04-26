"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getSafeRedirectPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      if (mode === "reset") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/account/setup`,
        });

        if (resetError) {
          setError(resetError.message);
          return;
        }

        setSuccess("If this email has an account, a password reset link has been sent.");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace(getSafeRedirectPath(searchParams.get("next")));
      router.refresh();
    } catch {
      setError(
        mode === "reset"
          ? "Password reset is not available right now. Please check the Supabase setup."
          : "Login is not available right now. Please check the Supabase setup.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function switchMode(nextMode: "login" | "reset") {
    setMode(nextMode);
    setError(null);
    setSuccess(null);
    setPassword("");
  }

  return (
    <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="email">
          Email address
        </label>
        <input
          autoComplete="email"
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
          disabled={isLoading}
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="student@example.com"
          required
          type="email"
          value={email}
        />
      </div>
      {mode === "login" ? (
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
            disabled={isLoading}
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
          <button
            className="justify-self-start text-sm font-semibold text-primary hover:text-[#104d36]"
            disabled={isLoading}
            onClick={() => switchMode("reset")}
            type="button"
          >
            Forgot password?
          </button>
        </div>
      ) : (
        <p className="rounded-xl border border-border bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
          Enter your account email. We will send a secure password reset link if the account exists.
        </p>
      )}
      {error ? (
        <p className="rounded-xl border border-danger/20 bg-[#fff6f6] px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-xl border border-primary/20 bg-[#edf7ee] px-4 py-3 text-sm font-medium text-primary">
          {success}
        </p>
      ) : null}
      <button
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_14px_32px_rgba(21,95,67,0.22)] transition hover:bg-[#104d36] focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (mode === "reset" ? "Sending reset link..." : "Logging in...") : mode === "reset" ? "Send Reset Link" : "Log In"}
      </button>
      {mode === "reset" ? (
        <button
          className="text-sm font-semibold text-primary hover:text-[#104d36]"
          disabled={isLoading}
          onClick={() => switchMode("login")}
          type="button"
        >
          Back to login
        </button>
      ) : null}
    </form>
  );
}
