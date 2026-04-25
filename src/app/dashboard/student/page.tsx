import {
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  LineChart,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, MetricCard, StatusBadge } from "@/components/ui";
import { courses, dailyTasks, gscores, lessons, quizzes } from "@/lib/sample-data";
import { percent } from "@/lib/utils";

export default function StudentDashboardPage() {
  const course = courses[0];
  const task = dailyTasks[0];
  const gscore = gscores[0];
  const quiz = quizzes[0];
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
  const progress = Math.round((completedLessons / lessons.length) * 100);

  return (
    <DashboardShell role="student" title="Student Dashboard">
      <div className="grid gap-6">
        <Card className="overflow-hidden bg-[#eef5e8] p-0">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <StatusBadge tone="success">Welcome back</StatusBadge>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Keep today&apos;s study streak moving.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Continue your course, submit today&apos;s Daily Task Unit, and check how your
                GScore is improving this week.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-medium text-muted-foreground">Course progress</p>
              <p className="mt-2 text-4xl font-semibold">{progress}%</p>
              <div className="mt-4 h-3 w-56 max-w-full rounded-full bg-muted">
                <div className="h-3 rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Current GScore"
            value={gscore.totalGscore}
            detail="Weekly score out of 100"
            tone="accent"
          />
          <MetricCard label="Current streak" value="5 days" detail="Consistency this week" />
          <MetricCard label="Weekly quiz" value={percent(gscore.weeklyQuizPercentage)} detail={quiz.title} />
          <MetricCard label="Lessons completed" value={`${completedLessons}/${lessons.length}`} detail="Course progress" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <StatusBadge tone="success">Enrolled course</StatusBadge>
                <h2 className="mt-3 text-2xl font-semibold">{course.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{course.description}</p>
              </div>
              <BookOpen className="size-8 text-primary" aria-hidden="true" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/dashboard/student/courses/${course.id}`}>Continue Course</ButtonLink>
              <ButtonLink href={`/dashboard/student/quizzes/${quiz.id}`} variant="secondary">
                Take Quiz
              </ButtonLink>
            </div>
          </Card>
          <Card className="border-accent/30 bg-[#fff9eb]">
            <ClipboardCheck className="mb-4 size-7 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Today&apos;s DTU</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.title}</p>
            <div className="mt-4">
              <StatusBadge tone="warning">{task.status.replace("_", " ")}</StatusBadge>
            </div>
            <div className="mt-5">
              <ButtonLink href={`/dashboard/student/tasks/${task.id}`} variant="secondary">
                Submit Today&apos;s Task
              </ButtonLink>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={<LineChart className="size-5" />} title="Quiz performance" detail="Baseline diagnostic: 78%" />
          <InfoCard icon={<Trophy className="size-5" />} title="Leaderboard rank" detail="#1 this week" />
          <InfoCard icon={<CalendarClock className="size-5" />} title="Upcoming class" detail="Physics bridge, Sunday 8:00 PM" />
          <InfoCard icon={<MessageSquare className="size-5" />} title="Teacher feedback" detail="Good consistency. Improve unit writing." />
        </div>
      </div>
    </DashboardShell>
  );
}

function InfoCard({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <Card>
      <span className="grid size-11 place-items-center rounded-xl bg-muted text-primary">{icon}</span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </Card>
  );
}
