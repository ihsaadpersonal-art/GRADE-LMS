import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, Container, PageShell, Section } from "@/components/ui";

const differences = [
  "Students get a clear daily task instead of vague advice to study more.",
  "Quizzes and reviewed submissions show whether learning is actually happening.",
  "GScore combines effort, consistency, lessons, and test performance in one simple report.",
  "Parents receive weekly progress summaries that are easy to understand.",
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
        <section className="border-b border-border bg-[#edf3e8] pt-20 pb-12 sm:pt-24">
          <Container>
            <h1 className="text-4xl font-semibold">About GRADE</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
              GRADE exists to make Science and English learning more structured,
              accountable, and transparent for students and parents in Bangladesh.
            </p>
          </Container>
        </section>

        <Section title="Why GRADE Exists">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <p className="text-lg leading-8 text-muted-foreground">
                Many students move from SSC to HSC without a clear study system. They attend
                classes, collect notes, and still feel unsure about what to do each day. GRADE
                was built to close that gap with structured lessons, daily accountability, and
                visible progress.
              </p>
            </Card>
            <Card>
              <p className="text-lg leading-8 text-muted-foreground">
                For HSC candidates, the pressure is different: time is short, weak chapters
                need urgent attention, and parents need honest updates. GRADE keeps teaching,
                task tracking, quiz performance, and teacher follow-up in one simple system.
              </p>
            </Card>
          </div>
        </Section>

        <Section title="What Makes GRADE Different" className="bg-card">
          <div className="grid gap-4 md:grid-cols-2">
            {differences.map((item) => (
              <Card key={item}>
                <p className="font-medium">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="For Students">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {studentBenefits.map((item) => (
              <Card key={item}>
                <p className="font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="For Parents" className="bg-[#f2f5ef]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {parentBenefits.map((item) => (
              <Card key={item}>
                <p className="font-semibold">{item}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Founder Message">
          <Card>
            <p className="text-lg leading-8 text-muted-foreground">
              GRADE is built around a simple promise: a student should never feel lost about
              the next step, and a parent should never have to guess whether progress is
              happening. Our goal is to combine caring teachers with a clear system so students
              can build discipline, confidence, and measurable improvement.
            </p>
          </Card>
        </Section>

        <Section title="System-Based Education Philosophy" className="bg-card">
          <Card>
            <p className="text-lg leading-8 text-muted-foreground">
              The GRADE operating belief is that good teaching needs a system around it:
              daily tasks, reviewed submissions, quiz feedback, GScore, parent reports,
              and recovery action when a student falls behind. The system does not replace
              teachers; it helps teachers notice earlier, guide better, and communicate more
              clearly with families.
            </p>
          </Card>
        </Section>
      </PageShell>
      <SiteFooter />
    </>
  );
}
