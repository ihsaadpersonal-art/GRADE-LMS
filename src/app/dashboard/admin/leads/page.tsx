import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { leads } from "@/lib/sample-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Student</th>
                <th>Parent</th>
                <th>Phones</th>
                <th>WhatsApp</th>
                <th>Email</th>
                <th>Level</th>
                <th>Version</th>
                <th>Institution</th>
                <th>Programme</th>
                <th>Mode</th>
                <th>Source</th>
                <th>Status</th>
                <th>Message / Notes</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {view.leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{lead.studentName}</td>
                  <td>{lead.parentName}</td>
                  <td>
                    <div>{lead.studentPhone}</div>
                    <div className="text-muted-foreground">{lead.parentPhone}</div>
                  </td>
                  <td>{lead.whatsapp}</td>
                  <td>{lead.email ?? "Not provided"}</td>
                  <td>{lead.currentLevel}</td>
                  <td>{lead.version}</td>
                  <td>{lead.institution}</td>
                  <td>{lead.interestedProgramme}</td>
                  <td>{lead.preferredMode}</td>
                  <td>{lead.source}</td>
                  <td><StatusBadge tone="warning">{lead.status.replace("_", " ")}</StatusBadge></td>
                  <td>
                    <div>{lead.message ?? "No message"}</div>
                    {lead.notes ? <div className="mt-1 text-muted-foreground">{lead.notes}</div> : null}
                  </td>
                  <td>{lead.createdAt ? formatDateTime(lead.createdAt) : "Preview"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
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
