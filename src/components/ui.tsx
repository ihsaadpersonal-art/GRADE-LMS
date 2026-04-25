import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-sm hover:bg-[#164d3a]",
        variant === "secondary" &&
          "border border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted",
        variant === "ghost" && "text-primary hover:bg-muted",
      )}
    >
      {children}
      {variant !== "ghost" ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
    </Link>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="flex-1">{children}</main>;
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-12 sm:py-16", className)}>
      <Container>
        <div className="mb-8 max-w-3xl">
          {eyebrow ? (
            <p className="mb-2 text-sm font-semibold uppercase text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </Container>
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "default" | "accent" | "danger";
}) {
  return (
    <Card
      className={cn(
        "min-h-32",
        tone === "accent" && "border-accent/40 bg-[#fffaf0]",
        tone === "danger" && "border-danger/30 bg-[#fff6f6]",
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      {detail ? <p className="mt-2 text-sm text-muted-foreground">{detail}</p> : null}
    </Card>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "success" && "bg-[#e4f3e8] text-[#1d6c3b]",
        tone === "warning" && "bg-[#fff3d6] text-[#876010]",
        tone === "danger" && "bg-[#ffe2e2] text-danger",
      )}
    >
      {children}
    </span>
  );
}

export const featureIcons = {
  lessons: BookOpen,
  tasks: CheckCircle2,
  score: ShieldCheck,
  time: Clock,
};
