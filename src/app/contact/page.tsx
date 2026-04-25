import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, Container, PageShell, Section } from "@/components/ui";

const trustPoints = [
  "Online, offline, and hybrid options",
  "Bangla Version and English Version support",
  "Parent progress updates",
  "Manual enrolment support",
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <section className="border-b border-border bg-[#edf3e8] pt-20 pb-12 sm:pt-24">
          <Container>
            <h1 className="text-4xl font-semibold">Contact and Enrolment Help</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Share student and parent details. The GRADE team will contact you for the
              right course, batch, payment, and account setup.
            </p>
          </Container>
        </section>
        <Section title="Enrolment Request">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <h2 className="text-xl font-semibold">Start with a conversation</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                No payment is required at this stage. Submit the form and our academic team
                will contact you with course, batch, payment, and account setup details.
              </p>
              <div className="mt-5 grid gap-3">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm font-medium">
                    <span className="mt-2 size-2 rounded-full bg-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </Card>
            <LeadForm />
          </div>
        </Section>
      </PageShell>
      <SiteFooter />
    </>
  );
}
