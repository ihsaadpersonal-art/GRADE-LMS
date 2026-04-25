import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { dailyTasks } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type TaskView = {
  id: string;
  title: string;
  taskDate: string;
  subject: string;
  chapter: string;
  watchTask: string;
  readTask: string;
  solveTask: string;
  submitTask: string;
  reviewTask: string;
  dueAt: string;
  status: string;
};

export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = (isUuid(taskId) ? await getSupabaseTaskView(taskId) : null) ?? getSampleTaskView(taskId);
  if (!task) notFound();

  return (
    <DashboardShell role="student" title="Daily Task Unit">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <StatusBadge tone="warning">{task.status.replace("_", " ")}</StatusBadge>
          <h1 className="mt-4 text-2xl font-semibold">{task.title}</h1>
          <dl className="mt-5 grid gap-3 text-sm">
            <Row label="Date" value={task.taskDate} />
            <Row label="Subject" value={task.subject} />
            <Row label="Chapter" value={task.chapter} />
            <Row label="Due" value={task.dueAt} />
          </dl>
        </Card>
        <Card>
          <div className="grid gap-4 text-sm">
            <Task label="Watch" value={task.watchTask} />
            <Task label="Read" value={task.readTask} />
            <Task label="Solve" value={task.solveTask} />
            <Task label="Submit" value={task.submitTask} />
            <Task label="Review" value={task.reviewTask} />
          </div>
          <form className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">
              Student note
              <textarea className="input min-h-28" placeholder="Write what you completed and where you got stuck." />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Proof image/PDF URL
              <input className="input" placeholder="Paste Supabase Storage file URL for v1" />
            </label>
            <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Submit task
            </button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

function getSampleTaskView(taskId: string): TaskView | null {
  const task = dailyTasks.find((item) => item.id === taskId);
  if (!task) {
    return null;
  }

  return task;
}

async function getSupabaseTaskView(taskId: string): Promise<TaskView | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data: task, error: taskError } = await supabase
    .from("daily_task_units")
    .select(
      "id, title, task_date, subject, chapter, watch_task, read_task, solve_task, submit_task, review_task, due_at",
    )
    .eq("id", taskId)
    .maybeSingle();

  if (taskError || !task) {
    return null;
  }

  let status = "not_started";
  const profile = await getCurrentProfile();

  if (profile?.role === "student") {
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("profile_id", profile.id)
      .maybeSingle();

    if (studentError) {
      return null;
    }

    if (student) {
      const { data: submission, error: submissionError } = await supabase
        .from("dtu_submissions")
        .select("status")
        .eq("student_id", student.id)
        .eq("dtu_id", task.id)
        .maybeSingle();

      if (submissionError) {
        return null;
      }

      status = submission?.status ?? status;
    }
  }

  return {
    id: task.id,
    title: task.title,
    taskDate: task.task_date,
    subject: task.subject ?? "General",
    chapter: task.chapter ?? "Daily Task Unit",
    watchTask: task.watch_task ?? "No watch task assigned.",
    readTask: task.read_task ?? "No reading task assigned.",
    solveTask: task.solve_task ?? "No solving task assigned.",
    submitTask: task.submit_task ?? "No submission instruction assigned.",
    reviewTask: task.review_task ?? "No review task assigned.",
    dueAt: task.due_at ?? "Not set",
    status,
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function Task({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-muted-foreground">{value}</p>
    </div>
  );
}
