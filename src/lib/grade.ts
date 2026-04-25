import type { GScore, ParentReport } from "@/lib/types";

export function calculateGScore(input: {
  dtuSubmissionRate: number;
  weeklyQuizPercentage: number;
  lessonCompletionRate: number;
  streakScore: number;
  teacherEffortScore: number;
}) {
  return Number(
    (
      input.dtuSubmissionRate * 0.3 +
      input.weeklyQuizPercentage * 0.3 +
      input.lessonCompletionRate * 0.15 +
      input.streakScore * 0.15 +
      input.teacherEffortScore * 0.1
    ).toFixed(1),
  );
}

export function gscoreBreakdown(gscore: GScore) {
  return [
    { label: "DTU submission", value: gscore.dtuSubmissionRate, weight: "30%" },
    { label: "Weekly quiz", value: gscore.weeklyQuizPercentage, weight: "30%" },
    { label: "Lesson completion", value: gscore.lessonCompletionRate, weight: "15%" },
    { label: "Streak", value: gscore.streakScore, weight: "15%" },
    { label: "Teacher effort", value: gscore.teacherEffortScore, weight: "10%" },
  ];
}

export function buildParentReportText(report: ParentReport, withEmoji = false) {
  const title = withEmoji ? "GRADE Weekly Report" : "GRADE Weekly Report";

  return `${title} - ${report.studentName}
Week: ${report.week}
Programme: ${report.courseName}

Tasks Completed: ${report.tasksCompleted}/${report.tasksTotal}
Weekly Test Score: ${report.weeklyTestScore}/100
Previous Week Score: ${report.previousWeekScore}/100
Current Streak: ${report.currentStreak} days
Leaderboard Rank: #${report.leaderboardRank} of ${report.totalStudents}

This week's focus: ${report.focusThisWeek}
Next week's focus: ${report.focusNextWeek}

Teacher Comment:
${report.teacherComment}

- GRADE Academic Team`;
}
