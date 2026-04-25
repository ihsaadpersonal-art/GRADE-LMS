import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { BarChart3, BookOpen, FileText, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: BarChart3,
  course: BookOpen,
  report: FileText,
  founder: GraduationCap,
};

export function ImageOrPlaceholder({
  src,
  alt,
  label,
  variant = "course",
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  label: string;
  variant?: keyof typeof iconMap;
  className?: string;
  priority?: boolean;
}) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
  const Icon = iconMap[variant];

  if (exists) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1100}
        height={820}
        priority={priority}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid h-full min-h-[260px] place-items-center overflow-hidden bg-[#eef5e8] p-6 soft-grid",
        className,
      )}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card/95 p-5 text-left shadow-[0_20px_50px_rgba(32,48,37,0.12)]">
        <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-primary">
          GRADE Preview
        </p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight">{label}</h3>
        <div className="mt-5 grid gap-2">
          <div className="h-2 rounded-full bg-muted" />
          <div className="h-2 w-4/5 rounded-full bg-muted" />
          <div className="h-2 w-2/3 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
