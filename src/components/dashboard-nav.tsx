import Link from "next/link";
import { BarChart3, BookOpen, ClipboardCheck, CreditCard, FileText, Gauge, Home, ListChecks, Trophy, Users } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <Container className="flex min-h-16 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">GRADE LMS</p>
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            Public site
          </Link>
        </Container>
      </header>
      <Container className="grid gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="grid gap-2 rounded-lg border border-border bg-card p-2">
            {nav[role].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
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
