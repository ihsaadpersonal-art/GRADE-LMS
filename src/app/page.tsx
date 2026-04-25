import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LineChart,
  ListChecks,
  Languages,
  Users,
} from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink, Card, Container, PageShell, Section } from "@/components/ui";
import { courses } from "@/lib/sample-data";

const problems = [
  "Students finish SSC but do not know how to start HSC.",
  "HSC Science feels harder because the transition is unmanaged.",
  "Most coaching centres teach classes but do not track daily effort.",
];

const solution = [
  { title: "Conceptual lessons", icon: GraduationCap },
  { title: "Daily Task Units", icon: ClipboardCheck },
  { title: "Quizzes", icon: FileText },
  { title: "GScore", icon: BarChart3 },
  { title: "Parent reports", icon: Users },
  { title: "Teacher follow-up", icon: ArrowRight },
];

const trustStats = [
  { title: "Daily Task Units", icon: ListChecks },
  { title: "Weekly Parent Reports", icon: FileText },
  { title: "GScore Progress Tracking", icon: LineChart },
  { title: "Bangla & English Version Support", icon: Languages },
];

export default function HomePage() {
  const heroImagePath = "/images/grade-hero-students.jpg";
  const hasHeroImage = fs.existsSync(path.join(process.cwd(), "public", "images", "grade-hero-students.jpg"));

  return (
    <>
      <SiteHeader />
      <PageShell>
        <section className="border-b border-border bg-[#edf3e8] pt-20 pb-12 sm:pt-24 sm:pb-16">
          <Container className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-primary">
                GRADE Academic Coaching
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Structured Science & English Coaching for SSC and HSC Students
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Live and recorded classes, daily tasks, quizzes, GScore tracking, and weekly
                parent reports for Bangla Version and English Version learners.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/courses/ssc-to-hsc-science-bridge">Explore Courses</ButtonLink>
                <ButtonLink href="/resources" variant="secondary">
                  Get Free Starter Kit
                </ButtonLink>
              </div>
              <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                {["For SSC and HSC", "Online, offline, hybrid", "Parent-friendly progress"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              {hasHeroImage ? (
                <Image
                  src={heroImagePath}
                  alt="GRADE students using the learning system"
                  width={960}
                  height={720}
                  priority
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="grid min-h-[360px] place-items-center bg-[#f8faf4] p-6 sm:min-h-[460px]">
                  <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-primary">GRADE LMS</p>
                        <h2 className="mt-1 text-2xl font-semibold">
                          GRADE student learning system preview
                        </h2>
                      </div>
                      <span className="grid size-12 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                        <BarChart3 className="size-6" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="grid gap-3">
                      <Metric label="Today" value="1 DTU" detail="Clear task plan before 10 PM" />
                      <Metric label="Progress" value="GScore 78" detail="Lessons, quizzes, streak, effort" />
                      <Metric label="Report" value="Ready" detail="Weekly parent update prepared" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>

        <section className="border-b border-border bg-background py-6">
          <Container>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trustStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="flex min-h-24 items-center gap-3 p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-muted text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold leading-5">{stat.title}</p>
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>

        <Section title="The Problem GRADE Solves" eyebrow="Why it exists">
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((item) => (
              <Card key={item}>
                <p className="text-base leading-7 text-muted-foreground">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Content Without Accountability Is Entertainment" className="bg-card">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solution.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title}>
                  <Icon className="mb-4 size-6 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{item.title}</h3>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section title="Launch Programmes" eyebrow="May 2026">
          <div className="grid gap-5 lg:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Section>

        <Section title="How GRADE Works" className="bg-[#f2f5ef]">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {["Enrol", "Baseline test", "Daily tasks", "Quizzes", "Track GScore", "Parent report"].map(
              (step, index) => (
                <Card key={step}>
                  <p className="text-sm font-semibold text-primary">Step {index + 1}</p>
                  <p className="mt-2 font-semibold">{step}</p>
                </Card>
              ),
            )}
          </div>
        </Section>

        <Section title="What GScore Means">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <p className="text-5xl font-semibold text-primary">100</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                GScore combines task completion, quiz performance, lesson progress,
                consistency, and teacher-reviewed effort.
              </p>
            </Card>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Streak", "Quiz score", "Submission rate", "Improvement"].map((item) => (
                <Card key={item}>
                  <h3 className="font-semibold">{item}</h3>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Founder Message" className="bg-card">
          <Card>
            <p className="max-w-4xl text-lg leading-8 text-muted-foreground">
              GRADE is built for students who need structure after SSC and urgency before HSC.
              Our first promise is simple: every student should know what to study today, every
              parent should know how the student is doing this week, and every teacher should
              know who needs help before it is too late.
            </p>
          </Card>
        </Section>

        <Section title="Frequently Asked Questions">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Is GRADE online or offline?", "The launch programmes support online, offline, and hybrid operation."],
              ["Does GRADE support English Version?", "Yes. The first programmes support Bangla Version and English Version."],
              ["How are parents updated?", "Admins generate weekly WhatsApp-ready reports from task, quiz, and GScore data."],
              ["Is payment automated?", "No. v1 uses manual payment verification by admin."],
            ].map(([question, answer]) => (
              <Card key={question}>
                <h3 className="font-semibold">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/contact">Enrol now</ButtonLink>
          </div>
        </Section>
      </PageShell>
      <SiteFooter />
    </>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
