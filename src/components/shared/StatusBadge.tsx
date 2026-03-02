import { cn } from "@/lib/utils";

type Status = "paid" | "unpaid" | "overdue" | "pending" | "generated" | "sent";

const statusConfig: Record<Status, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-success/10 text-success" },
  unpaid: { label: "Unpaid", className: "bg-muted text-muted-foreground" },
  overdue: { label: "Overdue", className: "bg-overdue/10 text-overdue" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
  generated: { label: "Generated", className: "bg-accent text-accent-foreground" },
  sent: { label: "Sent", className: "bg-primary/10 text-primary" },
};

export function StatusBadge({ status }: { status: string }) {
  const safeStatus = (status || "unpaid").toLowerCase() as Status;
  const config = statusConfig[safeStatus as Status] || { label: safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1), className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
