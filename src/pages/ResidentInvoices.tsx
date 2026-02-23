import { ResidentLayout } from "@/components/layouts/ResidentLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const invoices = [
  { id: "INV-2026-006", period: "February 2026", amount: "₹4,500", status: "unpaid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-001", period: "January 2026", amount: "₹4,500", status: "paid" as const, date: "Jan 01, 2026" },
  { id: "INV-2025-012", period: "December 2025", amount: "₹4,500", status: "paid" as const, date: "Dec 01, 2025" },
  { id: "INV-2025-011", period: "November 2025", amount: "₹4,200", status: "paid" as const, date: "Nov 01, 2025" },
  { id: "INV-2025-010", period: "October 2025", amount: "₹4,200", status: "paid" as const, date: "Oct 01, 2025" },
];

export default function ResidentInvoices() {
  return (
    <ResidentLayout>
      <PageHeader title="My Invoices" description="View and download your maintenance invoices" />

      <div className="bg-card rounded-lg border animate-fade-in">
        <div className="divide-y">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-medium">{inv.period}</p>
                  <StatusBadge status={inv.status} />
                </div>
                <p className="text-xs text-muted-foreground">{inv.id} · {inv.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold financial-amount">{inv.amount}</span>
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
