import { ResidentLayout } from "@/components/layouts/ResidentLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const payments = [
  { id: "PAY-001", invoice: "INV-2026-001", amount: "₹4,500", method: "UPI", date: "Jan 10, 2026", status: "paid" as const },
  { id: "PAY-002", invoice: "INV-2025-012", amount: "₹4,500", method: "UPI", date: "Dec 12, 2025", status: "paid" as const },
  { id: "PAY-003", invoice: "INV-2025-011", amount: "₹4,200", method: "Card", date: "Nov 08, 2025", status: "paid" as const },
];

export default function ResidentPayments() {
  return (
    <ResidentLayout>
      <PageHeader title="Payment History" description="Your past maintenance payments" />

      <div className="bg-card rounded-lg border animate-fade-in">
        <div className="divide-y">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-medium">{p.id}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-xs text-muted-foreground">{p.invoice} · {p.method} · {p.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold financial-amount">{p.amount}</span>
                <Button variant="ghost" size="sm">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResidentLayout>
  );
}
