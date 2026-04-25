import { revalidatePath } from "next/cache";
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
  const isLiveLesson = isUuid(lessonId);
  const isCompleted = view.lesson.status === "completed";

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
            {isCompleted ? (
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground"
              >
                Completed
              </button>
            ) : isLiveLesson ? (
              <form action={markLessonCompleted.bind(null, lessonId)}>
                <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  Mark completed
                </button>
              </form>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground"
              >
                Preview only
              </button>
            )}
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

async function markLessonCompleted(lessonId: string) {
  "use server";

  if (!isUuid(lessonId)) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student") {
    return;
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (studentError || !student) {
    return;
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      student_id: student.id,
      lesson_id: lessonId,
      status: "completed",
      completed_at: now,
      updated_at: now,
    },
    { onConflict: "student_id,lesson_id" },
  );

  if (!error) {
    revalidatePath(`/dashboard/student/lessons/${lessonId}`);
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
