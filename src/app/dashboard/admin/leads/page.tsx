import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { leads } from "@/lib/sample-data";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { ReactNode } from "react";

const leadStatuses = ["new", "contacted", "interested", "payment_pending", "enrolled", "lost"] as const;
const bridgeCourseId = "11111111-1111-1111-1111-111111111111";
const bridgeBatchId = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const bridgeBatchName = "Bridge Science Batch A";

type LeadStatus = (typeof leadStatuses)[number];

type LeadView = {
  id: string;
  studentName: string;
  parentName: string;
  studentPhone: string;
  parentPhone: string;
  whatsapp: string;
  email: string | null;
  currentLevel: string;
  version: string;
  institution: string;
  interestedProgramme: string;
  preferredMode: string;
  source: string;
  status: string;
  message: string | null;
  notes: string | null;
  createdAt: string | null;
};

export default async function AdminLeadsPage() {
  const view = (await getSupabaseLeads()) ?? getSampleLeads();

  return (
    <DashboardShell role="admin" title="Lead Management">
      <Card>
        <h2 className="text-xl font-semibold">Enrolment Leads</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {view.isLive ? "Showing live enrolment requests from Supabase." : "Showing sample lead data preview."}
        </p>
        <div className="mt-6 grid gap-4">
          {view.leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="whitespace-normal break-words text-lg font-semibold text-foreground">
                      {lead.studentName}
                    </h3>
                    <StatusBadge tone={getLeadStatusTone(lead.status)}>
                      {formatLeadStatus(lead.status)}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 whitespace-normal break-words text-sm text-muted-foreground">
                    Parent: <span className="font-medium text-foreground">{lead.parentName}</span>
                  </p>
                </div>
                <div className="shrink-0 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                  {lead.createdAt ? formatDateTime(lead.createdAt) : "Preview lead"}
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
                <LeadSection title="Contact">
                  <DetailGrid>
                    <DetailItem label="Student phone" value={lead.studentPhone} />
                    <DetailItem label="Parent phone" value={lead.parentPhone} />
                    <DetailItem label="WhatsApp" value={lead.whatsapp} />
                    <DetailItem label="Email" value={lead.email ?? "Not provided"} />
                  </DetailGrid>
                </LeadSection>

                <LeadSection title="Academic / lead info">
                  <DetailGrid>
                    <DetailItem label="Current level" value={lead.currentLevel} />
                    <DetailItem label="Version" value={lead.version} />
                    <DetailItem label="Institution" value={lead.institution} />
                    <DetailItem label="Interested programme" value={lead.interestedProgramme} />
                    <DetailItem label="Preferred mode" value={lead.preferredMode} />
                    <DetailItem label="Source" value={lead.source} />
                  </DetailGrid>
                </LeadSection>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
                <LeadSection title="Message / notes">
                  <div className="space-y-4">
                    <TextBlock label="Original message" value={lead.message ?? "No message provided."} />
                    <TextBlock label="Internal notes" value={lead.notes ?? "No internal notes yet."} />
                  </div>
                </LeadSection>

                <LeadSection title="Actions">
                  {view.isLive ? (
                    <div className="space-y-4">
                      <form id={`lead-form-${lead.id}`} action={updateLeadStatus} className="space-y-3">
                        <input type="hidden" name="leadId" value={lead.id} />
                        <div>
                          <label
                            className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                            htmlFor={`status-${lead.id}`}
                          >
                            Lead status
                          </label>
                          <select
                            id={`status-${lead.id}`}
                            name="status"
                            defaultValue={lead.status}
                            className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
                          >
                            {leadStatuses.map((status) => (
                              <option key={status} value={status}>
                                {formatLeadStatus(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                            htmlFor={`notes-${lead.id}`}
                          >
                            Internal notes
                          </label>
                          <textarea
                            id={`notes-${lead.id}`}
                            name="notes"
                            defaultValue={lead.notes ?? ""}
                            rows={4}
                            placeholder="Add admin notes"
                            className="mt-2 w-full resize-y rounded-xl border border-border bg-card px-3 py-2 text-sm leading-6 text-foreground"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-[#104d36] sm:w-auto"
                        >
                          Save lead update
                        </button>
                      </form>
                      <div className="border-t border-border pt-4">
                        <form action={prepareLeadEnrolment} className="space-y-2">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <button
                            type="submit"
                            disabled={!lead.email}
                            className="w-full rounded-xl border border-primary/25 bg-card px-4 py-3 text-sm font-semibold text-primary transition hover:bg-muted disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:opacity-70 sm:w-auto"
                          >
                            Prepare enrolment
                          </button>
                          <p className="text-xs leading-5 text-muted-foreground">
                            {lead.email
                              ? "Marks this lead as ready for course, batch, and invitation review."
                              : "Add an email before preparing this lead for invitation."}
                          </p>
                        </form>
                      </div>
                      {canSendInvitation(lead) ? (
                        <div className="border-t border-border pt-4">
                          <form action={sendLeadInvitation} className="space-y-2">
                            <input type="hidden" name="leadId" value={lead.id} />
                            <button
                              type="submit"
                              className="w-full rounded-xl border border-accent/50 bg-[#fff9eb] px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[#fff3d6] sm:w-auto"
                            >
                              Send invitation
                            </button>
                            <p className="text-xs leading-5 text-muted-foreground">
                              Sends a Supabase invitation email only. Account records are not created yet.
                            </p>
                          </form>
                        </div>
                      ) : null}
                      {canVerifyPayment(lead) ? (
                        <div className="border-t border-border pt-4">
                          <form action={verifyLeadPayment} className="space-y-2">
                            <input type="hidden" name="leadId" value={lead.id} />
                            <button
                              type="submit"
                              className="w-full rounded-xl border border-primary/25 bg-[#e7f4e7] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-[#dceedd] sm:w-auto"
                            >
                              Mark payment verified
                            </button>
                            <p className="text-xs leading-5 text-muted-foreground">
                              Updates the Bridge enrolment payment status to paid.
                            </p>
                          </form>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="whitespace-normal break-words text-sm text-muted-foreground">
                      Live Supabase data is required to update lead status or notes.
                    </p>
                  )}
                </LeadSection>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}

async function updateLeadStatus(formData: FormData) {
  "use server";

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const leadId = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!leadId || !isLeadStatus(status)) {
    return;
  }

  await supabase
    .from("leads")
    .update({
      status,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  revalidatePath("/dashboard/admin/leads");
}

async function prepareLeadEnrolment(formData: FormData) {
  "use server";

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) {
    return;
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select("id, email, status, notes")
    .eq("id", leadId)
    .single();

  if (error || !lead?.email) {
    return;
  }

  const preparedAt = new Date().toISOString();
  const adminLabel = profile.full_name || profile.email || "admin";
  const prepareNote =
    `Prepared for enrolment/invitation by ${adminLabel} on ${preparedAt}. ` +
    "Course and batch should be confirmed before sending invitation.";
  const notes = [lead.notes?.trim() || null, prepareNote].filter(Boolean).join("\n\n");

  await supabase
    .from("leads")
    .update({
      status: getPreparedLeadStatus(lead.status),
      notes,
      updated_at: preparedAt,
    })
    .eq("id", lead.id);

  revalidatePath("/dashboard/admin/leads");
}

async function sendLeadInvitation(formData: FormData) {
  "use server";

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return;
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return;
  }

  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) {
    return;
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id, student_name, parent_name, student_phone, parent_phone, whatsapp, email, version, institution, status, notes")
    .eq("id", leadId)
    .single();

  if (leadError || !lead?.email || !canInviteLeadStatus(lead.status) || hasInvitationSentNote(lead.notes)) {
    return;
  }

  const sentAt = new Date().toISOString();
  const origin = getRequestOrigin(await headers());
  if (!origin) {
    const notes = appendLeadNote(
      lead.notes,
      `Invitation failed on ${sentAt}: Could not determine the current site URL.`,
    );

    await supabase
      .from("leads")
      .update({
        notes,
        updated_at: sentAt,
      })
      .eq("id", lead.id);

    revalidatePath("/dashboard/admin/leads");
    return;
  }

  const redirectTo = `${origin}/auth/callback?next=/dashboard`;
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(lead.email, {
    redirectTo,
    data: {
      leadId: lead.id,
      studentName: lead.student_name,
      role: "student",
    },
  });

  const adminLabel = profile.full_name || profile.email || "admin";
  let note = error
    ? `Invitation failed on ${sentAt}: ${getSafeErrorMessage(error.message)}`
    : `Invitation email sent to ${lead.email} by ${adminLabel} on ${sentAt}. Auth user ID: ${data.user?.id ?? "not returned"}`;

  if (!error && data.user?.id) {
    const accessResult = await prepareLmsAccessForInvitedLead({
      authUserId: data.user.id,
      lead: {
        ...lead,
        email: lead.email,
      },
      supabase,
    });

    note = accessResult.ok
      ? `${note}\nLMS access prepared: profile, student, and active Bridge enrolment created.`
      : `${note}\nInvitation was sent, but LMS access preparation failed: ${accessResult.error}`;
  }

  await supabase
    .from("leads")
    .update({
      status: error ? lead.status : "payment_pending",
      notes: appendLeadNote(lead.notes, note),
      updated_at: sentAt,
    })
    .eq("id", lead.id);

  revalidatePath("/dashboard/admin/leads");
}

async function verifyLeadPayment(formData: FormData) {
  "use server";

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return;
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return;
  }

  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) {
    return;
  }

  const verifiedAt = new Date().toISOString();
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id, email, status, notes")
    .eq("id", leadId)
    .single();

  if (leadError || !lead?.email || lead.status !== "payment_pending") {
    return;
  }

  const adminLabel = profile.full_name || profile.email || "admin";
  const missingAccessNote =
    `Payment verification could not be completed on ${verifiedAt} because LMS access/enrolment was not found. ` +
    "Prepare LMS access before marking payment verified.";

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", lead.email)
    .maybeSingle();

  if (!profileRow) {
    await appendLeadNoteAndRevalidate(supabase, lead.id, lead.notes, missingAccessNote, verifiedAt);
    return;
  }

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profileRow.id)
    .maybeSingle();

  if (!student) {
    await appendLeadNoteAndRevalidate(supabase, lead.id, lead.notes, missingAccessNote, verifiedAt);
    return;
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", student.id)
    .eq("course_id", bridgeCourseId)
    .eq("batch_id", bridgeBatchId)
    .maybeSingle();

  if (!enrollment) {
    await appendLeadNoteAndRevalidate(supabase, lead.id, lead.notes, missingAccessNote, verifiedAt);
    return;
  }

  const { error: enrollmentError } = await supabase
    .from("enrollments")
    .update({
      payment_status: "paid",
      enrollment_status: "active",
    })
    .eq("id", enrollment.id);

  if (enrollmentError) {
    await appendLeadNoteAndRevalidate(
      supabase,
      lead.id,
      lead.notes,
      `Payment verification could not be completed on ${verifiedAt}: ${getSafeErrorMessage(enrollmentError.message)}`,
      verifiedAt,
    );
    return;
  }

  const verificationNote =
    `Payment manually verified by ${adminLabel} on ${verifiedAt}. ` +
    "Bridge enrolment payment_status set to paid.";

  await supabase
    .from("leads")
    .update({
      status: "enrolled",
      notes: appendLeadNote(lead.notes, verificationNote),
      updated_at: verifiedAt,
    })
    .eq("id", lead.id);

  revalidatePath("/dashboard/admin/leads");
}

async function prepareLmsAccessForInvitedLead({
  authUserId,
  lead,
  supabase,
}: {
  authUserId: string;
  lead: {
    student_name: string;
    parent_name: string;
    student_phone: string;
    parent_phone: string;
    whatsapp: string;
    email: string;
    version: string;
    institution: string;
  };
  supabase: NonNullable<ReturnType<typeof createSupabaseServiceClient>>;
}) {
  const now = new Date().toISOString();
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authUserId,
    full_name: lead.student_name,
    email: lead.email,
    phone: lead.student_phone,
    whatsapp: lead.whatsapp,
    role: "student",
    is_active: true,
    updated_at: now,
  });

  if (profileError) {
    return { ok: false, error: getSafeErrorMessage(profileError.message) };
  }

  const { data: existingStudent, error: studentLookupError } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", authUserId)
    .maybeSingle();

  if (studentLookupError) {
    return { ok: false, error: getSafeErrorMessage(studentLookupError.message) };
  }

  let studentId = existingStudent?.id ?? null;

  if (!studentId) {
    const { data: insertedStudent, error: studentInsertError } = await supabase
      .from("students")
      .insert({
        profile_id: authUserId,
        student_code: getStudentCode(authUserId),
        version: getStudentVersion(lead.version),
        class_level: "Post-SSC",
        current_batch: bridgeBatchName,
        institution: lead.institution,
        guardian_name: lead.parent_name,
        guardian_phone: lead.parent_phone,
        guardian_whatsapp: lead.whatsapp,
        guardian_email: lead.email,
        consent_public_leaderboard: false,
        status: "active",
      })
      .select("id")
      .single();

    if (studentInsertError || !insertedStudent) {
      return {
        ok: false,
        error: getSafeErrorMessage(studentInsertError?.message ?? "Student record was not created."),
      };
    }

    studentId = insertedStudent.id;
  }

  const { error: enrollmentError } = await supabase.from("enrollments").upsert(
    {
      student_id: studentId,
      course_id: bridgeCourseId,
      batch_id: bridgeBatchId,
      enrollment_status: "active",
      payment_status: "pending",
      enrolled_at: now,
    },
    {
      onConflict: "student_id,course_id,batch_id",
    },
  );

  if (enrollmentError) {
    return { ok: false, error: getSafeErrorMessage(enrollmentError.message) };
  }

  return { ok: true };
}

function getSampleLeads(): { isLive: boolean; leads: LeadView[] } {
  return {
    isLive: false,
    leads: leads.map((lead) => ({
      id: lead.id,
      studentName: lead.studentName,
      parentName: lead.parentName,
      studentPhone: lead.studentPhone,
      parentPhone: lead.parentPhone,
      whatsapp: lead.whatsapp,
      email: lead.email ?? null,
      currentLevel: lead.currentLevel,
      version: lead.version,
      institution: lead.institution,
      interestedProgramme: lead.interestedProgramme,
      preferredMode: lead.preferredMode,
      source: lead.source,
      status: lead.status,
      message: lead.message ?? null,
      notes: lead.notes ?? null,
      createdAt: lead.createdAt,
    })),
  };
}

async function getSupabaseLeads(): Promise<{ isLive: boolean; leads: LeadView[] } | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const profile = await getCurrentProfile();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    return null;
  }

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, student_name, parent_name, student_phone, parent_phone, whatsapp, email, current_level, version, institution, interested_programme, preferred_mode, source, status, message, notes, created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  return {
    isLive: true,
    leads: data.map((lead) => ({
      id: lead.id,
      studentName: lead.student_name,
      parentName: lead.parent_name,
      studentPhone: lead.student_phone,
      parentPhone: lead.parent_phone,
      whatsapp: lead.whatsapp,
      email: lead.email,
      currentLevel: lead.current_level,
      version: lead.version,
      institution: lead.institution,
      interestedProgramme: lead.interested_programme,
      preferredMode: lead.preferred_mode,
      source: lead.source,
      status: lead.status,
      message: lead.message,
      notes: lead.notes,
      createdAt: lead.created_at,
    })),
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isLeadStatus(status: string): status is LeadStatus {
  return leadStatuses.includes(status as LeadStatus);
}

function formatLeadStatus(status: string) {
  return status.replace("_", " ");
}

function getLeadStatusTone(status: string) {
  if (status === "enrolled") {
    return "success";
  }

  if (status === "lost") {
    return "danger";
  }

  if (status === "new") {
    return "neutral";
  }

  return "warning";
}

function getPreparedLeadStatus(status: string): LeadStatus {
  if (status === "new" || status === "contacted") {
    return "interested";
  }

  return "payment_pending";
}

function canInviteLeadStatus(status: string) {
  return status === "interested" || status === "payment_pending";
}

function hasInvitationSentNote(notes: string | null) {
  return notes?.includes("Invitation email sent") ?? false;
}

function canSendInvitation(lead: LeadView) {
  return Boolean(lead.email && canInviteLeadStatus(lead.status) && !hasInvitationSentNote(lead.notes));
}

function canVerifyPayment(lead: LeadView) {
  return Boolean(lead.email && lead.status === "payment_pending" && lead.notes?.includes("LMS access prepared"));
}

function appendLeadNote(existingNotes: string | null, note: string) {
  return [existingNotes?.trim() || null, note].filter(Boolean).join("\n\n");
}

async function appendLeadNoteAndRevalidate(
  supabase: NonNullable<ReturnType<typeof createSupabaseServiceClient>>,
  leadId: string,
  existingNotes: string | null,
  note: string,
  updatedAt: string,
) {
  await supabase
    .from("leads")
    .update({
      notes: appendLeadNote(existingNotes, note),
      updated_at: updatedAt,
    })
    .eq("id", leadId);

  revalidatePath("/dashboard/admin/leads");
}

function getStudentCode(authUserId: string) {
  return `GRADE-${authUserId.replaceAll("-", "").slice(0, 10).toUpperCase()}`;
}

function getStudentVersion(version: string) {
  return version === "English Version" ? "English Version" : "Bangla Version";
}

function getRequestOrigin(headersList: Headers) {
  const forwardedHost = headersList.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || headersList.get("host");

  if (!host) {
    return null;
  }

  const forwardedProto = headersList.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || (host.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

function getSafeErrorMessage(message: string) {
  return message.replace(/\s+/g, " ").slice(0, 180);
}

function LeadSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-muted/40 p-4">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function DetailGrid({ children }: { children: ReactNode }) {
  return <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-normal break-words text-sm font-medium leading-6 text-foreground">{value}</dd>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="mt-2 whitespace-normal break-words rounded-xl border border-border bg-card p-3 text-sm leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}
