import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileQuestion,
  FileText,
  GraduationCap,
  Languages,
  LineChart,
  MessageSquareText,
  PenLine,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { CourseCard } from "@/components/course-card";
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

const trustBadges = [
  "SSC-to-HSC Bridge",
  "HSC 26 Exam Ready",
  "Parent Reports",
  "GScore Tracking",
];

const problems = [
  {
    title: "No daily study structure",
    detail: "Students know they should study, but not what to finish today.",
  },
  {
    title: "Weak SSC-to-HSC transition",
    detail: "The jump into HSC Science feels sudden without a guided bridge.",
  },
  {
    title: "Parents do not know real progress",
    detail: "Marks alone do not show effort, consistency, or missed work.",
  },
  {
    title: "Classes without accountability",
    detail: "Students watch lessons but often do not practise, submit, and review.",
  },
];

const flow = [
  { title: "Learn", detail: "Live and recorded classes", icon: BookOpen },
  { title: "Practise", detail: "Guided science and English work", icon: PenLine },
  { title: "Submit", detail: "Daily Task Units and proof", icon: Send },
  { title: "Track", detail: "GScore, reports, and follow-up", icon: LineChart },
];

const gscoreParts = [
  "Daily Task Completion",
  "Quiz Performance",
  "Lesson Progress",
  "Consistency",
  "Teacher Review",
];

const resources = [
  {
    title: "Post-SSC Starter Kit",
    label: "PDF",
    detail: "A simple guide to start HSC preparation with clarity.",
    icon: FileText,
  },
  {
    title: "HSC Science Roadmap",
    label: "PDF",
    detail: "Understand what to study first and how to plan the journey.",
    icon: GraduationCap,
  },
  {
    title: "Diagnostic Quiz",
    label: "Quiz",
    detail: "Check current preparation level before starting.",
    icon: FileQuestion,
  },
  {
    title: "Free Parent Orientation",
    label: "Webinar",
    detail: "Join a short orientation session for students and parents.",
    icon: Users,
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <section className="relative border-b border-border bg-[#eef5e8] pt-24 pb-14 sm:pt-28 sm:pb-18">
          <div className="absolute inset-0 soft-grid opacity-60" aria-hidden="true" />
          <Container className="relative grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                GRADE Academic Coaching
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal text-foreground sm:text-5xl lg:text-[3.65rem]">
                Structured Science & English Coaching for SSC and HSC Students
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Live and recorded classes, daily tasks, quizzes, GScore tracking, and weekly
                parent reports for Bangla Version and English Version learners.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/courses/ssc-to-hsc-science-bridge">Explore Courses</ButtonLink>
                <ButtonLink href="/resources" variant="secondary">
                  Get Free Starter Kit
                </ButtonLink>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {trustBadges.map((badge) => (
                  <StatusBadge key={badge} tone="success">
                    {badge}
                  </StatusBadge>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_28px_80px_rgba(32,48,37,0.12)]">
              <div className="h-[520px] max-h-[70vh]">
                <ImageOrPlaceholder
                  src="/images/grade-hero-students.jpg"
                  alt="GRADE students learning with teacher support"
                  label="GRADE student learning system preview"
                  variant="dashboard"
                  priority
                />
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-border bg-background py-7">
          <Container>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Daily Task Units"
                detail="Every day has a clear study target."
                icon={<ClipboardCheck className="size-5" />}
              />
              <StatCard
                label="Weekly Parent Reports"
                detail="Parents see progress without guessing."
                icon={<MessageSquareText className="size-5" />}
              />
              <StatCard
                label="GScore Progress Tracking"
                detail="A simple score beyond exam marks."
                icon={<BarChart3 className="size-5" />}
              />
              <StatCard
                label="Bangla & English Version Support"
                detail="Built for both learner groups."
                icon={<Languages className="size-5" />}
              />
            </div>
          </Container>
        </section>

        <Section
          eyebrow="The gap"
          title="Most students enter HSC without a clear system"
          description="GRADE turns scattered coaching into a visible learning routine that students, teachers, and parents can follow together."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((problem) => (
              <Card key={problem.title}>
                <div className="mb-5 grid size-11 place-items-center rounded-xl bg-[#fff7e4] text-accent">
                  <Sparkles className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">{problem.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{problem.detail}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="The GRADE system"
          title="GRADE gives students a complete learning system"
          className="bg-card"
          align="center"
        >
          <div className="grid gap-4 md:grid-cols-4">
            {flow.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.title} className="relative min-h-52 text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-sm font-semibold text-primary">Step {index + 1}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.detail}</p>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section
          eyebrow="Programmes"
          title="Choose the right launch course"
          description="Two structured programmes cover the most urgent student needs: starting HSC Science well and preparing for HSC 26 exams with discipline."
        >
          <div className="grid gap-6 xl:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Section>

        <Section
          eyebrow="GScore"
          title="Progress that parents and students can understand"
          className="bg-[#eef5e8]"
        >
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-lg leading-8 text-muted-foreground">
                GScore helps students and parents understand progress beyond exam marks. It
                combines daily submission, quiz performance, lesson completion, consistency,
                and teacher review into one clear weekly picture.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {gscoreParts.map((part) => (
                  <div
                    key={part}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-semibold"
                  >
                    <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
                    {part}
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">Weekly GScore</p>
                  <p className="mt-1 text-5xl font-semibold">78</p>
                </div>
                <StatusBadge tone="success">Improving</StatusBadge>
              </div>
              <div className="grid gap-4">
                {[
                  ["Daily Task Completion", 86],
                  ["Quiz Performance", 78],
                  ["Lesson Progress", 67],
                  ["Consistency", 71],
                  ["Teacher Review", 90],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">{value}%</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-muted">
                      <div className="h-3 rounded-full bg-primary" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        <Section eyebrow="Parent updates" title="Weekly reports parents can act on">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Card className="bg-[#f7fbf4] p-6">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm font-semibold text-primary">GRADE Weekly Report</p>
                <h3 className="mt-2 text-2xl font-semibold">Ariyan Rahman</h3>
                <div className="mt-5 grid gap-3">
                  <ReportRow label="Tasks completed" value="6/7" />
                  <ReportRow label="Weekly quiz score" value="78/100" />
                  <ReportRow label="Streak" value="5 days" />
                  <ReportRow label="Teacher comment" value="Consistent work. Improve unit writing." />
                  <ReportRow label="Next focus" value="Vectors, units, and Chemistry mole basics." />
                </div>
              </div>
            </Card>
            <div>
              <StatusBadge tone="success">WhatsApp-ready</StatusBadge>
              <h3 className="mt-4 text-3xl font-semibold leading-tight">
                Parents get a clear weekly picture, not a vague update.
              </h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Reports help families see effort, quiz performance, streak, teacher feedback,
                and the next study focus in one readable summary.
              </p>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Free resources"
          title="Start with a useful guide"
          className="bg-card"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.title} className="flex min-h-72 flex-col">
                  <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-muted text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <StatusBadge tone="neutral">{resource.label}</StatusBadge>
                  <h3 className="mt-4 text-xl font-semibold leading-tight">{resource.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{resource.detail}</p>
                  <p className="mt-auto pt-5 text-sm font-semibold text-primary">
                    Register to receive this free resource.
                  </p>
                </Card>
              );
            })}
          </div>
        </Section>

        <CTASection
          title="Ready to start HSC with a clear plan?"
          description="Submit an enrolment request and the GRADE academic team will help you choose the right course, batch, and learning mode."
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

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6">{value}</p>
    </div>
  );
}
