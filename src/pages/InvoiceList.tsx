import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { getInvoices } from "@/api/invoices";
import { useAuth } from "@/contexts/AuthContext";

export default function InvoiceList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);
  useEffect(() => {
    async function fetchInvoices() {
      const societyId = user?.societyId || 1;
      const data = await getInvoices(societyId);
      const rows = Array.isArray(data) ? data : [];
      const normalized = rows.map((inv: any) => {
        const id = inv.invoiceNumber ?? (inv.id !== undefined ? String(inv.id) : "");
        const flat = inv.flatNumber ?? (inv.flatId !== undefined ? String(inv.flatId) : "");
        const owner = inv.ownerName ?? inv.owner ?? "";
        const amountNum = Number(inv.amount || 0);
        const amount = `₹${amountNum.toLocaleString()}`;
        const status = (inv.status || "Unpaid").toString().toLowerCase();
        const dateSrc = inv.dueDate || inv.createdAt || inv.date;
        const date = dateSrc ? new Date(dateSrc).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }) : "";
        return { id, flat, owner, amount, status, date, raw: inv };
      });
      setInvoices(normalized);
    }
    fetchInvoices();
  }, [user?.societyId]);

  const filtered = invoices.filter(
    (inv) =>
      inv.id?.toLowerCase().includes(search.toLowerCase()) ||
      inv.flat?.toLowerCase().includes(search.toLowerCase()) ||
      inv.owner?.toLowerCase().includes(search.toLowerCase())
  );

  async function downloadInvoiceAsPdf(inv: any) {
    // Try to use a global jsPDF. If not present, load from CDN at runtime.
    try {
      let jsPDFCtor: any = (window as any).jsPDF;
      if (!jsPDFCtor && (window as any).jspdf) {
        jsPDFCtor = (window as any).jspdf.jsPDF || (window as any).jspdf.default;
      }
      if (!jsPDFCtor) {
        // Load UMD build from CDN
        await new Promise<void>((resolve, reject) => {
          if (document.querySelector('script[data-jspdf]')) return resolve();
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.async = true;
          s.setAttribute('data-jspdf', 'true');
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load jspdf from CDN'));
          document.head.appendChild(s);
        });
        jsPDFCtor = (window as any).jsPDF || (window as any).jspdf?.jsPDF || (window as any).jspdf?.default;
      }
      if (!jsPDFCtor) throw new Error('jsPDF not available');
      const doc = new jsPDFCtor();
      const lines: string[] = [];
      lines.push(`Invoice: ${inv.id}`);
      lines.push(`Flat: ${inv.flat}`);
      lines.push(`Owner: ${inv.owner}`);
      lines.push(`Amount: ${inv.amount}`);
      lines.push(`Status: ${inv.status}`);
      lines.push(`Date: ${inv.date}`);
      lines.push("");
      // Add raw details if present
      if (inv.raw) {
        lines.push("Details:");
        for (const [k, v] of Object.entries(inv.raw)) {
          lines.push(`${k}: ${v}`);
        }
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const maxLineWidth = pageWidth - margin * 2;
      let cursorY = 20;
      doc.setFontSize(12);
      for (const line of lines) {
        const split = (doc as any).splitTextToSize(line, maxLineWidth);
        doc.text(split, margin, cursorY);
        cursorY += (split.length + 0.5) * 7;
        if (cursorY > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          cursorY = 20;
        }
      }

      doc.save(`${inv.id || 'invoice'}.pdf`);
    } catch (err) {
      // Fallback to CSV if jsPDF is not available
      console.warn('jsPDF not available, falling back to CSV', err);
      // Build a simple CSV for the invoice
      const rows = [
        ["Invoice", inv.id],
        ["Flat", inv.flat],
        ["Owner", inv.owner],
        ["Amount", inv.amount],
        ["Status", inv.status],
        ["Date", inv.date],
      ];

      const escape = (s: any) => {
        if (s === null || s === undefined) return "";
        const str = String(s);
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inv.id || 'invoice'}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }

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
                    <Button variant="ghost" size="sm" onClick={() => downloadInvoice(inv)}>
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
