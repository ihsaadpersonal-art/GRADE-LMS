import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-nav";
import { Card, StatusBadge } from "@/components/ui";
import { dailyTasks } from "@/lib/sample-data";

export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = dailyTasks.find((item) => item.id === taskId);
  if (!task) notFound();

  return (
    <DashboardShell role="student" title="Daily Task Unit">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <StatusBadge tone="warning">{task.status.replace("_", " ")}</StatusBadge>
          <h1 className="mt-4 text-2xl font-semibold">{task.title}</h1>
          <dl className="mt-5 grid gap-3 text-sm">
            <Row label="Date" value={task.taskDate} />
            <Row label="Subject" value={task.subject} />
            <Row label="Chapter" value={task.chapter} />
            <Row label="Due" value={task.dueAt} />
          </dl>
        </Card>
        <Card>
          <div className="grid gap-4 text-sm">
            <Task label="Watch" value={task.watchTask} />
            <Task label="Read" value={task.readTask} />
            <Task label="Solve" value={task.solveTask} />
            <Task label="Submit" value={task.submitTask} />
            <Task label="Review" value={task.reviewTask} />
          </div>
          <form className="mt-6 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">
              Student note
              <textarea className="input min-h-28" placeholder="Write what you completed and where you got stuck." />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Proof image/PDF URL
              <input className="input" placeholder="Paste Supabase Storage file URL for v1" />
            </label>
            <button className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Submit task
            </button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function Task({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-muted-foreground">{value}</p>
    </div>
  );
}
