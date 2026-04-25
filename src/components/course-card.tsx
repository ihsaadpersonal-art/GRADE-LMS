import { BookOpen, CalendarDays, ClipboardCheck, MapPin, Users } from "lucide-react";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";
import { ImageOrPlaceholder } from "@/components/visual-media";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  const imageSrc =
    course.courseType === "bridge"
      ? "/images/bridge-course-science.jpg"
      : "/images/hsc-exam-ready.jpg";

  return (
    <Card className="group flex h-full overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(32,48,37,0.12)]">
      <div className="grid w-full lg:grid-cols-[0.85fr_1.15fr]">
        <div className="min-h-[220px] overflow-hidden border-b border-border lg:border-r lg:border-b-0">
          <ImageOrPlaceholder
            src={imageSrc}
            alt={`${course.title} course visual`}
            label={course.title}
            variant="course"
          />
        </div>
        <div className="flex flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <StatusBadge tone="success">{course.targetBatch}</StatusBadge>
              <h3 className="mt-4 text-2xl font-semibold leading-tight">{course.title}</h3>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-muted text-primary">
              <BookOpen className="size-5" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>
          <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-primary" aria-hidden="true" />
              {course.versionSupport === "Both" ? "Bangla & English Version" : course.versionSupport}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              {course.durationWeeks} weeks
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Online / Offline / Hybrid
            </span>
            <span className="flex items-center gap-2">
              <ClipboardCheck className="size-4 text-primary" aria-hidden="true" />
              Classes, DTUs, quizzes, reports
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Cohort programme</p>
            <ButtonLink href={`/courses/${course.slug}`}>View Course</ButtonLink>
          </div>
        </div>
      </div>
    </Card>
  );
}
