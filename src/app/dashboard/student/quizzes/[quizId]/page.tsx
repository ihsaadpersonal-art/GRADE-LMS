import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";
import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { quizzes } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Quiz } from "@/lib/types";

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = (isUuid(quizId) ? await getSupabaseQuiz(quizId) : null) ?? getSampleQuiz(quizId);
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

function getSampleQuiz(quizId: string) {
  return quizzes.find((item) => item.id === quizId) ?? null;
}

async function getSupabaseQuiz(quizId: string): Promise<Quiz | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, course_id, module_id, lesson_id, title, description, quiz_type, pass_mark, duration_minutes")
    .eq("id", quizId)
    .eq("is_published", true)
    .maybeSingle();

  if (quizError || !quiz || !quiz.module_id) {
    return null;
  }

  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, explanation, marks")
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  if (questionsError || !questions?.length) {
    return null;
  }

  return {
    id: quiz.id,
    courseId: quiz.course_id,
    moduleId: quiz.module_id,
    lessonId: quiz.lesson_id ?? undefined,
    title: quiz.title,
    description: quiz.description ?? "",
    quizType: quiz.quiz_type,
    passMark: quiz.pass_mark,
    durationMinutes: quiz.duration_minutes ?? undefined,
    questions: questions.map((question) => ({
      id: question.id,
      questionText: question.question_text,
      questionType: question.question_type,
      optionA: question.option_a ?? "",
      optionB: question.option_b ?? "",
      optionC: question.option_c ?? undefined,
      optionD: question.option_d ?? undefined,
      correctAnswer: question.correct_answer ?? "",
      explanation: question.explanation ?? "",
      marks: question.marks,
    })),
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
