import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageSquareText,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  ButtonLink,
  Card,
  Container,
  CTASection,
  PageShell,
  Section,
  StatCard,
  StatusBadge,
} from "@/components/ui";
import { ImageOrPlaceholder } from "@/components/visual-media";
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
  const heroImage = isBridge ? "/images/bridge-course-science.jpg" : "/images/hsc-exam-ready.jpg";

  return (
    <>
      <SiteHeader />
      <PageShell>
        <section className="relative border-b border-border bg-[#eef5e8] pt-24 pb-14 sm:pt-28 sm:pb-16">
          <div className="absolute inset-0 soft-grid opacity-60" aria-hidden="true" />
          <Container className="relative grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone="success">{course.targetBatch}</StatusBadge>
                <StatusBadge tone="neutral">{course.durationWeeks} weeks</StatusBadge>
                <StatusBadge tone="neutral">Online / Offline / Hybrid</StatusBadge>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                {course.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#enrol">Enrolment Form</ButtonLink>
                <ButtonLink href="https://wa.me/8801700000000" variant="whatsapp">
                  Chat on WhatsApp
                </ButtonLink>
              </div>
            </div>
            <Card className="overflow-hidden p-0">
              <div className="h-64">
                <ImageOrPlaceholder
                  src={heroImage}
                  alt={`${course.title} visual`}
                  label={course.title}
                  variant="course"
                  priority
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Course package</p>
                <p className="mt-2 text-4xl font-semibold">{formatBDT(course.price)}</p>
                <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" /> {course.durationWeeks} weeks
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="size-4 text-primary" /> Bangla Version & English Version
                  </span>
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="size-4 text-primary" /> DTUs, quizzes, reports
                  </span>
                </div>
              </div>
            </Card>
          </Container>
        </section>

        <Section
          eyebrow="Student fit"
          title="Who this course is for"
          description={
            isBridge
              ? "Designed for students who finished SSC and want to enter HSC Science with a clear foundation."
              : "Designed for HSC 26 students who need a focused final preparation system before board exams."
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {(isBridge
              ? [
                  "SSC 2026 examinees",
                  "Future HSC 2028 Science students",
                  "Bangla Version and English Version learners",
                ]
              : [
                  "HSC 2026 students",
                  "Students needing board-style question practice",
                  "Students who need revision, testing, and recovery support",
                ]
            ).map((item) => (
              <StatCard key={item} label={item} icon={<GraduationCap className="size-5" />} />
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Why now"
          title={isBridge ? "The SSC-to-HSC jump needs structure" : "Final HSC preparation needs urgency"}
          className="bg-card"
        >
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <h3 className="text-2xl font-semibold">Why this course matters now</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {isBridge
                  ? "HSC Science introduces deeper concepts, heavier problem solving, and a new study rhythm. Students who start with a system build confidence earlier."
                  : "HSC 26 students need prioritised revision, board-style practice, and honest feedback. A clear weekly system prevents last-minute confusion."}
              </p>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Clear weekly study plan",
                "Daily Task Unit accountability",
                "Quiz and test feedback",
                "Parent-visible progress",
              ].map((item) => (
                <Card key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <p className="font-semibold">{item}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        <Section title="What students will learn" eyebrow="Outcomes">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {course.highlights.map((item) => (
              <Card key={item}>
                <FileText className="mb-4 size-6 text-primary" />
                <p className="font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Weekly structure" className="bg-[#eef5e8]">
          <div className="grid gap-4">
            {course.weeklyStructure.map((item, index) => (
              <Card key={item} className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold">Week focus</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="What is included" eyebrow="Course system">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Live classes", "Recorded lessons", "Daily Task Units", "Weekly parent reports"].map(
              (item) => (
                <StatCard key={item} label={item} icon={<CheckCircle2 className="size-5" />} />
              ),
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {course.materials.map((item) => (
              <Card key={item}>
                <p className="font-semibold">{item}</p>
                <p className="mt-2 text-sm text-muted-foreground">GRADE study material included.</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="GScore and parent reporting" className="bg-card">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <h3 className="text-2xl font-semibold">GScore keeps effort visible</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Students are tracked through task completion, quiz performance, lesson progress,
                consistency, and teacher review. This helps parents understand more than marks.
              </p>
            </Card>
            <Card>
              <MessageSquareText className="mb-4 size-7 text-primary" />
              <h3 className="text-2xl font-semibold">Weekly report for parents</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Reports summarise tasks completed, quiz score, streak, teacher comment, and
                next week&apos;s focus in a WhatsApp-ready format.
              </p>
            </Card>
          </div>
        </Section>

        <Section title="Course timeline">
          <div className="grid gap-4 md:grid-cols-4">
            {["Enrolment", "Orientation", "Weekly learning cycle", "Report and recovery"].map(
              (item, index) => (
                <Card key={item}>
                  <p className="text-sm font-semibold text-primary">Stage {index + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold">{item}</h3>
                </Card>
              ),
            )}
          </div>
        </Section>

        <Section title="Frequently asked questions" className="bg-[#eef5e8]">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Can students join online?", "Yes. Online, offline, and hybrid options are supported."],
              ["Is English Version supported?", "Yes. GRADE supports Bangla Version and English Version learners."],
              ["How are parents updated?", "Parents receive weekly progress summaries from task, quiz, and GScore data."],
              ["Is payment required now?", "No. Submit the form first; the team will contact you with details."],
            ].map(([question, answer]) => (
              <Card key={question}>
                <h3 className="font-semibold">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Enrolment request" eyebrow="Start here" className="bg-card">
          <div id="enrol" className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <Card>
              <h3 className="text-2xl font-semibold">No payment is required at this stage.</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Submit the form and our academic team will contact you with course, batch,
                payment, and account setup details.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  "Online, offline, and hybrid options",
                  "Bangla Version and English Version support",
                  "Parent progress updates",
                  "Manual enrolment support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold">
                    <CheckCircle2 className="size-5 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
            <LeadForm programme={course.title} />
          </div>
        </Section>

        <CTASection
          title="Need help choosing the right course?"
          description="Talk to the GRADE academic team and get guidance before enrolment."
          primaryHref="/contact"
          primaryLabel="Submit Enrolment Request"
          secondaryHref="https://wa.me/8801700000000"
          secondaryLabel="Chat on WhatsApp"
        />
      </PageShell>
      <SiteFooter />
    </>
  );
}
