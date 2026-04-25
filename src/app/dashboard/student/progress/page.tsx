import { DashboardShell } from "@/components/dashboard-nav";
import { Card, MetricCard } from "@/components/ui";
import { gscoreBreakdown } from "@/lib/grade";
import { gscores } from "@/lib/sample-data";

export default function StudentProgressPage() {
  const gscore = gscores[0];

  return (
    <DashboardShell role="student" title="Student Progress">
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="GScore" value={gscore.totalGscore} detail="Current week" />
          <MetricCard label="Task completion" value={`${gscore.dtuSubmissionRate}%`} detail="Assigned DTUs" />
          <MetricCard label="Quiz average" value={`${gscore.weeklyQuizPercentage}%`} detail="Weekly tests" />
        </div>
        <Card>
          <h2 className="text-xl font-semibold">GScore Breakdown</h2>
          <div className="mt-5 grid gap-4">
            {gscoreBreakdown(gscore).map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}% · weight {item.weight}</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-muted">
                  <div className="h-3 rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Weak Subjects and Teacher Comments</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Physics graph interpretation and Chemistry mole basics need focus next week.
            Teacher comment: consistent work, but show all units in written solutions.
          </p>
        </Card>
      </div>
    </DashboardShell>
  );
}
