import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";
import { dailyTasks, lessons } from "@/lib/sample-data";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) notFound();

  const task = dailyTasks.find((item) => item.lessonId === lesson.id);

  return (
    <DashboardShell role="student" title="Lesson">
      <div className="grid gap-5">
        <Card>
          <StatusBadge tone={lesson.status === "completed" ? "success" : "warning"}>
            {lesson.status?.replace("_", " ")}
          </StatusBadge>
          <h1 className="mt-4 text-3xl font-semibold">{lesson.title}</h1>
          <p className="mt-3 text-muted-foreground">{lesson.description}</p>
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
            {task ? (
              <ButtonLink href={`/dashboard/student/tasks/${task.id}`} variant="secondary">
                Submit related DTU
              </ButtonLink>
            ) : null}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
