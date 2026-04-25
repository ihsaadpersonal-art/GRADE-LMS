import { ClipboardCheck, Download, FileQuestion, FileText } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Card, PageHeader, PageShell, Section, StatusBadge } from "@/components/ui";

const resources = [
  {
    title: "Post-SSC Starter Kit",
    label: "PDF",
    description: "A simple guide to help SSC students start HSC preparation with clarity.",
    icon: FileText,
  },
  {
    title: "HSC Science Roadmap",
    label: "PDF",
    description: "Understand what to study first and how to plan your HSC Science journey.",
    icon: Download,
  },
  {
    title: "Diagnostic Quiz",
    label: "Quiz",
    description: "Check your current preparation level before starting.",
    icon: FileQuestion,
  },
  {
    title: "Free Parent Orientation",
    label: "Webinar",
    description: "Join a free orientation session for students and parents.",
    icon: ClipboardCheck,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHeader
          eyebrow="Free learning resources"
          title="A small resource library for better study decisions"
          description="Download starter guides, try a diagnostic quiz, or register for a parent orientation before choosing a course."
        />

        <Section
          title="Choose a free resource"
          description="Each resource is designed to help families understand the next step with less confusion."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.title} className="flex min-h-80 flex-col">
                  <div className="mb-5 rounded-2xl bg-[#eef5e8] p-5">
                    <Icon className="size-8 text-primary" aria-hidden="true" />
                  </div>
                  <StatusBadge tone="neutral">{resource.label}</StatusBadge>
                  <h3 className="mt-4 text-xl font-semibold leading-tight">{resource.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                  <p className="mt-4 text-sm font-semibold text-primary">
                    Register to receive this free resource.
                  </p>
                  <div className="mt-auto pt-5">
                    <ButtonLink href="#resource-form" variant="secondary">
                      Get Resource
                    </ButtonLink>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section
          title="Register to receive the resource"
          description="Share a few details so the team can send the right guide, quiz, or orientation link."
          className="bg-card"
        >
          <div id="resource-form">
            <LeadForm programme="Post-SSC Starter Kit" />
          </div>
        </Section>
      </PageShell>
      <SiteFooter />
    </>
  );
}
