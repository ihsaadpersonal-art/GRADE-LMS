import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type StudentRow = Database["public"]["Tables"]["students"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["enrollments"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type BatchRow = Database["public"]["Tables"]["batches"]["Row"];

type StudentEnrollmentView = EnrollmentRow & {
  course: CourseRow | null;
  batch: BatchRow | null;
};

type StudentView = {
  student: StudentRow;
  profile: ProfileRow | null;
  enrollments: StudentEnrollmentView[];
};

type StudentsPageView = {
  students: StudentView[];
  isLive: boolean;
  message?: string;
};

export default async function AdminStudentsPage() {
  const view = await getStudentsPageView();

  return (
    <DashboardShell role="admin" title="Students">
      <div className="grid gap-6">
        <Card className="bg-[#eef5e8]">
          <div className="max-w-3xl">
            <StatusBadge tone={view.isLive ? "success" : "warning"}>
              {view.isLive ? "Live student records" : "Read-only student view"}
            </StatusBadge>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">Students</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Manage student records, enrolments, and access visibility.
            </p>
          </div>
        </Card>

        {view.message ? (
          <Card>
            <p className="text-sm leading-6 text-muted-foreground">{view.message}</p>
          </Card>
        ) : null}

        {view.students.length ? (
          <div className="grid gap-5">
            {view.students.map((item) => (
              <StudentCard key={item.student.id} item={item} />
            ))}
          </div>
        ) : (
          <Card>
            <h3 className="text-lg font-semibold">No students to show yet</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Student records will appear here after LMS access is prepared and enrolments are
              created.
            </p>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}

async function getStudentsPageView(): Promise<StudentsPageView> {
  const fallback = (message?: string): StudentsPageView => ({
    students: [],
    isLive: false,
    message,
  });

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return fallback("Supabase is not configured, so live student records are unavailable.");
  }

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return fallback("Admin access is required to view student records.");
  }

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  if (studentsError || !students) {
    return fallback("Student records could not be loaded right now.");
  }

  if (!students.length) {
    return {
      students: [],
      isLive: true,
    };
  }

  const profileIds = unique(students.map((student) => student.profile_id).filter(Boolean));
  const studentIds = unique(students.map((student) => student.id));

  const [profilesResult, enrollmentsResult] = await Promise.all([
    profileIds.length
      ? supabase.from("profiles").select("*").in("id", profileIds)
      : Promise.resolve({ data: [], error: null }),
    studentIds.length
      ? supabase.from("enrollments").select("*").in("student_id", studentIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (profilesResult.error || enrollmentsResult.error) {
    return fallback("Student records loaded, but related profile or enrolment data failed.");
  }

  const enrollments = enrollmentsResult.data ?? [];
  const courseIds = unique(enrollments.map((enrollment) => enrollment.course_id));
  const batchIds = unique(enrollments.map((enrollment) => enrollment.batch_id).filter(Boolean));

  const [coursesResult, batchesResult] = await Promise.all([
    courseIds.length
      ? supabase.from("courses").select("*").in("id", courseIds)
      : Promise.resolve({ data: [], error: null }),
    batchIds.length
      ? supabase.from("batches").select("*").in("id", batchIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (coursesResult.error || batchesResult.error) {
    return fallback("Student records loaded, but course or batch data failed.");
  }

  const profilesById = new Map((profilesResult.data ?? []).map((row) => [row.id, row]));
  const coursesById = new Map((coursesResult.data ?? []).map((row) => [row.id, row]));
  const batchesById = new Map((batchesResult.data ?? []).map((row) => [row.id, row]));
  const enrollmentsByStudentId = new Map<string, StudentEnrollmentView[]>();

  for (const enrollment of enrollments) {
    const current = enrollmentsByStudentId.get(enrollment.student_id) ?? [];
    current.push({
      ...enrollment,
      course: coursesById.get(enrollment.course_id) ?? null,
      batch: enrollment.batch_id ? batchesById.get(enrollment.batch_id) ?? null : null,
    });
    enrollmentsByStudentId.set(enrollment.student_id, current);
  }

  return {
    students: students.map((student) => ({
      student,
      profile: student.profile_id ? profilesById.get(student.profile_id) ?? null : null,
      enrollments: enrollmentsByStudentId.get(student.id) ?? [],
    })),
    isLive: true,
  };
}

function StudentCard({ item }: { item: StudentView }) {
  const { student, profile, enrollments } = item;
  const displayName = profile?.full_name || student.student_code;

  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-xl font-semibold">{displayName}</h3>
            <StatusBadge tone={studentStatusTone(student.status)}>{student.status}</StatusBadge>
          </div>
          <p className="mt-2 break-words text-sm text-muted-foreground">
            {student.student_code} · {student.version} · {student.class_level}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={profile?.is_active === false ? "warning" : "success"}>
            {profile?.is_active === false ? "profile inactive" : "profile active"}
          </StatusBadge>
          <StatusBadge tone="neutral">{enrollments.length} enrolment{enrollments.length === 1 ? "" : "s"}</StatusBadge>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <InfoSection title="Student">
          <InfoItem label="Email" value={profile?.email} />
          <InfoItem label="Phone" value={profile?.phone} />
          <InfoItem label="WhatsApp" value={profile?.whatsapp} />
          <InfoItem label="Institution" value={student.institution} />
          <InfoItem label="Current batch" value={student.current_batch} />
        </InfoSection>

        <InfoSection title="Guardian">
          <InfoItem label="Guardian name" value={student.guardian_name} />
          <InfoItem label="Guardian phone" value={student.guardian_phone} />
          <InfoItem label="Guardian WhatsApp" value={student.guardian_whatsapp} />
          <InfoItem label="Guardian email" value={student.guardian_email} />
        </InfoSection>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Enrolments
        </h4>
        <div className="mt-3 grid gap-3">
          {enrollments.length ? (
            enrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))
          ) : (
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">No enrolments found for this student.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: StudentEnrollmentView }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h5 className="break-words text-base font-semibold">
            {enrollment.course?.title ?? "Course not found"}
          </h5>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {enrollment.batch?.name ?? "No batch assigned"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={enrollmentStatusTone(enrollment.enrollment_status)}>
            {enrollment.enrollment_status}
          </StatusBadge>
          <StatusBadge tone={paymentStatusTone(enrollment.payment_status)}>
            {enrollment.payment_status}
          </StatusBadge>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InfoItem label="Batch mode" value={enrollment.batch?.mode} />
        <InfoItem label="Batch status" value={enrollment.batch?.status} />
        <InfoItem label="Enrolled at" value={formatDate(enrollment.enrolled_at)} />
        <InfoItem label="Course type" value={enrollment.course?.course_type} />
      </div>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-4">
      <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 whitespace-normal break-words text-sm font-medium">
        {value === null || value === undefined || value === "" ? "Not provided" : value}
      </p>
    </div>
  );
}

function unique(values: (string | null)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function studentStatusTone(status: StudentRow["status"]) {
  if (status === "active" || status === "completed") {
    return "success";
  }
  if (status === "paused" || status === "lead") {
    return "warning";
  }
  return "danger";
}

function enrollmentStatusTone(status: EnrollmentRow["enrollment_status"]) {
  if (status === "active" || status === "completed") {
    return "success";
  }
  if (status === "pending" || status === "paused") {
    return "warning";
  }
  return "danger";
}

function paymentStatusTone(status: EnrollmentRow["payment_status"]) {
  if (status === "paid") {
    return "success";
  }
  if (status === "pending" || status === "partial") {
    return "warning";
  }
  return "danger";
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(value));
}
