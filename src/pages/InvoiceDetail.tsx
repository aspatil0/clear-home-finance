import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Mail, Building2 } from "lucide-react";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <PageHeader
        title=""
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-3.5 w-3.5" /> Resend
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-3.5 w-3.5" /> Download PDF
            </Button>
          </div>
        }
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg border p-8 animate-fade-in">
          {/* Invoice Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Green Valley Residency</h2>
                <p className="text-sm text-muted-foreground">123 Green Valley Road, Pune 411001</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">{id}</p>
              <StatusBadge status="unpaid" />
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Bill To</p>
              <p className="text-sm font-medium">Amit Patel</p>
              <p className="text-sm text-muted-foreground">Flat A-301</p>
              <p className="text-sm text-muted-foreground">amit@email.com</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Details</p>
              <p className="text-sm"><span className="text-muted-foreground">Date:</span> Feb 01, 2026</p>
              <p className="text-sm"><span className="text-muted-foreground">Due:</span> Feb 15, 2026</p>
              <p className="text-sm"><span className="text-muted-foreground">Period:</span> February 2026</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="border rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Description</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Base Maintenance", amount: "₹3,000" },
                  { label: "Sinking Fund", amount: "₹500" },
                  { label: "Water Charges", amount: "₹400" },
                  { label: "Parking", amount: "₹300" },
                  { label: "Common Area Electricity", amount: "₹300" },
                ].map((item) => (
                  <tr key={item.label} className="border-t">
                    <td className="px-4 py-3 text-sm">{item.label}</td>
                    <td className="px-4 py-3 text-sm text-right financial-amount">{item.amount}</td>
                  </tr>
                ))}
                <tr className="border-t bg-muted/20">
                  <td className="px-4 py-3 text-sm font-semibold">Total</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold financial-amount">₹4,500</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This is a computer-generated invoice and does not require a signature.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
