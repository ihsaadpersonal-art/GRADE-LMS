import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { atRiskStudents } from "@/lib/sample-data";

export default function AdminAtRiskPage() {
  return (
    <DashboardShell role="admin" title="At-Risk Students">
      <div className="grid gap-4">
        {atRiskStudents.map((student) => (
          <Card key={student.studentName}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <StatusBadge tone="danger">Recovery needed</StatusBadge>
                <h2 className="mt-3 text-xl font-semibold">{student.studentName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{student.course}</p>
                <p className="mt-3 font-medium">{student.reason}</p>
              </div>
              <dl className="grid gap-2 text-sm text-muted-foreground">
                <div>Last submission: {student.lastSubmission}</div>
                <div>Parent: {student.parentContact}</div>
                <div>Teacher: {student.teacher}</div>
              </dl>
            </div>
            <div className="mt-5 rounded-md border border-border bg-background p-4">
              <p className="text-sm font-semibold">Suggested action</p>
              <p className="mt-1 text-sm text-muted-foreground">{student.suggestedAction}</p>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
