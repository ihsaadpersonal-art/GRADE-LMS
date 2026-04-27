import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-nav";
import { ReportCopy } from "@/components/report-copy";
import { Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { buildParentReportText } from "@/lib/grade";
import { parentReport } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["enrollments"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type BatchRow = Database["public"]["Tables"]["batches"]["Row"];
type ParentReportRow = Database["public"]["Tables"]["parent_reports"]["Row"];

type ReportStatus = ParentReportRow["sent_status"];

type EnrollmentOption = {
  enrollment: EnrollmentRow;
  student: StudentRow | null;
  profile: ProfileRow | null;
  course: CourseRow | null;
  batch: BatchRow | null;
};

type RecentReport = ParentReportRow & {
  studentName: string;
  courseName: string;
};

type ReportsView =
  | {
      mode: "live";
      enrollmentOptions: EnrollmentOption[];
      recentReports: RecentReport[];
    }
  | {
      mode: "sample";
      message: string;
    };

const reportStatuses = ["draft", "sent", "not_sent"] as const;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const query = await searchParams;
  const error = getSingleParam(query.error);
  const view = (await getReportsView()) ?? {
    mode: "sample" as const,
    message: "Showing sample report generator preview because live Supabase data is unavailable.",
  };

  if (view.mode === "live") {
    return <LiveAdminReportsPage error={error} view={view} />;
  }

  return <SampleReportsPage message={view.message} />;
}

async function createParentReport(formData: FormData) {
  "use server";

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const weekStart = String(formData.get("week_start") ?? "");
  const weekEnd = String(formData.get("week_end") ?? "");
  const sentStatus = String(formData.get("sent_status") ?? "");

  if (!enrollmentId) {
    redirectWithReportError("Select an enrolled student before creating a report.");
  }

  const dateValidation = validateReportDates(weekStart, weekEnd);
  if (dateValidation) {
    redirectWithReportError(dateValidation);
  }

  if (!isReportStatus(sentStatus)) {
    redirectWithReportError("Choose a valid report status.");
  }

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (enrollmentError || !enrollment) {
    redirectWithReportError("The selected enrolment could not be found.");
  }

  const tasksCompleted = parseIntegerInRange(formData.get("tasks_completed"), 0, 100);
  const tasksTotal = parseIntegerInRange(formData.get("tasks_total"), 1, 100);
  const weeklyTestScore = parseNumberInRange(formData.get("weekly_test_score"), 0, 100);
  const previousWeekScore = parseOptionalNumberInRange(
    formData.get("previous_week_score"),
    0,
    100,
  );
  const currentStreak = parseIntegerInRange(formData.get("current_streak"), 0, 365);
  const leaderboardRank = parseOptionalIntegerInRange(formData.get("leaderboard_rank"), 1, 999);
  const focusThisWeek = getRequiredText(formData.get("focus_this_week"), 10);
  const focusNextWeek = getRequiredText(formData.get("focus_next_week"), 10);
  const teacherComment = getRequiredText(formData.get("teacher_comment"), 10);
  const reportText = getRequiredText(formData.get("report_text"), 30);

  if (tasksTotal === null) {
    redirectWithReportError("Tasks total must be between 1 and 100.");
  }

  if (tasksCompleted === null || tasksCompleted > tasksTotal) {
    redirectWithReportError("Tasks completed must be between 0 and the tasks total.");
  }

  if (weeklyTestScore === null) {
    redirectWithReportError("Weekly test score must be between 0 and 100.");
  }

  if (previousWeekScore === undefined) {
    redirectWithReportError("Previous week score must be between 0 and 100 when provided.");
  }

  if (currentStreak === null) {
    redirectWithReportError("Current streak must be between 0 and 365 days.");
  }

  if (leaderboardRank === undefined) {
    redirectWithReportError("Leaderboard rank must be between 1 and 999 when provided.");
  }

  if (!focusThisWeek) {
    redirectWithReportError("Focus this week must be at least 10 characters.");
  }

  if (!focusNextWeek) {
    redirectWithReportError("Focus next week must be at least 10 characters.");
  }

  if (!teacherComment) {
    redirectWithReportError("Teacher comment must be at least 10 characters.");
  }

  if (!reportText) {
    redirectWithReportError("Report text must be at least 30 characters.");
  }

  const { error: insertError } = await supabase.from("parent_reports").insert({
    student_id: enrollment.student_id,
    course_id: enrollment.course_id,
    batch_id: enrollment.batch_id,
    week_start: weekStart,
    week_end: weekEnd,
    tasks_completed: tasksCompleted,
    tasks_total: tasksTotal,
    weekly_test_score: weeklyTestScore,
    previous_week_score: previousWeekScore,
    current_streak: currentStreak,
    leaderboard_rank: leaderboardRank,
    focus_this_week: focusThisWeek,
    focus_next_week: focusNextWeek,
    teacher_comment: teacherComment,
    report_text: reportText,
    sent_status: sentStatus,
    sent_at: sentStatus === "sent" ? new Date().toISOString() : null,
  });

  if (insertError) {
    redirectWithReportError("The report could not be saved. Please check the fields and try again.");
  }

  revalidatePath("/dashboard/admin/reports");
  redirect("/dashboard/admin/reports");
}

async function getReportsView(): Promise<ReportsView | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return null;
  }

  const [
    studentsResult,
    profilesResult,
    enrollmentsResult,
    coursesResult,
    batchesResult,
    reportsResult,
  ] = await Promise.all([
    supabase.from("students").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*"),
    supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
    supabase.from("courses").select("*"),
    supabase.from("batches").select("*"),
    supabase.from("parent_reports").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  if (
    studentsResult.error ||
    profilesResult.error ||
    enrollmentsResult.error ||
    coursesResult.error ||
    batchesResult.error ||
    reportsResult.error
  ) {
    return null;
  }

  const studentsById = new Map((studentsResult.data ?? []).map((student) => [student.id, student]));
  const profilesById = new Map((profilesResult.data ?? []).map((profile) => [profile.id, profile]));
  const coursesById = new Map((coursesResult.data ?? []).map((course) => [course.id, course]));
  const batchesById = new Map((batchesResult.data ?? []).map((batch) => [batch.id, batch]));

  const enrollmentOptions = (enrollmentsResult.data ?? []).map((enrollment) => {
    const student = studentsById.get(enrollment.student_id) ?? null;
    const profile = student?.profile_id ? profilesById.get(student.profile_id) ?? null : null;

    return {
      enrollment,
      student,
      profile,
      course: coursesById.get(enrollment.course_id) ?? null,
      batch: enrollment.batch_id ? batchesById.get(enrollment.batch_id) ?? null : null,
    };
  });

  const recentReports = (reportsResult.data ?? []).map((report) => {
    const student = studentsById.get(report.student_id) ?? null;
    const profile = student?.profile_id ? profilesById.get(student.profile_id) ?? null : null;

    return {
      ...report,
      studentName: profile?.full_name ?? student?.student_code ?? "Student",
      courseName: coursesById.get(report.course_id)?.title ?? "GRADE course",
    };
  });

  return {
    mode: "live",
    enrollmentOptions,
    recentReports,
  };
}

function LiveAdminReportsPage({
  error,
  view,
}: {
  error?: string;
  view: Extract<ReportsView, { mode: "live" }>;
}) {
  return (
    <DashboardShell role="admin" title="Parent Report Generator">
      <div className="grid gap-5">
        <Card className="bg-[#eef5e8]">
          <StatusBadge tone="success">Live report creation</StatusBadge>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">Create a parent report</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Create manual weekly reports for linked parent dashboards. Parents can only see reports
            marked as sent.
          </p>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <h2 className="text-xl font-semibold">Report Inputs</h2>
            {error ? (
              <p className="mt-4 rounded-xl border border-danger/20 bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-danger">
                {error}
              </p>
            ) : null}
            {view.enrollmentOptions.length ? (
              <form action={createParentReport} className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold">
                  Enrolled student
                  <select
                    className="min-h-12 rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                    defaultValue=""
                    name="enrollmentId"
                    required
                  >
                    <option disabled value="">
                      Select an enrolled student and course
                    </option>
                    {view.enrollmentOptions.map((option) => (
                      <option key={option.enrollment.id} value={option.enrollment.id}>
                        {formatEnrollmentOption(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Week start" name="week_start" required type="date" />
                  <TextInput label="Week end" name="week_end" required type="date" />
                  <TextInput label="Tasks completed" max="100" min="0" name="tasks_completed" required type="number" />
                  <TextInput label="Tasks total" max="100" min="1" name="tasks_total" required type="number" />
                  <TextInput label="Weekly test score" max="100" min="0" name="weekly_test_score" required type="number" />
                  <TextInput label="Previous week score" max="100" min="0" name="previous_week_score" type="number" />
                  <TextInput label="Current streak" max="365" min="0" name="current_streak" required type="number" />
                  <TextInput label="Leaderboard rank" max="999" min="1" name="leaderboard_rank" type="number" />
                </div>

                <TextareaInput
                  label="Focus this week"
                  minLength={10}
                  name="focus_this_week"
                  placeholder="Summarise the main academic focus for this week."
                  required
                  rows={3}
                />
                <TextareaInput
                  label="Focus next week"
                  minLength={10}
                  name="focus_next_week"
                  placeholder="Mention the next priority area for the student."
                  required
                  rows={3}
                />
                <TextareaInput
                  label="Teacher comment"
                  minLength={10}
                  name="teacher_comment"
                  placeholder="Add a concise, parent-friendly academic comment."
                  required
                  rows={4}
                />
                <TextareaInput
                  label="WhatsApp/report text"
                  minLength={30}
                  name="report_text"
                  placeholder="Write the parent-ready report message. Include progress, focus, and a clear next step."
                  required
                  rows={6}
                />

                <label className="grid gap-2 text-sm font-semibold">
                  Report status
                  <select
                    className="min-h-12 rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                    defaultValue="draft"
                    name="sent_status"
                  >
                    {reportStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatReportStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>

                <p className="rounded-xl border border-border bg-muted px-4 py-3 text-xs leading-5 text-muted-foreground">
                  Only reports marked as Sent to parent will appear in the parent dashboard.
                </p>

                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-[#104d36]"
                  type="submit"
                >
                  Create parent report
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                No enrolled students found. Create or activate an enrolment before generating a
                parent report.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Recent parent reports</h2>
            <div className="mt-5 grid gap-3">
              {view.recentReports.length ? (
                view.recentReports.map((report) => <RecentReportCard key={report.id} report={report} />)
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  No parent reports have been created yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function SampleReportsPage({ message }: { message: string }) {
  const reportText = buildParentReportText(parentReport);

  return (
    <DashboardShell role="admin" title="Parent Report Generator">
      <div className="grid gap-5">
        <Card>
          <p className="text-sm leading-6 text-muted-foreground">{message}</p>
        </Card>
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <h2 className="text-xl font-semibold">Report Inputs</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium">
                Student
                <select className="input">
                  <option>{parentReport.studentName}</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Course
                <select className="input">
                  <option>{parentReport.courseName}</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Week
                <input className="input" value={parentReport.week} readOnly />
              </label>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">WhatsApp-Ready Report</h2>
            <div className="mt-5">
              <ReportCopy text={reportText} />
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function RecentReportCard({ report }: { report: RecentReport }) {
  const whatsappMessage = report.report_text ?? buildWhatsAppReportText(report);

  return (
    <article className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-words font-semibold">{report.studentName}</h3>
          <p className="mt-1 break-words text-sm text-muted-foreground">{report.courseName}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDate(report.week_start)} to {formatDate(report.week_end)}
          </p>
        </div>
        <StatusBadge tone={report.sent_status === "sent" ? "success" : "warning"}>
          {formatReportStatusLabel(report.sent_status)}
        </StatusBadge>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Detail label="Tasks" value={`${report.tasks_completed}/${report.tasks_total}`} />
        <Detail label="Weekly test score" value={formatScore(report.weekly_test_score)} />
        <Detail label="Created" value={formatDateTime(report.created_at)} />
        <Detail label="Streak" value={`${report.current_streak} days`} />
      </div>
      <div className="mt-4 rounded-2xl border border-border bg-card p-4">
        <h4 className="text-sm font-semibold">WhatsApp-ready message</h4>
        <div className="mt-3">
          <ReportCopy text={whatsappMessage} />
        </div>
      </div>
    </article>
  );
}

function TextInput({
  label,
  name,
  required,
  type,
  min,
  max,
}: {
  label: string;
  name: string;
  required?: boolean;
  type: "date" | "number";
  min?: string;
  max?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input
        className="min-h-12 rounded-xl border border-border bg-background px-3 text-sm text-foreground"
        max={max}
        min={min}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function TextareaInput({
  label,
  name,
  rows,
  placeholder,
  required,
  minLength,
}: {
  label: string;
  name: string;
  rows: number;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <textarea
        className="resize-y rounded-xl border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground"
        minLength={minLength}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

function formatEnrollmentOption(option: EnrollmentOption) {
  const studentName = option.profile?.full_name ?? option.student?.student_code ?? "Student";
  const email = option.profile?.email ?? "No email";
  const code = option.student?.student_code ?? "No code";
  const course = option.course?.title ?? "Course";
  const batch = option.batch?.name ?? "No batch";

  return `${studentName} / ${email} / ${code} - ${course} - ${batch} - Enrolment: ${formatStatus(option.enrollment.enrollment_status)} - Payment: ${formatStatus(option.enrollment.payment_status)}`;
}

function isReportStatus(status: string): status is ReportStatus {
  return reportStatuses.includes(status as ReportStatus);
}

function parseIntegerInRange(value: FormDataEntryValue | null, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

function parseOptionalIntegerInRange(value: FormDataEntryValue | null, min: number, max: number) {
  if (value === null || String(value).trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : undefined;
}

function parseNumberInRange(value: FormDataEntryValue | null, min: number, max: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function parseOptionalNumberInRange(value: FormDataEntryValue | null, min: number, max: number) {
  if (value === null || String(value).trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : undefined;
}

function getRequiredText(value: FormDataEntryValue | null, minLength: number) {
  const text = String(value ?? "").trim();
  return text.length >= minLength ? text : null;
}

function validateReportDates(weekStart: string, weekEnd: string) {
  const start = parseReportDate(weekStart);
  const end = parseReportDate(weekEnd);

  if (!start) {
    return "Week start is required and must be a valid date.";
  }

  if (!end) {
    return "Week end is required and must be a valid date.";
  }

  if (start.year < 2025 || start.year > 2030) {
    return "Week start year must be between 2025 and 2030.";
  }

  if (end.year < 2025 || end.year > 2030) {
    return "Week end year must be between 2025 and 2030.";
  }

  if (end.time < start.time) {
    return "Week end must be the same day as, or after, week start.";
  }

  return null;
}

function parseReportDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    year: date.getUTCFullYear(),
    time: date.getTime(),
  };
}

function redirectWithReportError(message: string): never {
  redirect(`/dashboard/admin/reports?error=${encodeURIComponent(message)}`);
}

function getSingleParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatReportStatusLabel(status: ReportStatus) {
  if (status === "sent") {
    return "Sent to parent";
  }

  if (status === "not_sent") {
    return "Not sent";
  }

  return "Draft";
}

function buildWhatsAppReportText(report: RecentReport) {
  return [
    "GRADE Weekly Report",
    `Student: ${report.studentName}`,
    `Programme: ${report.courseName}`,
    `Week: ${formatDate(report.week_start)} - ${formatDate(report.week_end)}`,
    "",
    `Tasks Completed: ${report.tasks_completed}/${report.tasks_total}`,
    `Weekly Test Score: ${formatScoreForMessage(report.weekly_test_score)}`,
    `Previous Week Score: ${formatScoreForMessage(report.previous_week_score)}`,
    `Current Streak: ${report.current_streak} days`,
    "",
    `This week's focus: ${report.focus_this_week ?? "Not provided"}`,
    `Next week's focus: ${report.focus_next_week ?? "Not provided"}`,
    "",
    "Teacher Comment:",
    report.teacher_comment ?? "Not provided",
    "",
    "- GRADE Academic Team",
  ].join("\n");
}

function formatScoreForMessage(value: number | null) {
  return value === null ? "Not provided" : `${Number(value).toFixed(0)}/100`;
}

function formatScore(value: number | null) {
  return value === null ? "Not provided" : `${Number(value).toFixed(0)}%`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
