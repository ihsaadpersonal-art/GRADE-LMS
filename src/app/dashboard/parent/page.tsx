import { DashboardShell } from "@/components/dashboard-nav";
import { ReportCopy } from "@/components/report-copy";
import { Card, MetricCard } from "@/components/ui";
import { buildParentReportText } from "@/lib/grade";
import { parentReport } from "@/lib/sample-data";

export default function ParentDashboardPage() {
  return (
    <DashboardShell role="parent" title="Parent Report Preview">
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Child" value={parentReport.studentName} detail={parentReport.courseName} />
          <MetricCard label="GScore signal" value="78.2" detail="Current weekly score" />
          <MetricCard label="Tasks" value={`${parentReport.tasksCompleted}/${parentReport.tasksTotal}`} detail="Completed this week" />
          <MetricCard label="Streak" value={`${parentReport.currentStreak} days`} detail="Current streak" />
        </div>
        <Card>
          <h2 className="text-xl font-semibold">Weekly Report</h2>
          <div className="mt-5">
            <ReportCopy text={buildParentReportText(parentReport)} />
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
