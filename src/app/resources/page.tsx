import { ClipboardCheck, Download, FileQuestion, FileText } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, Container, PageShell, Section } from "@/components/ui";

const resources = [
  {
    title: "Post-SSC Starter Kit",
    description: "A simple guide to help SSC students start HSC preparation with clarity.",
    icon: FileText,
  },
  {
    title: "HSC Science Roadmap",
    description: "Understand what to study first and how to plan your HSC Science journey.",
    icon: Download,
  },
  {
    title: "Diagnostic Quiz",
    description: "Check your current preparation level before starting.",
    icon: FileQuestion,
  },
  {
    title: "Free Webinar Registration",
    description: "Join a free orientation session for students and parents.",
    icon: ClipboardCheck,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <section className="border-b border-border bg-[#edf3e8] pt-20 pb-12 sm:pt-24">
          <Container>
            <h1 className="text-4xl font-semibold">Free Resources</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Starter PDFs, the HSC Science roadmap, diagnostic quiz access, and webinar
              registration for SSC and HSC students.
            </p>
          </Container>
        </section>
        <Section title="Available Free Items">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.title}>
                  <Icon className="mb-4 size-6 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                  <p className="mt-4 text-sm font-semibold text-primary">
                    Register to receive this free resource.
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>
        <Section title="Get the Starter Kit" className="bg-card">
          <LeadForm programme="Post-SSC Starter Kit" />
        </Section>
      </PageShell>
      <SiteFooter />
    </>
  );
}
