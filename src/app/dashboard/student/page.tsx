import {
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  LineChart,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, MetricCard, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { courses, dailyTasks, gscores, lessons, quizzes } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { percent } from "@/lib/utils";

type DashboardView = {
  course: {
    id: string;
    title: string;
    description: string;
  };
  task: {
    id: string;
    title: string;
    status: string;
  } | null;
  quiz: {
    id: string;
    title: string;
  } | null;
  nextLessonId: string | null;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  gscore: number;
  weeklyQuizPercentage: number;
  streakDetail: string;
  quizPerformanceDetail: string;
  leaderboardDetail: string;
  upcomingClassDetail: string;
  teacherFeedbackDetail: string;
};

export default async function StudentDashboardPage() {
  const view = (await getSupabaseDashboardView()) ?? getSampleDashboardView();

  return (
    <DashboardShell role="student" title="Student Dashboard">
      <div className="grid gap-6">
        <Card className="overflow-hidden bg-[#eef5e8] p-0">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <StatusBadge tone="success">Welcome back</StatusBadge>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Keep today&apos;s study streak moving.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Continue your course, submit today&apos;s Daily Task Unit, and check how your
                GScore is improving this week.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-medium text-muted-foreground">Course progress</p>
              <p className="mt-2 text-4xl font-semibold">{view.progress}%</p>
              <div className="mt-4 h-3 w-56 max-w-full rounded-full bg-muted">
                <div className="h-3 rounded-full bg-primary" style={{ width: `${view.progress}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Current GScore"
            value={view.gscore}
            detail="Weekly score out of 100"
            tone="accent"
          />
          <MetricCard label="Current streak" value={view.streakDetail} detail="Consistency this week" />
          <MetricCard label="Weekly quiz" value={percent(view.weeklyQuizPercentage)} detail={view.quiz?.title ?? "No quiz assigned yet"} />
          <MetricCard label="Lessons completed" value={`${view.completedLessons}/${view.totalLessons}`} detail="Course progress" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <StatusBadge tone="success">Enrolled course</StatusBadge>
                <h2 className="mt-3 text-2xl font-semibold">{view.course.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{view.course.description}</p>
              </div>
              <BookOpen className="size-8 text-primary" aria-hidden="true" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/dashboard/student/courses/${view.course.id}`}>Continue Course</ButtonLink>
              {view.nextLessonId ? (
                <ButtonLink href={`/dashboard/student/lessons/${view.nextLessonId}`} variant="secondary">
                  Continue Lesson
                </ButtonLink>
              ) : null}
              {view.quiz ? (
                <ButtonLink href={`/dashboard/student/quizzes/${view.quiz.id}`} variant="secondary">
                  Take Quiz
                </ButtonLink>
              ) : null}
            </div>
          </Card>
          <Card className="border-accent/30 bg-[#fff9eb]">
            <ClipboardCheck className="mb-4 size-7 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Today&apos;s DTU</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {view.task?.title ?? "No Daily Task Unit assigned yet."}
            </p>
            <div className="mt-4">
              <StatusBadge tone="warning">{view.task?.status.replace("_", " ") ?? "not assigned"}</StatusBadge>
            </div>
            {view.task ? (
              <div className="mt-5">
                <ButtonLink href={`/dashboard/student/tasks/${view.task.id}`} variant="secondary">
                  Submit Today&apos;s Task
                </ButtonLink>
              </div>
            ) : null}
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={<LineChart className="size-5" />} title="Quiz performance" detail={view.quizPerformanceDetail} />
          <InfoCard icon={<Trophy className="size-5" />} title="Leaderboard rank" detail={view.leaderboardDetail} />
          <InfoCard icon={<CalendarClock className="size-5" />} title="Upcoming class" detail={view.upcomingClassDetail} />
          <InfoCard icon={<MessageSquare className="size-5" />} title="Teacher feedback" detail={view.teacherFeedbackDetail} />
        </div>
      </div>
    </DashboardShell>
  );
}

function getSampleDashboardView(): DashboardView {
  const course = courses[0];
  const task = dailyTasks[0];
  const gscore = gscores[0];
  const quiz = quizzes[0];
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
  const progress = Math.round((completedLessons / lessons.length) * 100);

  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
    },
    task: {
      id: task.id,
      title: task.title,
      status: task.status,
    },
    quiz: {
      id: quiz.id,
      title: quiz.title,
    },
    nextLessonId: lessons.find((lesson) => lesson.status !== "completed")?.id ?? null,
    progress,
    completedLessons,
    totalLessons: lessons.length,
    gscore: gscore.totalGscore,
    weeklyQuizPercentage: gscore.weeklyQuizPercentage,
    streakDetail: "5 days",
    quizPerformanceDetail: "Baseline diagnostic: 78%",
    leaderboardDetail: "#1 this week",
    upcomingClassDetail: "Physics bridge, Sunday 8:00 PM",
    teacherFeedbackDetail: "Good consistency. Improve unit writing.",
  };
}

