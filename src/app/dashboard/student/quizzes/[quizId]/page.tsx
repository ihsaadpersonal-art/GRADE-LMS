import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";
import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { quizzes } from "@/lib/sample-data";

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = quizzes.find((item) => item.id === quizId);
  if (!quiz) notFound();

  return (
    <DashboardShell role="student" title={quiz.title}>
      <div className="grid gap-5">
        <Card>
          <StatusBadge tone="success">{quiz.quizType}</StatusBadge>
          <h1 className="mt-4 text-2xl font-semibold">{quiz.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{quiz.description}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Pass mark: {quiz.passMark}% {quiz.durationMinutes ? `· Duration: ${quiz.durationMinutes} minutes` : null}
          </p>
        </Card>
        <QuizPlayer quiz={quiz} />
      </div>
    </DashboardShell>
  );
}
