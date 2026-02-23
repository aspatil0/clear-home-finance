import { AdminLayout } from "@/components/layouts/AdminLayout";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  IndianRupee,
  AlertTriangle,
  Users,
  Receipt,
} from "lucide-react";

const recentInvoices = [
  { id: "INV-2026-001", flat: "A-101", owner: "Amit Patel", amount: "₹4,500", status: "paid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-002", flat: "A-102", owner: "Sunita Rao", amount: "₹4,500", status: "unpaid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-003", flat: "A-201", owner: "Vikram Singh", amount: "₹5,200", status: "overdue" as const, date: "Jan 01, 2026" },
  { id: "INV-2026-004", flat: "A-202", owner: "Neha Gupta", amount: "₹4,500", status: "paid" as const, date: "Feb 01, 2026" },
  { id: "INV-2026-005", flat: "B-101", owner: "Ramesh Iyer", amount: "₹4,800", status: "unpaid" as const, date: "Feb 01, 2026" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your society's maintenance status"
        action={
          <Button onClick={() => navigate("/admin/generate-bills")}>
            <Receipt className="mr-2 h-4 w-4" />
            Generate Bills
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Billed" value="₹2,16,000" icon={<IndianRupee className="h-5 w-5" />} trend="This month" />
        <StatCard label="Collected" value="₹1,44,000" icon={<IndianRupee className="h-5 w-5" />} variant="success" trend="66.7% collected" />
        <StatCard label="Unpaid Bills" value="12" icon={<FileText className="h-5 w-5" />} variant="warning" trend="Requires follow-up" />
        <StatCard label="Overdue" value="3" icon={<AlertTriangle className="h-5 w-5" />} variant="destructive" trend="Past due date" />
      </div>

      <div className="bg-card rounded-lg border">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-medium">Recent Invoices</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/invoices")}>
            View All
          </Button>
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
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => navigate(`/admin/invoices/${inv.id}`)}>
                  <td className="px-5 py-3.5 text-sm font-medium text-primary">{inv.id}</td>
                  <td className="px-5 py-3.5 text-sm">{inv.flat}</td>
                  <td className="px-5 py-3.5 text-sm">{inv.owner}</td>
                  <td className="px-5 py-3.5 text-sm text-right financial-amount">{inv.amount}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