async function getSupabaseDashboardView(): Promise<DashboardView | null> {
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
    .select("course_id, batch_id")
    .eq("student_id", student.id)
    .eq("enrollment_status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (enrollmentError || !enrollment) {
    return null;
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, description")
    .eq("id", enrollment.course_id)
    .maybeSingle();

  if (courseError || !course) {
    return null;
  }

  const { data: courseModules, error: modulesError } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  if (modulesError || !courseModules) {
    return null;
  }

  const moduleIds = courseModules.map((module) => module.id);
  const { data: courseLessons, error: lessonsError } = moduleIds.length
    ? await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", course.id)
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

  const completedLessonIds = new Set(
    lessonProgress.filter((item) => item.status === "completed").map((item) => item.lesson_id),
  );
  const completedLessons = completedLessonIds.size;
  const totalLessons = courseLessons.length;
  const nextLessonId = courseLessons.find((lesson) => !completedLessonIds.has(lesson.id))?.id ?? courseLessons[0]?.id ?? null;

  const { data: task } = await supabase
    .from("daily_task_units")
    .select("id, title")
    .eq("course_id", course.id)
    .or(enrollment.batch_id ? `batch_id.is.null,batch_id.eq.${enrollment.batch_id}` : "batch_id.is.null")
    .order("task_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: taskSubmission } = task
    ? await supabase
        .from("dtu_submissions")
        .select("status")
        .eq("student_id", student.id)
        .eq("dtu_id", task.id)
        .maybeSingle()
    : { data: null };

  const { data: gscore } = await supabase
    .from("gscores")
    .select("total_gscore, weekly_test_score, streak_points")
    .eq("student_id", student.id)
    .eq("course_id", course.id)
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    course: {
      id: course.id,
      title: course.title,
      description: course.description ?? "",
    },
    task: task
      ? {
          id: task.id,
          title: task.title,
          status: taskSubmission?.status ?? "not_started",
        }
      : null,
    quiz: quiz
      ? {
          id: quiz.id,
          title: quiz.title,
        }
      : null,
    nextLessonId,
    progress: getProgress(completedLessons, totalLessons),
    completedLessons,
    totalLessons,
    gscore: gscore?.total_gscore ?? 0,
    weeklyQuizPercentage: gscore?.weekly_test_score ?? 0,
    streakDetail: gscore ? `${Math.round(gscore.streak_points)} pts` : "No streak yet",
    quizPerformanceDetail: gscore ? `Latest quiz: ${percent(gscore.weekly_test_score)}` : "No quiz result yet",
    leaderboardDetail: "Leaderboard updates after GScore is published",
    upcomingClassDetail: "Class schedule will appear here",
    teacherFeedbackDetail: "Teacher feedback will appear after review.",
  };
}

function getProgress(completed: number, total: number) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function InfoCard({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <Card>
      <span className="grid size-11 place-items-center rounded-xl bg-muted text-primary">{icon}</span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </Card>
  );
}
