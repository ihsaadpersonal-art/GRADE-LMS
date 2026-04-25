import { BookOpen, ClipboardCheck, Users } from "lucide-react";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";
import type { Course } from "@/lib/types";
import { formatBDT } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusBadge tone="success">{course.targetBatch}</StatusBadge>
          <h3 className="mt-4 text-xl font-semibold">{course.title}</h3>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-muted text-primary">
          <BookOpen className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.description}</p>
      <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <ClipboardCheck className="size-4 text-primary" aria-hidden="true" />
          {course.durationWeeks} weeks
        </span>
        <span className="flex items-center gap-2">
          <Users className="size-4 text-primary" aria-hidden="true" />
          {course.versionSupport}
        </span>
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-semibold">{formatBDT(course.price)}</p>
        <ButtonLink href={`/courses/${course.slug}`}>View course</ButtonLink>
      </div>
    </Card>
  );
}
