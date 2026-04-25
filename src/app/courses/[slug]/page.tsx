import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Card, Container, PageShell, Section, StatusBadge } from "@/components/ui";
import { courses } from "@/lib/sample-data";
import { formatBDT } from "@/lib/utils";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export default async function CourseLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  const isBridge = course.courseType === "bridge";

  return (
    <>
      <SiteHeader />
      <PageShell>
        <section className="border-b border-border bg-[#edf3e8] pt-20 pb-12 sm:pt-24 sm:pb-16">
          <Container className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <StatusBadge tone="success">{course.targetBatch}</StatusBadge>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                {course.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#enrol">Enrolment form</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Chat on WhatsApp
                </ButtonLink>
              </div>
            </div>
            <Card>
              <p className="text-sm font-medium text-muted-foreground">Package</p>
              <p className="mt-2 text-3xl font-semibold">{formatBDT(course.price)}</p>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <p>{course.durationWeeks} weeks</p>
                <p>{course.versionSupport} version support</p>
                <p className="capitalize">{course.mode} learning</p>
              </div>
            </Card>
          </Container>
        </section>

        <Section
          title={isBridge ? "Who This Course Is For" : "Why HSC 26 Needs Urgent Revision"}
          eyebrow="Fit"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {(isBridge
              ? ["SSC 2026 examinees", "Future HSC 2028 Science students", "Bangla Version and English Version learners"]
              : ["HSC 2026 students", "Students needing final board-style practice", "Students with gaps who need teacher follow-up"]
            ).map((item) => (
              <Card key={item}>
                <p className="font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="What Students Will Learn" className="bg-card">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {course.highlights.map((item) => (
              <Card key={item}>
                <p className="font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Weekly Structure">
          <div className="grid gap-4">
            {course.weeklyStructure.map((item, index) => (
              <Card key={item} className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-1 font-medium">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Study Materials Included" className="bg-[#f2f5ef]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {course.materials.map((item) => (
              <Card key={item}>
                <p className="font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="LMS, GScore, Parent Reporting">
          <div className="grid gap-4 md:grid-cols-3">
            {["Lesson gates and progress", "Daily Task Unit submission", "WhatsApp-ready parent report"].map((item) => (
              <Card key={item}>
                <p className="font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Enrolment Form" eyebrow="Start here" className="bg-card">
          <div id="enrol" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-base leading-7 text-muted-foreground">
                Submit the form. Admin will contact the parent or student, collect manual payment
                by bKash, Nagad, bank, or cash, verify payment, then activate LMS access.
              </p>
            </div>
            <LeadForm programme={course.title} />
          </div>
        </Section>
      </PageShell>
      <SiteFooter />
    </>
  );
}
