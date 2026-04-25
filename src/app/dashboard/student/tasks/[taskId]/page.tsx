import { revalidatePath } from "next/cache";
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
  submission: {
    status: string;
    submissionText: string | null;
    fileUrl: string | null;
    submittedAt: string | null;
    score: number | null;
    teacherFeedback: string | null;
    reviewedAt: string | null;
  } | null;
};

export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = (isUuid(taskId) ? await getSupabaseTaskView(taskId) : null) ?? getSampleTaskView(taskId);
  if (!task) notFound();
  const isLiveTask = isUuid(taskId);

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
          <form action={isLiveTask ? submitDtuTask.bind(null, taskId) : undefined} className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">
              Student note
              <textarea
                className="input min-h-28"
                disabled={!isLiveTask}
                name="submission_text"
                placeholder="Write what you completed and where you got stuck."
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Proof image/PDF URL
              <input
                className="input"
                disabled={!isLiveTask}
                name="file_url"
                placeholder="Paste Supabase Storage file URL for v1"
              />
            </label>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
              disabled={!isLiveTask}
            >
              {isLiveTask ? "Submit task" : "Preview only"}
            </button>
          </form>
        </Card>
        {task.submission ? (
          <Card className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Academic Feedback</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {task.submission.status === "reviewed"
                    ? "Your reviewed submission is available below."
                    : "Your submission has been received and is waiting for review."}
                </p>
              </div>
              <StatusBadge tone={task.submission.status === "reviewed" ? "success" : "warning"}>
                {task.submission.status.replace("_", " ")}
              </StatusBadge>
            </div>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              {task.submission.submissionText ? (
                <FeedbackRow label="Submitted note" value={task.submission.submissionText} />
              ) : null}
              {task.submission.fileUrl ? (
                <div className="rounded-md border border-border bg-background p-3">
                  <dt className="font-medium text-muted-foreground">Proof/file URL</dt>
                  <dd className="mt-1">
                    <a className="font-semibold text-primary hover:underline" href={task.submission.fileUrl}>
                      View submitted file
                    </a>
                  </dd>
                </div>
              ) : null}
              {task.submission.submittedAt ? (
                <FeedbackRow label="Submitted at" value={formatDateTime(task.submission.submittedAt)} />
              ) : null}
              {task.submission.score !== null ? (
                <FeedbackRow label="Score" value={`${task.submission.score}/10`} />
              ) : null}
              {task.submission.teacherFeedback ? (
                <FeedbackRow label="Academic feedback" value={task.submission.teacherFeedback} />
              ) : null}
              {task.submission.reviewedAt ? (
                <FeedbackRow label="Reviewed at" value={formatDateTime(task.submission.reviewedAt)} />
              ) : null}
            </dl>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}

function getSampleTaskView(taskId: string): TaskView | null {
  const task = dailyTasks.find((item) => item.id === taskId);
  if (!task) {
    return null;
  }

  return { ...task, submission: null };
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
        .select("status, submission_text, file_url, submitted_at, score, teacher_feedback, reviewed_at")
        .eq("student_id", student.id)
        .eq("dtu_id", task.id)
        .maybeSingle();

      if (submissionError) {
        return null;
      }

      status = submission?.status ?? status;
      if (submission) {
        return mapSupabaseTask(task, status, {
          status: submission.status,
          submissionText: submission.submission_text,
          fileUrl: submission.file_url,
          submittedAt: submission.submitted_at,
          score: submission.score,
          teacherFeedback: submission.teacher_feedback,
          reviewedAt: submission.reviewed_at,
        });
      }
    }
  }

  return mapSupabaseTask(task, status, null);
}

function mapSupabaseTask(
  task: {
    id: string;
    title: string;
    task_date: string;
    subject: string | null;
    chapter: string | null;
    watch_task: string | null;
    read_task: string | null;
    solve_task: string | null;
    submit_task: string | null;
    review_task: string | null;
    due_at: string | null;
  },
  status: string,
  submission: TaskView["submission"],
): TaskView {
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
    submission,
  };
}

async function submitDtuTask(taskId: string, formData: FormData) {
  "use server";

  if (!isUuid(taskId)) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student") {
    return;
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (studentError || !student) {
    return;
  }

  const { data: task, error: taskError } = await supabase
    .from("daily_task_units")
    .select("id")
    .eq("id", taskId)
    .maybeSingle();

  if (taskError || !task) {
    return;
  }

  const submissionText = String(formData.get("submission_text") ?? "").trim();
  const fileUrl = String(formData.get("file_url") ?? "").trim();
  const now = new Date().toISOString();

  const { error } = await supabase.from("dtu_submissions").upsert(
    {
      dtu_id: task.id,
      student_id: student.id,
      submission_text: submissionText || null,
      file_url: fileUrl || null,
      status: "submitted",
      submitted_at: now,
    },
    { onConflict: "dtu_id,student_id" },
  );

  if (!error) {
    revalidatePath(`/dashboard/student/tasks/${taskId}`);
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function FeedbackRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold leading-6">{value}</dd>
    </div>
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Task({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-muted-foreground">{value}</p>
    </div>
  );
}
