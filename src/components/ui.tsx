import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-primary/15",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-[0_14px_32px_rgba(21,95,67,0.22)] hover:bg-[#104d36]",
        variant === "secondary" &&
          "border border-border bg-card text-foreground shadow-sm hover:border-primary/40 hover:bg-muted",
        variant === "ghost" && "text-primary hover:bg-muted",
        variant === "whatsapp" &&
          "border border-primary/20 bg-[#e7f4e7] text-primary shadow-sm hover:bg-[#dceedd]",
      )}
    >
      {variant === "whatsapp" ? <MessageCircle className="size-4" aria-hidden="true" /> : null}
      {children}
      {variant !== "ghost" && variant !== "whatsapp" ? (
        <ArrowRight className="size-4" aria-hidden="true" />
      ) : null}
    </Link>
  );
}

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("flex-1 overflow-hidden", className)}>{children}</main>;
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  children,
  className,
  description,
  align,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <Container>
        <div
          className={cn(
            "mb-9 max-w-3xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[0_18px_45px_rgba(32,48,37,0.06)]",
        className,
      )}
    >
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
        tone === "accent" && "border-accent/40 bg-[#fff9eb]",
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
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
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

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative border-b border-border bg-[#eef5e8] pt-24 pb-14 sm:pt-28 sm:pb-16",
        className,
      )}
    >
      <div className="absolute inset-0 soft-grid opacity-60" aria-hidden="true" />
      <Container className="relative">
        <div className="max-w-4xl">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}

export function CTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="rounded-3xl border border-primary/15 bg-primary px-6 py-10 text-primary-foreground shadow-[0_22px_60px_rgba(21,95,67,0.24)] sm:px-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href={primaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-card px-5 py-3 text-sm font-semibold text-primary shadow-sm hover:bg-[#f4f7ef]"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary-foreground/25 px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-white/10"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function StatCard({
  label,
  detail,
  icon,
}: {
  label: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="flex min-h-28 items-start gap-4 p-4">
      {icon ? (
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-primary">
          {icon}
        </span>
      ) : null}
      <div>
        <p className="font-semibold leading-6">{label}</p>
        {detail ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p> : null}
      </div>
    </Card>
  );
}

export const featureIcons = {
  lessons: BookOpen,
  tasks: CheckCircle2,
  score: ShieldCheck,
  time: Clock,
};
