import { DashboardShell } from "@/components/dashboard-nav";
import { Card, MetricCard, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { buildParentReportText } from "@/lib/grade";
import { parentReport } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ParentReportRow = Database["public"]["Tables"]["parent_reports"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type BatchRow = Database["public"]["Tables"]["batches"]["Row"];

type LiveParentReport = ParentReportRow & {
  studentName: string;
  courseName: string;
  batchName: string | null;
};

type ParentDashboardView =
  | {
      mode: "sample";
      message?: string;
    }
  | {
      mode: "empty";
      message: string;
    }
  | {
      mode: "live";
      reports: LiveParentReport[];
    };

export default async function ParentDashboardPage() {
  const view = await getParentDashboardView();

  if (view.mode === "live") {
    return <LiveParentDashboard reports={view.reports} />;
  }

  if (view.mode === "empty") {
    return (
      <DashboardShell role="parent" title="Parent Dashboard">
        <Card>
          <StatusBadge tone="warning">Parent report</StatusBadge>
          <h2 className="mt-4 text-2xl font-semibold">No parent report has been published yet.</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{view.message}</p>
        </Card>
      </DashboardShell>
    );
  }

  return <SampleParentDashboard message={view.message} />;
}

async function getParentDashboardView(): Promise<ParentDashboardView> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      mode: "sample",
      message: "Showing sample parent report preview because Supabase is not configured.",
    };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      mode: "sample",
      message: "Showing sample parent report preview. Log in as a parent to view live reports.",
    };
  }

  if (profile.role !== "parent") {
    return {
      mode: "empty",
      message: "This dashboard is available for registered parent accounts.",
    };
  }

  const { data: parent, error: parentError } = await supabase
    .from("parents")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (parentError) {
    return {
      mode: "sample",
      message: "Showing sample parent report preview because the parent record could not be loaded.",
    };
  }

  if (!parent) {
    return {
      mode: "empty",
      message: "No parent profile is linked to this account yet.",
    };
  }

  const { data: links, error: linksError } = await supabase
    .from("parent_students")
    .select("student_id")
    .eq("parent_id", parent.id);

  if (linksError) {
    return {
      mode: "sample",
      message: "Showing sample parent report preview because linked student records could not be loaded.",
    };
  }

  const studentIds = Array.from(new Set((links ?? []).map((link) => link.student_id)));
  if (!studentIds.length) {
    return {
      mode: "empty",
      message: "No student has been linked to this parent account yet.",
    };
  }

  const { data: reports, error: reportsError } = await supabase
    .from("parent_reports")
    .select("*")
    .in("student_id", studentIds)
    .eq("sent_status", "sent")
    .order("week_start", { ascending: false })
    .limit(5);

  if (reportsError) {
    return {
      mode: "sample",
      message: "Showing sample parent report preview because live reports could not be loaded.",
    };
  }

  if (!reports?.length) {
    return {
      mode: "empty",
      message: "No parent report has been published yet.",
    };
  }

  const courseIds = Array.from(new Set(reports.map((report) => report.course_id)));
  const batchIds = Array.from(
    new Set(reports.map((report) => report.batch_id).filter((id): id is string => Boolean(id))),
  );

  const [coursesResult, batchesResult] = await Promise.all([
    courseIds.length
      ? supabase.from("courses").select("*").in("id", courseIds)
      : Promise.resolve({ data: [] as CourseRow[], error: null }),
    batchIds.length
      ? supabase.from("batches").select("*").in("id", batchIds)
      : Promise.resolve({ data: [] as BatchRow[], error: null }),
  ]);

  const coursesById = new Map((coursesResult.data ?? []).map((course) => [course.id, course]));
  const batchesById = new Map((batchesResult.data ?? []).map((batch) => [batch.id, batch]));

  return {
    mode: "live",
    reports: reports.map((report, index) => ({
      ...report,
      studentName: `Linked student ${index + 1}`,
      courseName: coursesById.get(report.course_id)?.title ?? "GRADE course",
      batchName: report.batch_id ? batchesById.get(report.batch_id)?.name ?? null : null,
    })),
  };
}

