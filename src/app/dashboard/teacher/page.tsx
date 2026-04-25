import { DashboardShell } from "@/components/dashboard-nav";
import { Card, MetricCard, StatusBadge } from "@/components/ui";
import { atRiskStudents, dailyTasks, quizzes, students } from "@/lib/sample-data";

export default function TeacherDashboardPage() {
  const pendingReviews = dailyTasks.filter((task) => task.status === "under_review");

  return (
    <DashboardShell role="teacher" title="Teacher Dashboard">
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Assigned batches" value="2" detail="Bridge and HSC 26" />
          <MetricCard label="Assigned students" value={students.length} detail="Launch sample" />
          <MetricCard label="Pending reviews" value={pendingReviews.length} detail="DTU submissions" tone="accent" />
          <MetricCard label="At-risk students" value={atRiskStudents.length} detail="Needs contact" tone="danger" />
        </div>
        <Card>
          <h2 id="reviews" className="text-xl font-semibold">Today&apos;s Submissions</h2>
          <div className="mt-5 grid gap-3">
            {dailyTasks.map((task) => (
              <div key={task.id} className="rounded-md border border-border bg-background p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{task.subject} · {task.chapter}</p>
                  </div>
                  <StatusBadge tone={task.status === "submitted" ? "warning" : "success"}>
                    {task.status.replace("_", " ")}
                  </StatusBadge>
                </div>
                <form className="mt-4 grid gap-3 md:grid-cols-[120px_1fr_auto]">
                  <input className="input" placeholder="Score /10" />
                  <input className="input" placeholder="Teacher feedback" />
                  <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    Save review
                  </button>
                </form>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 id="quizzes" className="text-xl font-semibold">Quiz Results</h2>
          <div className="mt-5 grid gap-3">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="rounded-md border border-border bg-background p-4">
                <h3 className="font-semibold">{quiz.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Average 78%, pass mark {quiz.passMark}%, feeds weekly GScore.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
