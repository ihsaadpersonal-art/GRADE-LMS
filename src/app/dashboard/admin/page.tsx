import { revalidatePath } from "next/cache";
import { AlertTriangle, ClipboardCheck, CreditCard, FileText, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, MetricCard, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { atRiskStudents, courses, dailyTasks, leads, payments, students } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatBDT } from "@/lib/utils";

type RecentDtuSubmission = {
  id: string;
  student: string;
  task: string;
  status: string;
  submittedAt: string;
  submissionText: string | null;
  fileUrl: string | null;
  score: number | null;
  teacherFeedback: string | null;
};

type RecentQuizAttempt = {
  id: string;
  student: string;
  quiz: string;
  score: string;
  passed: boolean | null;
  submittedAt: string;
};

type AdminView = {
  totalStudents: number;
  activeStudents: number;
  totalLeads: number;
  newLeads: number;
  pendingPayments: number;
  revenue: number;
  pendingDtuReviews: number;
  activeCourses: number;
  atRiskStudents: number;
  recentDtuSubmissions: RecentDtuSubmission[];
  recentQuizAttempts: RecentQuizAttempt[];
  isLive: boolean;
};

export default async function AdminDashboardPage() {
  const view = (await getSupabaseAdminView()) ?? getSampleAdminView();

  return (
    <DashboardShell role="admin" title="Admin Dashboard">
      <div className="grid gap-6">
        <Card className="bg-[#eef5e8]">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <StatusBadge tone="success">
                {view.isLive ? "Live launch operations" : "Launch operations preview"}
              </StatusBadge>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Manage enrolment, payments, reviews, and parent updates from one place.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                The admin dashboard is designed for quick scanning: what needs contact,
                what needs verification, and which students need support.
              </p>
            </div>
            <ButtonLink href="/dashboard/admin/leads">Review New Leads</ButtonLink>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total students" value={view.totalStudents} detail="Student records" />
          <MetricCard label="Active students" value={view.activeStudents} detail="Currently enrolled" />
          <MetricCard label="Total leads" value={view.totalLeads} detail={`${view.newLeads} new leads`} tone="accent" />
          <MetricCard label="This week's revenue" value={formatBDT(view.revenue)} detail="Verified payments" />
          <MetricCard label="Pending payments" value={view.pendingPayments} detail="Manual verification" tone="danger" />
          <MetricCard label="Pending DTU reviews" value={view.pendingDtuReviews} detail="Teacher action needed" />
          <MetricCard label="Active courses" value={view.activeCourses} detail="Published programmes" />
          <MetricCard label="At-risk students" value={view.atRiskStudents} detail="Recovery action needed" tone="danger" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <h2 className="text-2xl font-semibold">Priority tasks</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["Contact new leads", `${view.newLeads} waiting`, Users],
                ["Verify pending payments", `${view.pendingPayments} pending`, CreditCard],
                ["Review DTU submissions", `${view.pendingDtuReviews} pending`, ClipboardCheck],
                ["Generate parent reports", "Weekly report ready", FileText],
                ["Support at-risk students", `${view.atRiskStudents} flagged`, AlertTriangle],
              ].map(([label, status, Icon]) => (
                <div key={String(label)} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-muted text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold">{String(label)}</span>
                  </div>
                  <StatusBadge tone={String(label).includes("at-risk") ? "danger" : "success"}>
                    {String(status)}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-semibold">Quick actions</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Use these previews to inspect the launch operations flow before connecting live data.
            </p>
            <div className="mt-6 grid gap-3">
              <ButtonLink href="/dashboard/admin/leads">Lead Management</ButtonLink>
              <ButtonLink href="/dashboard/admin/payments" variant="secondary">
                Payment Verification
              </ButtonLink>
              <ButtonLink href="/dashboard/admin/reports" variant="secondary">
                Parent Report Generator
              </ButtonLink>
              <ButtonLink href="/dashboard/admin/at-risk" variant="secondary">
                At-Risk Students
              </ButtonLink>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-semibold">Recent DTU submissions</h2>
            <div className="mt-5 grid gap-3">
              {view.recentDtuSubmissions.length ? (
                view.recentDtuSubmissions.map((submission) => (
                  <DtuReviewRow key={submission.id} submission={submission} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No DTU submissions yet.</p>
              )}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-semibold">Recent quiz attempts</h2>
            <div className="mt-5 grid gap-3">
              {view.recentQuizAttempts.length ? (
                view.recentQuizAttempts.map((attempt) => (
                  <RecentRow
                    key={attempt.id}
                    title={attempt.quiz}
                    meta={`${attempt.student} · ${attempt.score} · ${formatDateTime(attempt.submittedAt)}`}
                    badge={attempt.passed === null ? "submitted" : attempt.passed ? "passed" : "needs recovery"}
                    tone={attempt.passed === false ? "warning" : "success"}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function getSampleAdminView(): AdminView {
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const pendingReviews = dailyTasks.filter((task) => task.status === "under_review");
  const revenue = payments
    .filter((payment) => payment.status === "verified")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalStudents: students.length,
    activeStudents: students.filter((student) => student.status === "active").length,
    totalLeads: leads.length,
    newLeads: leads.filter((lead) => lead.status === "new").length,
    pendingPayments: pendingPayments.length,
    revenue,
    pendingDtuReviews: pendingReviews.length,
    activeCourses: courses.length,
    atRiskStudents: atRiskStudents.length,
    recentDtuSubmissions: [],
    recentQuizAttempts: [],
    isLive: false,
  };
}

async function getSupabaseAdminView(): Promise<AdminView | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return null;
  }

  const [
    totalStudentsResult,
    activeStudentsResult,
    totalLeadsResult,
    newLeadsResult,
    pendingPaymentsResult,
    revenueResult,
    pendingDtuResult,
    activeCoursesResult,
    atRiskResult,
    recentDtuResult,
    recentQuizResult,
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("students").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("payments").select("amount").eq("status", "verified"),
    supabase.from("dtu_submissions").select("id", { count: "exact", head: true }).in("status", ["submitted", "late"]),
    supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("recovery_actions").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
    supabase
      .from("dtu_submissions")
      .select("id, dtu_id, student_id, submission_text, file_url, status, score, teacher_feedback, submitted_at, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("quiz_attempts")
      .select("id, quiz_id, student_id, score, percentage, passed, submitted_at, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const results = [
    totalStudentsResult,
    activeStudentsResult,
    totalLeadsResult,
    newLeadsResult,
    pendingPaymentsResult,
    revenueResult,
    pendingDtuResult,
    activeCoursesResult,
    atRiskResult,
    recentDtuResult,
    recentQuizResult,
  ];

  if (results.some((result) => result.error)) {
    return null;
  }

  const revenue = (revenueResult.data ?? []).reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const recentDtuSubmissions = await mapRecentDtuSubmissions(recentDtuResult.data ?? []);
  const recentQuizAttempts = await mapRecentQuizAttempts(recentQuizResult.data ?? []);

  return {
    totalStudents: totalStudentsResult.count ?? 0,
    activeStudents: activeStudentsResult.count ?? 0,
    totalLeads: totalLeadsResult.count ?? 0,
    newLeads: newLeadsResult.count ?? 0,
    pendingPayments: pendingPaymentsResult.count ?? 0,
    revenue,
    pendingDtuReviews: pendingDtuResult.count ?? 0,
    activeCourses: activeCoursesResult.count ?? 0,
    atRiskStudents: atRiskResult.count ?? 0,
    recentDtuSubmissions,
    recentQuizAttempts,
    isLive: true,
  };
}

async function mapRecentDtuSubmissions(
  submissions: {
    id: string;
    dtu_id: string;
    student_id: string;
    submission_text: string | null;
    file_url: string | null;
    status: string;
    score: number | null;
    teacher_feedback: string | null;
    submitted_at: string | null;
    created_at: string;
  }[],
): Promise<RecentDtuSubmission[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !submissions.length) {
    return [];
  }

  const studentNames = await getStudentLabels(submissions.map((submission) => submission.student_id));
  const taskTitles = await getTaskTitles(submissions.map((submission) => submission.dtu_id));

  return submissions.map((submission) => ({
    id: submission.id,
    student: studentNames.get(submission.student_id) ?? "Student record",
    task: taskTitles.get(submission.dtu_id) ?? "Daily Task Unit",
    status: submission.status,
    submittedAt: submission.submitted_at ?? submission.created_at,
    submissionText: submission.submission_text,
    fileUrl: submission.file_url,
    score: submission.score,
    teacherFeedback: submission.teacher_feedback,
  }));
}

async function reviewDtuSubmission(formData: FormData) {
  "use server";

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return;
  }

  const submissionId = String(formData.get("submission_id") ?? "").trim();
  const scoreValue = Number(formData.get("score"));
  const teacherFeedback = String(formData.get("teacher_feedback") ?? "").trim();

  if (!submissionId || !Number.isFinite(scoreValue) || scoreValue < 0 || scoreValue > 10) {
    return;
  }

  const { error } = await supabase
    .from("dtu_submissions")
    .update({
      score: scoreValue,
      teacher_feedback: teacherFeedback || null,
      status: "reviewed",
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (!error) {
    revalidatePath("/dashboard/admin");
  }
}

async function mapRecentQuizAttempts(
  attempts: {
    id: string;
    quiz_id: string;
    student_id: string;
    score: number | null;
    percentage: number | null;
    passed: boolean | null;
    submitted_at: string | null;
    created_at: string;
  }[],
): Promise<RecentQuizAttempt[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !attempts.length) {
    return [];
  }

  const studentNames = await getStudentLabels(attempts.map((attempt) => attempt.student_id));
  const quizTitles = await getQuizTitles(attempts.map((attempt) => attempt.quiz_id));

  return attempts.map((attempt) => ({
    id: attempt.id,
    student: studentNames.get(attempt.student_id) ?? "Student record",
    quiz: quizTitles.get(attempt.quiz_id) ?? "Quiz attempt",
    score: `${Number(attempt.score ?? 0)}/${Number(attempt.percentage ?? 0)}%`,
    passed: attempt.passed,
    submittedAt: attempt.submitted_at ?? attempt.created_at,
  }));
}

async function getStudentLabels(studentIds: string[]) {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !studentIds.length) {
    return new Map<string, string>();
  }

  const { data: studentRows } = await supabase
    .from("students")
    .select("id, profile_id, student_code")
    .in("id", Array.from(new Set(studentIds)));

  const profileIds = (studentRows ?? [])
    .map((student) => student.profile_id)
    .filter((profileId): profileId is string => Boolean(profileId));
  const { data: profileRows } = profileIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", profileIds)
    : { data: [] };

  const namesByProfile = new Map(
    (profileRows ?? [])
      .filter((profile) => Boolean(profile.full_name))
      .map((profile) => [profile.id, profile.full_name ?? ""] as [string, string]),
  );

  return new Map(
    (studentRows ?? []).map((student) => [
      student.id,
      (student.profile_id ? namesByProfile.get(student.profile_id) : null) ?? student.student_code,
    ]),
  );
}

async function getTaskTitles(taskIds: string[]) {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !taskIds.length) {
    return new Map<string, string>();
  }

  const { data } = await supabase
    .from("daily_task_units")
    .select("id, title")
    .in("id", Array.from(new Set(taskIds)));

  return new Map((data ?? []).map((task) => [task.id, task.title]));
}

async function getQuizTitles(quizIds: string[]) {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !quizIds.length) {
    return new Map<string, string>();
  }

  const { data } = await supabase
    .from("quizzes")
    .select("id, title")
    .in("id", Array.from(new Set(quizIds)));

  return new Map((data ?? []).map((quiz) => [quiz.id, quiz.title]));
}

function RecentRow({
  title,
  meta,
  badge,
  tone = "success",
}: {
  title: string;
  meta: string;
  badge: string;
  tone?: "success" | "warning";
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
      </div>
      <StatusBadge tone={tone}>{badge.replace("_", " ")}</StatusBadge>
    </div>
  );
}

function DtuReviewRow({ submission }: { submission: RecentDtuSubmission }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold">{submission.task}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {submission.student} · {formatDateTime(submission.submittedAt)}
          </p>
        </div>
        <StatusBadge tone={submission.status === "reviewed" ? "success" : "warning"}>
          {submission.status.replace("_", " ")}
        </StatusBadge>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
        {submission.submissionText ? <p>{submission.submissionText}</p> : null}
        {submission.fileUrl ? (
          <a className="font-medium text-primary hover:underline" href={submission.fileUrl}>
            View submitted file
          </a>
        ) : null}
        {submission.score !== null || submission.teacherFeedback ? (
          <p>
            Current review: {submission.score ?? "No score"}/10
            {submission.teacherFeedback ? ` · ${submission.teacherFeedback}` : ""}
          </p>
        ) : null}
      </div>
      <form action={reviewDtuSubmission} className="mt-4 grid gap-3 md:grid-cols-[120px_1fr_auto]">
        <input name="submission_id" type="hidden" value={submission.id} />
        <input
          className="input"
          defaultValue={submission.score ?? ""}
          max={10}
          min={0}
          name="score"
          placeholder="Score /10"
          required
          type="number"
        />
        <textarea
          className="input min-h-12"
          defaultValue={submission.teacherFeedback ?? ""}
          name="teacher_feedback"
          placeholder="Teacher feedback"
        />
        <button className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Save Review
        </button>
      </form>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
