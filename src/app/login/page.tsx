import { Suspense } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Card, Container, PageShell } from "@/components/ui";
import { cn } from "@/lib/utils";
import { LoginForm } from "./login-form";

type LoginRoleContext = "student" | "parent" | "teacher" | "team";

const loginContexts: Record<
  LoginRoleContext,
  {
    label: string;
    headline: string;
    intro: string;
  }
> = {
  student: {
    label: "Student",
    headline: "Welcome back, Champ",
    intro: "Access your lessons, Daily Task Units, quizzes, GScore, feedback, and progress dashboard.",
  },
  parent: {
    label: "Parent",
    headline: "Welcome, Guardian",
    intro: "Review your child's progress, GScore updates, reports, and academic feedback.",
  },
  teacher: {
    label: "Teacher",
    headline: "Welcome, Teacher",
    intro: "Review student work, track submissions, support recovery, and guide academic progress.",
  },
  team: {
    label: "GRADE Team",
    headline: "Welcome, GRADE Team",
    intro: "Manage leads, enrolments, students, payments, reviews, and academic operations.",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string | string[]; next?: string | string[] }>;
}) {
  const query = await searchParams;
  const selectedRole = getLoginRoleContext(query.role);
  const context = loginContexts[selectedRole];
  const nextPath = getSingleParam(query.next);

  return (
    <>
      <SiteHeader />
      <PageShell>
        <Container className="grid min-h-[74vh] place-items-center pt-24 pb-14 sm:pt-28">
          <Card className="w-full max-w-lg p-7">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <LogIn className="size-7" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              GRADE LMS
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{context.headline}</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {context.intro}
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-background p-2">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Login context
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(loginContexts) as LoginRoleContext[]).map((role) => {
                  const isSelected = role === selectedRole;

                  return (
                    <Link
                      className={cn(
                        "inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-center text-sm font-semibold transition",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(21,95,67,0.18)]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      href={getLoginContextHref(role, nextPath)}
                      key={role}
                    >
                      {loginContexts[role].label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 rounded-xl border border-primary/15 bg-[#edf7ee] px-4 py-3 text-sm leading-6 text-primary">
              Access is verified from your registered GRADE role after login.
            </p>
            <Suspense fallback={<div className="mt-7 h-44 rounded-2xl bg-muted" />}>
              <LoginForm />
            </Suspense>
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Preview
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3">
              <ButtonLink href="/dashboard/student">Student Dashboard Preview</ButtonLink>
              <ButtonLink href="/dashboard/admin" variant="secondary">
                Admin Dashboard Preview
              </ButtonLink>
              <ButtonLink href="/dashboard/teacher" variant="secondary">
                Teacher Dashboard Preview
              </ButtonLink>
            </div>
          </Card>
        </Container>
      </PageShell>
      <SiteFooter />
    </>
  );
}

function getLoginRoleContext(value?: string | string[]): LoginRoleContext {
  const role = getSingleParam(value);

  if (role === "parent" || role === "teacher" || role === "team") {
    return role;
  }

  return "student";
}

function getSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getLoginContextHref(role: LoginRoleContext, nextPath?: string) {
  const params = new URLSearchParams({ role });

  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    params.set("next", nextPath);
  }

  return `/login?${params.toString()}`;
}
