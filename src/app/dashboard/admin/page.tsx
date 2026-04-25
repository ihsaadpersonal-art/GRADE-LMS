import { AlertTriangle, ClipboardCheck, CreditCard, FileText, Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-nav";
import { ButtonLink, Card, MetricCard, StatusBadge } from "@/components/ui";
import { atRiskStudents, courses, dailyTasks, leads, payments, students } from "@/lib/sample-data";
import { formatBDT } from "@/lib/utils";

export default function AdminDashboardPage() {
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const pendingReviews = dailyTasks.filter((task) => task.status === "under_review");
  const revenue = payments
    .filter((payment) => payment.status === "verified")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <DashboardShell role="admin" title="Admin Dashboard">
      <div className="grid gap-6">
        <Card className="bg-[#eef5e8]">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <StatusBadge tone="success">Launch operations</StatusBadge>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Manage enrolment, payments, reviews, and parent updates from one place.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                The admin dashboard is designed for quick scanning: what needs contact,
                what needs verification, and which students need support.
              </p>
            </div>
            <ButtonLink href="/dashboard/admin/leads">Review New Leads</ButtonLink>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total students" value={students.length} detail="Student records" />
          <MetricCard label="Active students" value={students.filter((student) => student.status === "active").length} detail="Currently enrolled" />
          <MetricCard label="New leads" value={leads.filter((lead) => lead.status === "new").length} detail="Needs contact" tone="accent" />
          <MetricCard label="This week's revenue" value={formatBDT(revenue)} detail="Verified payments" />
          <MetricCard label="Pending payments" value={pendingPayments.length} detail="Manual verification" tone="danger" />
          <MetricCard label="Pending DTU reviews" value={pendingReviews.length} detail="Teacher action needed" />
          <MetricCard label="Active courses" value={courses.length} detail="Published programmes" />
          <MetricCard label="At-risk students" value={atRiskStudents.length} detail="Recovery action needed" tone="danger" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <h2 className="text-2xl font-semibold">Priority tasks</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["Contact new leads", `${leads.filter((lead) => lead.status === "new").length} waiting`, Users],
                ["Verify pending payments", `${pendingPayments.length} pending`, CreditCard],
                ["Review DTU submissions", `${pendingReviews.length} under review`, ClipboardCheck],
                ["Generate parent reports", "Weekly report ready", FileText],
                ["Support at-risk students", `${atRiskStudents.length} flagged`, AlertTriangle],
              ].map(([label, status, Icon]) => (
                <div key={String(label)} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-muted text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-semibold">{String(label)}</span>
                  </div>
                  <StatusBadge tone={String(label).includes("at-risk") ? "danger" : "success"}>
                    {String(status)}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-semibold">Quick actions</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Use these previews to inspect the launch operations flow before connecting live data.
            </p>
            <div className="mt-6 grid gap-3">
              <ButtonLink href="/dashboard/admin/leads">Lead Management</ButtonLink>
              <ButtonLink href="/dashboard/admin/payments" variant="secondary">
                Payment Verification
              </ButtonLink>
              <ButtonLink href="/dashboard/admin/reports" variant="secondary">
                Parent Report Generator
              </ButtonLink>
              <ButtonLink href="/dashboard/admin/at-risk" variant="secondary">
                At-Risk Students
              </ButtonLink>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