function LiveParentDashboard({ reports }: { reports: LiveParentReport[] }) {
  const latest = reports[0];
  const reportText = latest.report_text ?? buildLiveReportText(latest);
  const olderReports = reports.slice(1);

  return (
    <DashboardShell role="parent" title="Parent Dashboard">
      <div className="grid gap-5">
        <Card className="bg-[#eef5e8]">
          <StatusBadge tone="success">Live parent report</StatusBadge>
          <h2 className="mt-4 text-3xl font-semibold leading-tight">
            Weekly academic update for {latest.studentName}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Review the latest published report from GRADE, including task completion, test
            performance, focus areas, and academic feedback.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Child" value={latest.studentName} detail={latest.courseName} />
          <MetricCard
            label="Weekly test"
            value={formatScore(latest.weekly_test_score)}
            detail={`Previous: ${formatScore(latest.previous_week_score)}`}
          />
          <MetricCard
            label="Tasks"
            value={`${latest.tasks_completed}/${latest.tasks_total}`}
            detail="Completed this week"
          />
          <MetricCard
            label="Streak"
            value={`${latest.current_streak} days`}
            detail={latest.leaderboard_rank ? `Rank #${latest.leaderboard_rank}` : "Current streak"}
          />
        </div>

        <Card>
          <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <StatusBadge tone="success">Latest weekly report</StatusBadge>
              <h2 className="mt-4 text-2xl font-semibold leading-tight">{latest.courseName}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatDate(latest.week_start)} to {formatDate(latest.week_end)}
              </p>
            </div>
            <StatusBadge tone="neutral">{latest.batchName ?? "No batch assigned"}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryItem label="Tasks completed" value={`${latest.tasks_completed}/${latest.tasks_total}`} />
            <SummaryItem label="Weekly test score" value={formatScore(latest.weekly_test_score)} />
            <SummaryItem label="Previous week score" value={formatScore(latest.previous_week_score)} />
            <SummaryItem
              label="Leaderboard rank"
              value={latest.leaderboard_rank ? `#${latest.leaderboard_rank}` : "Not provided"}
            />
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <SummaryItem label="Focus this week" value={latest.focus_this_week ?? "Not provided"} />
            <SummaryItem label="Focus next week" value={latest.focus_next_week ?? "Not provided"} />
          </div>

          <div className="mt-5 rounded-2xl border border-primary/15 bg-[#edf7ee] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Academic feedback
            </p>
            <p className="mt-3 whitespace-normal break-words text-sm leading-7 text-foreground">
              {latest.teacher_comment ?? "No academic feedback has been added yet."}
            </p>
          </div>

          {reportText ? (
            <div className="mt-5 rounded-2xl border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Report summary
              </p>
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-foreground">
                {reportText}
              </p>
            </div>
          ) : null}
        </Card>

        {olderReports.length ? (
          <Card>
            <h2 className="text-xl font-semibold">Recent reports</h2>
            <div className="mt-5 grid gap-3">
              {olderReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{report.courseName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(report.week_start)} to {formatDate(report.week_end)}
                      </p>
                    </div>
                    <StatusBadge tone="neutral">{formatStatus(report.sent_status)}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}

function SampleParentDashboard({ message }: { message?: string }) {
  return (
    <DashboardShell role="parent" title="Parent Report Preview">
      <div className="grid gap-5">
        {message ? (
          <Card>
            <p className="text-sm leading-6 text-muted-foreground">{message}</p>
          </Card>
        ) : null}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Child" value={parentReport.studentName} detail={parentReport.courseName} />
          <MetricCard label="GScore signal" value="78.2" detail="Current weekly score" />
          <MetricCard label="Tasks" value={`${parentReport.tasksCompleted}/${parentReport.tasksTotal}`} detail="Completed this week" />
          <MetricCard label="Streak" value={`${parentReport.currentStreak} days`} detail="Current streak" />
        </div>
        <Card>
          <h2 className="text-xl font-semibold">Weekly Report</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SummaryItem label="Course" value={parentReport.courseName} />
            <SummaryItem label="Week" value={parentReport.week} />
            <SummaryItem
              label="Weekly test score"
              value={`${parentReport.weeklyTestScore}%`}
            />
            <SummaryItem
              label="Previous week score"
              value={`${parentReport.previousWeekScore}%`}
            />
            <SummaryItem label="Focus this week" value={parentReport.focusThisWeek} />
            <SummaryItem label="Focus next week" value={parentReport.focusNextWeek} />
          </div>
          <div className="mt-5 rounded-2xl border border-primary/15 bg-[#edf7ee] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Academic feedback
            </p>
            <p className="mt-3 whitespace-normal break-words text-sm leading-7 text-foreground">
              {parentReport.teacherComment}
            </p>
          </div>
          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Report summary
            </p>
            <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-foreground">
              {buildParentReportText(parentReport)}
            </p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 whitespace-normal break-words text-sm leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}

function buildLiveReportText(report: LiveParentReport) {
  return [
    `GRADE Weekly Parent Report`,
    `Student: ${report.studentName}`,
    `Course: ${report.courseName}`,
    `Week: ${formatDate(report.week_start)} - ${formatDate(report.week_end)}`,
    `Tasks completed: ${report.tasks_completed}/${report.tasks_total}`,
    `Weekly test score: ${formatScore(report.weekly_test_score)}`,
    `Previous week score: ${formatScore(report.previous_week_score)}`,
    `Current streak: ${report.current_streak} days`,
    report.leaderboard_rank ? `Leaderboard rank: #${report.leaderboard_rank}` : null,
    `Focus this week: ${report.focus_this_week ?? "Not provided"}`,
    `Next focus: ${report.focus_next_week ?? "Not provided"}`,
    `Academic feedback: ${report.teacher_comment ?? "Not provided"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatScore(value: number | null) {
  return value === null ? "Not provided" : `${Number(value).toFixed(0)}%`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value.replaceAll("_", " ");
}
