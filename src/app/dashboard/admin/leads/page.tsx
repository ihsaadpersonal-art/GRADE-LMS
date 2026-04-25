import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { leads } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ReactNode } from "react";

const leadStatuses = ["new", "contacted", "interested", "payment_pending", "enrolled", "lost"] as const;

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
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Internal notes
                      </p>
                      {view.isLive ? (
                        <textarea
                          form={`lead-form-${lead.id}`}
                          id={`notes-${lead.id}`}
                          name="notes"
                          defaultValue={lead.notes ?? ""}
                          rows={4}
                          placeholder="Add admin notes"
                          className="mt-2 w-full resize-y rounded-xl border border-border bg-card px-3 py-2 text-sm leading-6 text-foreground"
                        />
                      ) : (
                        <p className="mt-2 whitespace-normal break-words rounded-xl border border-border bg-card p-3 text-sm leading-6 text-foreground">
                          {lead.notes ?? "No internal notes yet."}
                        </p>
                      )}
                    </div>
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

function getSampleLeads() {
  return {
    isLive: false,
    leads: leads.map((lead) => ({
      id: lead.id,
      studentName: lead.studentName,
      parentName: lead.parentName,
      studentPhone: lead.studentPhone,
      parentPhone: lead.parentPhone,
      whatsapp: lead.whatsapp,
      email: lead.email,
      currentLevel: lead.currentLevel,
      version: lead.version,
      institution: lead.institution,
      interestedProgramme: lead.interestedProgramme,
      preferredMode: lead.preferredMode,
      source: lead.source,
      status: lead.status,
      message: lead.message,
      notes: lead.notes,
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
