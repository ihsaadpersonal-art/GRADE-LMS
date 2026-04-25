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
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total students" value={students.length} detail="Seeded active records" />
          <MetricCard label="Active students" value={students.filter((student) => student.status === "active").length} detail="Currently enrolled" />
          <MetricCard label="New leads" value={leads.filter((lead) => lead.status === "new").length} detail="Needs contact" tone="accent" />
          <MetricCard label="This week's revenue" value={formatBDT(revenue)} detail="Manual verified payments" />
          <MetricCard label="Pending payments" value={pendingPayments.length} detail="Manual verification" tone="danger" />
          <MetricCard label="Pending DTU reviews" value={pendingReviews.length} detail="Teacher action needed" />
          <MetricCard label="Active courses" value={courses.length} detail="Published programmes" />
          <MetricCard label="At-risk students" value={atRiskStudents.length} detail="Requires recovery action" tone="danger" />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="text-xl font-semibold">Launch Operations</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["Visitor submits enrolment form", "Ready"],
                ["Admin sees lead", "Ready"],
                ["Admin verifies payment", "Ready"],
                ["Student journey preview", "Ready"],
                ["Parent report copy", "Ready"],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3">
                  <span className="text-sm font-medium">{label}</span>
                  <StatusBadge tone="success">{status}</StatusBadge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Admin Management</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              v1 navigation is scoped to leads, payments, reports, and at-risk students first.
              Course, module, lesson, quiz, DTU, and user CRUD are represented in schema and
              are the next feature slices.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/dashboard/admin/leads">Review leads</ButtonLink>
              <ButtonLink href="/dashboard/admin/reports" variant="secondary">
                Generate report
              </ButtonLink>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
