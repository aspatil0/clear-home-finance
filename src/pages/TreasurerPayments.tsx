import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const payments = [
  { id: "PAY-001", flat: "A-101", owner: "Amit Patel", invoice: "INV-2026-001", amount: "₹4,500", method: "UPI", date: "Feb 05, 2026", status: "paid" as const },
  { id: "PAY-002", flat: "A-202", owner: "Neha Gupta", invoice: "INV-2026-004", amount: "₹4,500", method: "Bank Transfer", date: "Feb 04, 2026", status: "paid" as const },
  { id: "PAY-003", flat: "B-201", owner: "Kiran Desai", invoice: "INV-2026-007", amount: "₹5,200", method: "UPI", date: "Feb 03, 2026", status: "paid" as const },
  { id: "PAY-004", flat: "A-301", owner: "Raj Malhotra", invoice: "INV-2025-048", amount: "₹4,500", method: "Card", date: "Feb 02, 2026", status: "paid" as const },
  { id: "PAY-005", flat: "B-102", owner: "Sanjay Kumar", invoice: "INV-2026-008", amount: "₹4,800", method: "UPI", date: "Feb 01, 2026", status: "paid" as const },
];

export default function TreasurerPayments() {
  const [search, setSearch] = useState("");
  const filtered = payments.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.toLowerCase().includes(search.toLowerCase()) ||
      p.flat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader title="Payment History" description="All payments received from residents" />

      <div className="bg-card rounded-lg border animate-fade-in">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Payment ID</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Flat</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Owner</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Invoice</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Method</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium">{p.id}</td>
                  <td className="px-5 py-3.5 text-sm">{p.flat}</td>
                  <td className="px-5 py-3.5 text-sm">{p.owner}</td>
                  <td className="px-5 py-3.5 text-sm text-primary">{p.invoice}</td>
                  <td className="px-5 py-3.5 text-sm text-right financial-amount">{p.amount}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.method}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.date}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
