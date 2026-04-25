import { LogIn } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Card, Container, PageShell } from "@/components/ui";

export default function LoginPage() {
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
            <h1 className="mt-2 text-3xl font-semibold">Student Login</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Log in to access your lessons, daily tasks, quizzes, progress dashboard, and
              GScore report.
            </p>
            <div className="mt-7 grid gap-3">
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
