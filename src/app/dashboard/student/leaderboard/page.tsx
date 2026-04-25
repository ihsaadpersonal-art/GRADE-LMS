import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { leaderboard } from "@/lib/sample-data";

export default function StudentLeaderboardPage() {
  return (
    <DashboardShell role="student" title="Leaderboard">
      <Card>
        <h2 className="text-xl font-semibold">Weekly Leaderboard</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Rank</th>
                <th>Student</th>
                <th>GScore</th>
                <th>Streak</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.studentId} className="border-t border-border">
                  <td className="py-3 font-semibold">#{entry.rank}</td>
                  <td>{entry.consentPublicLeaderboard ? entry.studentName : `Student #${entry.rank + 12}`}</td>
                  <td>{entry.totalGscore}</td>
                  <td>{entry.streak} days</td>
                  <td>{entry.label ? <StatusBadge tone="success">{entry.label}</StatusBadge> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
