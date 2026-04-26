import { KeyRound } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, Container, PageShell } from "@/components/ui";
import { SetupPasswordForm } from "./setup-password-form";

export default function AccountSetupPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <Container className="grid min-h-[74vh] place-items-center pt-24 pb-14 sm:pt-28">
          <Card className="w-full max-w-lg p-7">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <KeyRound className="size-7" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
              GRADE LMS
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Set up your account</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Create a password for your invited student account. You will use this password
              to access your lessons, Daily Task Units, quizzes, progress dashboard, and
              GScore report later.
            </p>
            <SetupPasswordForm />
          </Card>
        </Container>
      </PageShell>
      <SiteFooter />
    </>
  );
}
