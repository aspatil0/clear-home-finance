import { ResidentLayout } from "@/components/layouts/ResidentLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Calendar, Download, ArrowRight } from "lucide-react";

export default function ResidentDashboard() {
  const navigate = useNavigate();

  return (
    <ResidentLayout>
      <PageHeader title="Welcome back, Amit" description="Here's your maintenance summary" />

      {/* Current Bill Card */}
      <div className="bg-card rounded-lg border p-6 mb-6 animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Month's Bill</p>
            <p className="text-3xl font-semibold tracking-tight mt-1 financial-amount">₹4,500</p>
          </div>
          <StatusBadge status="unpaid" />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due: Feb 15, 2026</span>
          <span>Invoice: INV-2026-006</span>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/resident/pay/INV-2026-006")}>
            <IndianRupee className="mr-2 h-4 w-4" />
            Pay Now
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-card rounded-lg border p-6 mb-6 animate-fade-in">
        <h3 className="font-medium mb-4">Bill Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: "Base Maintenance", amount: "₹3,000" },
            { label: "Sinking Fund", amount: "₹500" },
            { label: "Water Charges", amount: "₹400" },
            { label: "Parking", amount: "₹300" },
            { label: "Common Area Electricity", amount: "₹300" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="financial-amount">{item.amount}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span className="financial-amount">₹4,500</span>
          </div>
        </div>
      </div>

      {/* Past Bills */}
      <div className="bg-card rounded-lg border">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-medium">Past Bills</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/resident/invoices")}>
            View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="divide-y">
          {[
            { month: "January 2026", amount: "₹4,500", status: "paid" as const, date: "Jan 10, 2026" },
            { month: "December 2025", amount: "₹4,500", status: "paid" as const, date: "Dec 12, 2025" },
            { month: "November 2025", amount: "₹4,200", status: "paid" as const, date: "Nov 08, 2025" },
          ].map((bill) => (
            <div key={bill.month} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium">{bill.month}</p>
                <p className="text-xs text-muted-foreground">Paid on {bill.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm financial-amount">{bill.amount}</span>
                <StatusBadge status={bill.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResidentLayout>
  );
}
