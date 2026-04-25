import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { dailyTasks, lessons } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LessonView = {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    status: "locked" | "available" | "completed" | "requires_task" | "requires_quiz";
  };
  task: {
    id: string;
  } | null;
};

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const view = (isUuid(lessonId) ? await getSupabaseLessonView(lessonId) : null) ?? getSampleLessonView(lessonId);
  if (!view) notFound();

  return (
    <DashboardShell role="student" title="Lesson">
      <div className="grid gap-5">
        <Card>
          <StatusBadge tone={view.lesson.status === "completed" ? "success" : "warning"}>
            {view.lesson.status.replace("_", " ")}
          </StatusBadge>
          <h1 className="mt-4 text-3xl font-semibold">{view.lesson.title}</h1>
          <p className="mt-3 text-muted-foreground">{view.lesson.description}</p>
        </Card>
        <Card>
          <div className="aspect-video w-full rounded-md border border-border bg-muted" />
          <p className="mt-4 text-sm text-muted-foreground">
            Video URL support is ready for Supabase lesson records. Preview lessons can be public;
            enrolled-only lessons are protected in dashboard routes.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Mark completed
            </button>
            {view.task ? (
              <ButtonLink href={`/dashboard/student/tasks/${view.task.id}`} variant="secondary">
                Submit related DTU
              </ButtonLink>
            ) : null}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

function getSampleLessonView(lessonId: string): LessonView | null {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return null;
  }

  const task = dailyTasks.find((item) => item.lessonId === lesson.id);

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      status: lesson.status ?? "available",
    },
    task: task ? { id: task.id } : null,
  };
}

async function getSupabaseLessonView(lessonId: string): Promise<LessonView | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, description")
    .eq("id", lessonId)
    .maybeSingle();

  if (lessonError || !lesson) {
    return null;
  }

  const profile = await getCurrentProfile();
  let status: LessonView["lesson"]["status"] = "available";

  if (profile?.role === "student") {
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("profile_id", profile.id)
      .maybeSingle();

    if (studentError) {
      return null;
    }

    if (student) {
      const { data: progress, error: progressError } = await supabase
        .from("lesson_progress")
        .select("status")
        .eq("student_id", student.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (progressError) {
        return null;
      }

      status = progress?.status === "completed" ? "completed" : "available";
    }
  }

  const { data: task, error: taskError } = await supabase
    .from("daily_task_units")
    .select("id")
    .eq("lesson_id", lessonId)
    .order("task_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (taskError) {
    return null;
  }

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      status,
    },
    task: task ? { id: task.id } : null,
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
