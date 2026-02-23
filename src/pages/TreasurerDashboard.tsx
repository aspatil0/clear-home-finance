import { AdminLayout } from "@/components/layouts/AdminLayout";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { IndianRupee, TrendingUp, TrendingDown, FileText } from "lucide-react";

const payments = [
  { id: "PAY-001", flat: "A-101", owner: "Amit Patel", amount: "₹4,500", method: "UPI", date: "Feb 05, 2026", status: "paid" as const },
  { id: "PAY-002", flat: "A-202", owner: "Neha Gupta", amount: "₹4,500", method: "Bank Transfer", date: "Feb 04, 2026", status: "paid" as const },
  { id: "PAY-003", flat: "B-201", owner: "Kiran Desai", amount: "₹5,200", method: "UPI", date: "Feb 03, 2026", status: "paid" as const },
  { id: "PAY-004", flat: "A-301", owner: "Raj Malhotra", amount: "₹4,500", method: "Card", date: "Feb 02, 2026", status: "paid" as const },
  { id: "PAY-005", flat: "B-102", owner: "Sanjay Kumar", amount: "₹4,800", method: "UPI", date: "Feb 01, 2026", status: "paid" as const },
];

export default function TreasurerDashboard() {
  return (
    <AdminLayout>
      <PageHeader title="Financial Overview" description="Track collections and outstanding payments" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Billed" value="₹2,16,000" icon={<IndianRupee className="h-5 w-5" />} trend="February 2026" />
        <StatCard label="Total Collected" value="₹1,44,000" icon={<TrendingUp className="h-5 w-5" />} variant="success" trend="32 payments received" />
        <StatCard label="Outstanding" value="₹72,000" icon={<TrendingDown className="h-5 w-5" />} variant="warning" trend="16 bills pending" />
        <StatCard label="Overdue Amount" value="₹15,600" icon={<FileText className="h-5 w-5" />} variant="destructive" trend="3 bills overdue" />
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-5 border-b">
          <h2 className="font-medium">Recent Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Payment ID</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Flat</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Owner</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Method</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium">{p.id}</td>
                  <td className="px-5 py-3.5 text-sm">{p.flat}</td>
                  <td className="px-5 py-3.5 text-sm">{p.owner}</td>
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
