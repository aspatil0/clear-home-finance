import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Download } from "lucide-react";
import { useState } from "react";

const allInvoices = [
  { id: "INV-2026-001", flat: "A-101", owner: "Amit Patel", amount: "₹4,500", status: "paid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-002", flat: "A-102", owner: "Sunita Rao", amount: "₹4,500", status: "unpaid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-003", flat: "A-201", owner: "Vikram Singh", amount: "₹5,200", status: "overdue" as const, date: "Jan 01, 2026" },
  { id: "INV-2026-004", flat: "A-202", owner: "Neha Gupta", amount: "₹4,500", status: "paid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-005", flat: "B-101", owner: "Ramesh Iyer", amount: "₹4,800", status: "unpaid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-006", flat: "A-301", owner: "Amit Patel", amount: "₹4,500", status: "unpaid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-007", flat: "B-201", owner: "Kiran Desai", amount: "₹5,200", status: "paid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-008", flat: "B-102", owner: "Sanjay Kumar", amount: "₹4,800", status: "paid" as const, date: "Feb 01, 2026" },
];

export default function InvoiceList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = allInvoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.flat.toLowerCase().includes(search.toLowerCase()) ||
      inv.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <PageHeader title="Invoices" description="View and manage all generated invoices" />

      <div className="bg-card rounded-lg border animate-fade-in">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Invoice</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Flat</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Owner</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Date</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-primary cursor-pointer" onClick={() => navigate(`/admin/invoices/${inv.id}`)}>{inv.id}</td>
                  <td className="px-5 py-3.5 text-sm">{inv.flat}</td>
                  <td className="px-5 py-3.5 text-sm">{inv.owner}</td>
                  <td className="px-5 py-3.5 text-sm text-right financial-amount">{inv.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{inv.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
