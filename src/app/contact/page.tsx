import { CheckCircle2, MessageCircle } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Card, PageHeader, PageShell, Section } from "@/components/ui";

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
        <PageHeader
          eyebrow="Enrolment support"
          title="Submit an enrolment request"
          description="No payment is required at this stage. Submit the form and our academic team will contact you with course, batch, payment, and account setup details."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#enrolment-form">Start Form</ButtonLink>
            <ButtonLink href="https://wa.me/8801700000000" variant="whatsapp">
              Chat on WhatsApp
            </ButtonLink>
          </div>
        </PageHeader>

        <Section title="How enrolment works">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="grid gap-4">
              <Card>
                <h2 className="text-2xl font-semibold">Start with a conversation</h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  The GRADE team will help you choose the right programme, version support,
                  learning mode, batch timing, and payment method before account access is set up.
                </p>
              </Card>
              <Card>
                <h3 className="text-xl font-semibold">What you can expect</h3>
                <div className="mt-5 grid gap-3">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3 text-sm font-semibold">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="bg-[#eef5e8]">
                <MessageCircle className="mb-3 size-6 text-primary" />
                <h3 className="text-xl font-semibold">Prefer direct help?</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Chat with the team on WhatsApp after submitting the form.
                </p>
              </Card>
            </div>
            <div id="enrolment-form">
              <LeadForm />
            </div>
          </div>
        </Section>
      </PageShell>
      <SiteFooter />
    </>
  );
}
