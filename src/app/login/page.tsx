import { LogIn } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Card, Container, PageShell } from "@/components/ui";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <Container className="grid min-h-[70vh] place-items-center pt-20 pb-12 sm:pt-24">
          <Card className="w-full max-w-md">
            <LogIn className="mb-4 size-7 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-semibold">Student Login</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Log in to access your lessons, daily tasks, quizzes, progress dashboard, and
              GScore report.
            </p>
            <div className="mt-6 grid gap-3">
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
