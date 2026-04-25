import { AlertTriangle, GraduationCap, LineChart, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-nav";
import { Card, MetricCard, StatusBadge } from "@/components/ui";
import { atRiskStudents, dailyTasks, quizzes, students } from "@/lib/sample-data";

export default function TeacherDashboardPage() {
  const pendingReviews = dailyTasks.filter((task) => task.status === "under_review");

  return (
    <DashboardShell role="teacher" title="Teacher Dashboard">
      <div className="grid gap-6">
        <Card className="bg-[#eef5e8]">
          <StatusBadge tone="success">Teacher follow-up</StatusBadge>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            Review submissions, spot weak students, and keep recovery work moving.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            This dashboard keeps assigned batches, pending DTU submissions, quiz performance,
            and at-risk students easy to scan.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Assigned batches" value="2" detail="Bridge and HSC 26" />
          <MetricCard label="Assigned students" value={students.length} detail="Students to support" />
          <MetricCard label="Pending reviews" value={pendingReviews.length} detail="DTU submissions" tone="accent" />
          <MetricCard label="At-risk students" value={atRiskStudents.length} detail="Needs contact" tone="danger" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <h2 id="reviews" className="text-2xl font-semibold">Recent submissions</h2>
            <div className="mt-5 grid gap-3">
              {dailyTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-border bg-background p-4">
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
                    <button className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                      Save Review
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5">
            <Card>
              <h2 className="text-2xl font-semibold">Assigned batches</h2>
              <div className="mt-5 grid gap-3">
                <TeacherItem icon={<GraduationCap className="size-5" />} title="Bridge BV Batch A" detail="SSC-to-HSC Science Bridge" />
                <TeacherItem icon={<Users className="size-5" />} title="HSC 26 EV Crash" detail="Exam Ready Crash Course" />
              </div>
            </Card>
            <Card>
              <h2 id="quizzes" className="text-2xl font-semibold">Quiz performance</h2>
              <div className="mt-5 grid gap-3">
                {quizzes.map((quiz) => (
                  <TeacherItem
                    key={quiz.id}
                    icon={<LineChart className="size-5" />}
                    title={quiz.title}
                    detail={`Average 78%, pass mark ${quiz.passMark}%`}
                  />
                ))}
              </div>
            </Card>
            <Card className="border-danger/30 bg-[#fff6f6]">
              <h2 className="text-2xl font-semibold">At-risk students</h2>
              <div className="mt-5 grid gap-3">
                {atRiskStudents.map((student) => (
                  <TeacherItem
                    key={student.studentName}
                    icon={<AlertTriangle className="size-5" />}
                    title={student.studentName}
                    detail={student.reason}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function TeacherItem({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-primary">
        {icon}
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
