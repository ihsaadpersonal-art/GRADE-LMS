import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  Gauge,
  Home,
  ListChecks,
  Trophy,
  Users,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { Container } from "@/components/ui";

const nav = {
  student: [
    { href: "/dashboard/student", label: "Home", icon: Home },
    { href: "/dashboard/student/progress", label: "Progress", icon: Gauge },
    { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: BarChart3 },
    { href: "/dashboard/admin/leads", label: "Leads", icon: Users },
    { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/admin/reports", label: "Reports", icon: FileText },
    { href: "/dashboard/admin/at-risk", label: "At-Risk", icon: ListChecks },
  ],
  teacher: [
    { href: "/dashboard/teacher", label: "Teacher Home", icon: Home },
    { href: "/dashboard/teacher#reviews", label: "Reviews", icon: ClipboardCheck },
    { href: "/dashboard/teacher#quizzes", label: "Quizzes", icon: BookOpen },
  ],
  parent: [
    { href: "/dashboard/parent", label: "Report", icon: FileText },
    { href: "/dashboard/parent#progress", label: "Progress", icon: Gauge },
  ],
};

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: keyof typeof nav;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f5ed]">
      <header className="border-b border-border bg-card/95 shadow-[0_8px_28px_rgba(32,48,37,0.06)] backdrop-blur">
        <Container className="flex min-h-20 flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              GRADE LMS
            </p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight">{title}</h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-primary hover:bg-muted"
            >
              Public site
            </Link>
            <LogoutButton />
          </div>
        </Container>
      </header>
      <Container className="grid gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="grid gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_18px_45px_rgba(32,48,37,0.06)]">
            {nav[role].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </Container>
    </div>
  );
}
