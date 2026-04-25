import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { leads } from "@/lib/sample-data";

export default function AdminLeadsPage() {
  return (
    <DashboardShell role="admin" title="Lead Management">
      <Card>
        <h2 className="text-xl font-semibold">Enrolment Leads</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Student</th>
                <th>Parent</th>
                <th>WhatsApp</th>
                <th>Version</th>
                <th>Programme</th>
                <th>Source</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{lead.studentName}</td>
                  <td>{lead.parentName}</td>
                  <td>{lead.whatsapp}</td>
                  <td>{lead.version}</td>
                  <td>{lead.interestedProgramme}</td>
                  <td>{lead.source}</td>
                  <td><StatusBadge tone="warning">{lead.status.replace("_", " ")}</StatusBadge></td>
                  <td>{lead.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
