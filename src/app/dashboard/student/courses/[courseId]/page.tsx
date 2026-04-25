import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { courses, lessons, modules } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CourseView = {
  course: {
    id: string;
    title: string;
  };
  modules: {
    id: string;
    title: string;
    description: string | null;
  }[];
  lessons: {
    id: string;
    moduleId: string;
    title: string;
    description: string | null;
    status: "locked" | "available" | "completed" | "requires_task" | "requires_quiz";
  }[];
  progress: number;
};

export default async function StudentCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const view = (isUuid(courseId) ? await getSupabaseCourseView(courseId) : null) ?? getSampleCourseView(courseId);

  if (!view) notFound();

  return (
    <DashboardShell role="student" title={view.course.title}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Course progress</p>
              <p className="mt-2 text-3xl font-semibold">{view.progress}%</p>
            </div>
            <div className="h-3 w-full rounded-full bg-muted sm:max-w-sm">
              <div className="h-3 rounded-full bg-primary" style={{ width: `${view.progress}%` }} />
            </div>
          </div>
        </Card>
        {view.modules.map((module) => (
          <Card key={module.id}>
            <h2 className="text-xl font-semibold">{module.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
            <div className="mt-5 grid gap-3">
              {view.lessons
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

function getSampleCourseView(courseId: string): CourseView | null {
  const course = courses.find((item) => item.id === courseId);
  if (!course) {
    return null;
  }

  const courseModules = modules
    .filter((module) => module.courseId === courseId)
    .map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
    }));
  const courseLessons = lessons
    .filter((lesson) => lesson.courseId === courseId)
    .map((lesson) => ({
      id: lesson.id,
      moduleId: lesson.moduleId,
      title: lesson.title,
      description: lesson.description,
      status: lesson.status ?? "available",
    }));
  const completed = courseLessons.filter((lesson) => lesson.status === "completed").length;

  return {
    course: {
      id: course.id,
      title: course.title,
    },
    modules: courseModules,
    lessons: courseLessons,
    progress: getProgress(completed, courseLessons.length),
  };
}

async function getSupabaseCourseView(courseId: string): Promise<CourseView | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student") {
    return null;
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (studentError || !student) {
    return null;
  }

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", student.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (enrollmentError || !enrollment) {
    return null;
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course) {
    return null;
  }

  const { data: courseModules, error: modulesError } = await supabase
    .from("modules")
    .select("id, title, description")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (modulesError || !courseModules) {
    return null;
  }

  const moduleIds = courseModules.map((module) => module.id);
  const { data: courseLessons, error: lessonsError } = moduleIds.length
    ? await supabase
        .from("lessons")
        .select("id, module_id, title, description")
        .eq("course_id", courseId)
        .in("module_id", moduleIds)
        .order("order_index", { ascending: true })
    : { data: [], error: null };

  if (lessonsError || !courseLessons) {
    return null;
  }

  const lessonIds = courseLessons.map((lesson) => lesson.id);
  const { data: lessonProgress, error: progressError } = lessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, status")
        .eq("student_id", student.id)
        .in("lesson_id", lessonIds)
    : { data: [], error: null };

  if (progressError || !lessonProgress) {
    return null;
  }

  const progressByLesson = new Map(lessonProgress.map((item) => [item.lesson_id, item.status]));
  const normalizedLessons = courseLessons.map((lesson) => {
    const status = progressByLesson.get(lesson.id);
    return {
      id: lesson.id,
      moduleId: lesson.module_id,
      title: lesson.title,
      description: lesson.description,
      status: status === "completed" ? "completed" : "available",
    } satisfies CourseView["lessons"][number];
  });

  const completed = normalizedLessons.filter((lesson) => lesson.status === "completed").length;

  return {
    course,
    modules: courseModules,
    lessons: normalizedLessons,
    progress: getProgress(completed, normalizedLessons.length),
  };
}

function getProgress(completed: number, total: number) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
