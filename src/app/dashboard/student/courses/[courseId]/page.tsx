import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";
import { courses, lessons, modules } from "@/lib/sample-data";

export default async function StudentCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = courses.find((item) => item.id === courseId);
  if (!course) notFound();

  const courseModules = modules.filter((module) => module.courseId === courseId);
  const courseLessons = lessons.filter((lesson) => lesson.courseId === courseId);
  const completed = courseLessons.filter((lesson) => lesson.status === "completed").length;
  const progress = Math.round((completed / courseLessons.length) * 100);

  return (
    <DashboardShell role="student" title={course.title}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Course progress</p>
              <p className="mt-2 text-3xl font-semibold">{progress}%</p>
            </div>
            <div className="h-3 w-full rounded-full bg-muted sm:max-w-sm">
              <div className="h-3 rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </Card>
        {courseModules.map((module) => (
          <Card key={module.id}>
            <h2 className="text-xl font-semibold">{module.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
            <div className="mt-5 grid gap-3">
              {courseLessons
                .filter((lesson) => lesson.moduleId === module.id)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col gap-3 rounded-md border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{lesson.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        tone={
                          lesson.status === "completed"
                            ? "success"
                            : lesson.status === "locked"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {lesson.status?.replace("_", " ")}
                      </StatusBadge>
                      {lesson.status !== "locked" ? (
                        <ButtonLink href={`/dashboard/student/lessons/${lesson.id}`} variant="secondary">
                          Open
                        </ButtonLink>
                      ) : null}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
