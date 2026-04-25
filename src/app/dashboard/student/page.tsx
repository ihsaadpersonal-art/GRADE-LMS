import { BookOpen, ClipboardCheck, FileText, MessageSquare, Trophy } from "lucide-react";
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

  return (
    <DashboardShell role="student" title="Student Dashboard">
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Current GScore" value={gscore.totalGscore} detail="Weekly score out of 100" tone="accent" />
          <MetricCard label="Current streak" value="5 days" detail="Weekly streak score 71%" />
          <MetricCard label="Weekly quiz" value={percent(gscore.weeklyQuizPercentage)} detail={quiz.title} />
          <MetricCard label="Lessons completed" value={`${completedLessons}/${lessons.length}`} detail="Course progress" />
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <StatusBadge tone="success">Enrolled</StatusBadge>
                <h2 className="mt-3 text-2xl font-semibold">{course.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{course.description}</p>
              </div>
              <BookOpen className="size-7 text-primary" aria-hidden="true" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/dashboard/student/courses/${course.id}`}>Continue course</ButtonLink>
              <ButtonLink href={`/dashboard/student/quizzes/${quiz.id}`} variant="secondary">
                Take quiz
              </ButtonLink>
            </div>
          </Card>
          <Card>
            <ClipboardCheck className="mb-4 size-6 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Today&apos;s Daily Task Unit</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.title}</p>
            <div className="mt-4">
              <StatusBadge tone="warning">{task.status.replace("_", " ")}</StatusBadge>
            </div>
            <div className="mt-5">
              <ButtonLink href={`/dashboard/student/tasks/${task.id}`} variant="secondary">
                Submit today&apos;s task
              </ButtonLink>
            </div>
          </Card>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <Trophy className="mb-3 size-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">Leaderboard rank</h3>
            <p className="mt-2 text-2xl font-semibold">#1</p>
          </Card>
          <Card>
            <MessageSquare className="mb-3 size-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">Teacher feedback</h3>
            <p className="mt-2 text-sm text-muted-foreground">Good consistency. Improve unit writing.</p>
          </Card>
          <Card>
            <FileText className="mb-3 size-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">Upcoming live class</h3>
            <p className="mt-2 text-sm text-muted-foreground">Physics bridge class, Sunday 8:00 PM.</p>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
