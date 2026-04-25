import { CheckCircle2, HeartHandshake, LineChart, MessageSquareText, ShieldCheck, Users } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CTASection, PageHeader, PageShell, Section, StatCard } from "@/components/ui";
import { ImageOrPlaceholder } from "@/components/visual-media";

const mission = [
  "Help SSC students enter HSC Science with confidence.",
  "Help HSC students prepare with urgency, clarity, and feedback.",
  "Give parents weekly visibility into effort and performance.",
  "Give teachers a system for identifying weak students early.",
];

const differences = [
  "Students get a clear daily task instead of vague advice to study more.",
  "Quizzes and reviewed submissions show whether learning is actually happening.",
  "GScore combines effort, consistency, lessons, and test performance in one simple report.",
  "Parents receive weekly summaries that are easy to understand and act on.",
];

const studentBenefits = [
  "Know what to study today",
  "Follow lessons in order",
  "Build consistency through Daily Task Units",
  "See progress through GScore and leaderboard position",
];

const parentBenefits = [
  "Understand weekly task completion",
  "See quiz and test performance",
  "Know when the student is falling behind",
  "Receive teacher comments and next-week focus areas",
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHeader
          eyebrow="About GRADE"
          title="A learning system for students, parents, and teachers"
          description="GRADE Academic Coaching exists to make Science and English learning more structured, accountable, and transparent for SSC and HSC students in Bangladesh."
        />

        <Section title="Why GRADE exists" eyebrow="The belief">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Card>
              <p className="text-lg leading-8 text-muted-foreground">
                Many students move from SSC to HSC without a clear study system. They attend
                classes, collect notes, and still feel unsure about what to do each day. GRADE
                was built to close that gap with structured lessons, daily accountability, and
                visible progress.
              </p>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                For HSC candidates, the pressure is different: time is short, weak chapters
                need urgent attention, and parents need honest updates. GRADE keeps teaching,
                task tracking, quiz performance, and teacher follow-up in one simple system.
              </p>
            </Card>
            <Card className="overflow-hidden p-0">
              <div className="h-80">
                <ImageOrPlaceholder
                  src="/images/founder-message.jpg"
                  alt="GRADE founder message"
                  label="Founder message and academic care"
                  variant="founder"
                />
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Our mission" className="bg-card">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mission.map((item) => (
              <StatCard key={item} label={item} icon={<ShieldCheck className="size-5" />} />
            ))}
          </div>
        </Section>

        <Section title="What makes GRADE different">
          <div className="grid gap-4 md:grid-cols-2">
            {differences.map((item) => (
              <Card key={item} className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                <p className="font-medium leading-7">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="For students" className="bg-[#eef5e8]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studentBenefits.map((item) => (
              <StatCard key={item} label={item} icon={<LineChart className="size-5" />} />
            ))}
          </div>
        </Section>

        <Section title="For parents">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {parentBenefits.map((item) => (
              <StatCard key={item} label={item} icon={<MessageSquareText className="size-5" />} />
            ))}
          </div>
        </Section>

        <Section title="Founder message" className="bg-card">
          <Card className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
            <span className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <HeartHandshake className="size-8" />
            </span>
            <div>
              <p className="text-xl leading-9 text-muted-foreground">
                GRADE is built around a simple promise: a student should never feel lost about
                the next step, and a parent should never have to guess whether progress is
                happening. Our goal is to combine caring teachers with a clear system so students
                can build discipline, confidence, and measurable improvement.
              </p>
              <p className="mt-5 text-sm font-semibold text-primary">GRADE Academic Team</p>
            </div>
          </Card>
        </Section>

        <Section title="System-based education philosophy">
          <Card>
            <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
              <div>
                <Users className="mb-4 size-7 text-primary" />
                <h3 className="text-2xl font-semibold">Human care, supported by a system</h3>
              </div>
              <p className="text-lg leading-8 text-muted-foreground">
                The GRADE operating belief is that good teaching needs a system around it:
                daily tasks, reviewed submissions, quiz feedback, GScore, parent reports,
                and recovery action when a student falls behind. The system does not replace
                teachers; it helps teachers notice earlier, guide better, and communicate more
                clearly with families.
              </p>
            </div>
          </Card>
        </Section>

        <CTASection
          title="Want to understand the right path for your child?"
          description="Submit an enrolment request and the GRADE team will guide you through courses, batches, learning mode, and next steps."
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
