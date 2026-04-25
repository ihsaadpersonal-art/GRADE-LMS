"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Quiz } from "@/lib/types";

type SavedAttemptResult = {
  score: number;
  percentage: number;
  passed: boolean;
  submittedAt?: string;
  error?: string;
};

export function QuizPlayer({
  quiz,
  onSubmitAttempt,
}: {
  quiz: Quiz;
  onSubmitAttempt?: (answers: Record<string, string>) => Promise<SavedAttemptResult>;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAttempt, setSavedAttempt] = useState<SavedAttemptResult | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const score = useMemo(() => {
    return quiz.questions.reduce((total, question) => {
      return total + (answers[question.id] === question.correctAnswer ? question.marks : 0);
    }, 0);
  }, [answers, quiz.questions]);

  const total = quiz.questions.reduce((sum, question) => sum + question.marks, 0);
  const percentage = total ? Math.round((score / total) * 100) : 0;

  async function handleSubmit() {
    setSubmitted(true);
    setSaveError(null);

    if (!onSubmitAttempt) {
      return;
    }

    setIsSaving(true);
    const result = await onSubmitAttempt(answers);
    setIsSaving(false);

    if (result.error) {
      setSaveError(result.error);
      return;
    }

    setSavedAttempt(result);
  }

  return (
    <div className="grid gap-4">
      {quiz.questions.map((question, index) => (
        <fieldset key={question.id} className="rounded-lg border border-border bg-card px-5 pt-7 pb-5">
          <legend className="mb-4 font-semibold">
            {index + 1}. {question.questionText}
          </legend>
          <div className="grid gap-2">
            {[
              ["A", question.optionA],
              ["B", question.optionB],
              ["C", question.optionC],
              ["D", question.optionD],
            ]
              .filter(([, label]) => Boolean(label))
              .map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={value}
                    disabled={submitted}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: value ?? "" }))}
                  />
                  <span>
                    {value}. {label}
                  </span>
                </label>
              ))}
          </div>
          {submitted ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Correct answer: {question.correctAnswer}. {question.explanation}
            </p>
          ) : null}
        </fieldset>
      ))}
      {submitted ? (
        <div className="rounded-lg border border-primary/30 bg-[#edf7ee] p-5">
          <CheckCircle2 className="mb-3 size-6 text-primary" aria-hidden="true" />
          <p className="text-xl font-semibold">
            Score: {score}/{total} ({percentage}%)
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Result is ready to feed into weekly GScore once connected to Supabase attempts.
          </p>
          {isSaving ? <p className="mt-3 text-sm font-medium text-primary">Saving attempt...</p> : null}
          {savedAttempt ? (
            <p className="mt-3 text-sm font-medium text-primary">
              Attempt saved. Server score: {savedAttempt.score} ({savedAttempt.percentage}%)
              {savedAttempt.passed ? " - passed" : " - needs recovery"}.
            </p>
          ) : null}
          {saveError ? <p className="mt-3 text-sm font-medium text-danger">{saveError}</p> : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[#164d3a]"
        >
          Submit quiz
        </button>
      )}
    </div>
  );
}
