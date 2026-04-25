import { DashboardShell } from "@/components/dashboard-nav";
import { ReportCopy } from "@/components/report-copy";
import { Card } from "@/components/ui";
import { buildParentReportText } from "@/lib/grade";
import { parentReport } from "@/lib/sample-data";

export default function AdminReportsPage() {
  const reportText = buildParentReportText(parentReport);

  return (
    <DashboardShell role="admin" title="Parent Report Generator">
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
    </DashboardShell>
  );
}
