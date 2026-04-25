import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { payments } from "@/lib/sample-data";
import { formatBDT } from "@/lib/utils";

export default function AdminPaymentsPage() {
  return (
    <DashboardShell role="admin" title="Payment Verification">
      <Card>
        <h2 className="text-xl font-semibold">Manual Payments</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Automation stays out of scope for v1. Admin verifies transaction ID and activates enrolment.
        </p>
        <div className="mt-5 grid gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-md border border-border bg-background p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold">{payment.studentName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{payment.courseTitle}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {payment.method} · {payment.transactionId}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold">{formatBDT(payment.amount)}</p>
                  <div className="mt-2">
                    <StatusBadge tone={payment.status === "verified" ? "success" : "warning"}>{payment.status}</StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
