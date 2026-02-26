import { ResidentLayout } from "@/components/layouts/ResidentLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Calendar, Download, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSociety } from "@/api/societies";
import { getFlats } from "@/api/flats";
import { getInvoices } from "@/api/invoices";
import { getMaintenanceConfig } from "@/api/maintenance";

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [societyName, setSocietyName] = useState<string | null>(null);
  const [flat, setFlat] = useState<any | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<any | null>(null);
  const [charges, setCharges] = useState<Array<{ label: string; amount: string }>>([]);

  const fmt = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  useEffect(() => {
    if (!user?.societyId) return;
    const id = Number(user.societyId);
    if (Number.isNaN(id)) return;
    getSociety(id)
      .then((res) => {
        if (res && res.name) setSocietyName(res.name);
      })
      .catch(() => {});
  }, [user?.societyId]);

  // fetch maintenance config (charges may be stored as JSON string in DB)
  useEffect(() => {
    if (!user?.societyId) return;
    getMaintenanceConfig(String(user.societyId))
      .then((res) => {
        if (!res) return;
        // backend returns { data: { config: { charges } } }
        let fetched: any = res?.data?.config?.charges ?? res.charges ?? res;
        try {
          if (typeof fetched === "string") fetched = JSON.parse(fetched);
        } catch (e) {
          // ignore parse error
        }
        if (Array.isArray(fetched)) {
          setCharges(fetched.map((c: any) => ({ label: c.label, amount: String(c.amount) })));
        }
      })
      .catch(() => {});
  }, [user?.societyId]);

  const maintenanceTotal = charges && charges.length ? charges.reduce((s, c) => s + Number(c.amount || 0), 0) : 0;

  async function downloadInvoice(invRaw: any) {
    if (!invRaw) return;
    const inv = {
      id: invRaw.invoiceNumber ?? (invRaw.id !== undefined ? String(invRaw.id) : ""),
      flat: flat?.flatNumber ?? (invRaw.flatNumber ?? (invRaw.flatId !== undefined ? String(invRaw.flatId) : "")),
      owner: invRaw.ownerName ?? invRaw.owner ?? flat?.ownerName ?? "",
      amount: `₹${Number(invRaw.amount || maintenanceTotal).toLocaleString()}`,
      status: (invRaw.status || "Unpaid").toString().toLowerCase(),
      date: invRaw.dueDate ? new Date(invRaw.dueDate).toLocaleDateString() : invRaw.createdAt ? new Date(invRaw.createdAt).toLocaleDateString() : "",
      raw: invRaw,
    };

    try {
      let jsPDFCtor: any = (window as any).jsPDF;
      if (!jsPDFCtor && (window as any).jspdf) {
        jsPDFCtor = (window as any).jspdf.jsPDF || (window as any).jspdf.default;
      }
      if (!jsPDFCtor) {
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
      console.warn('jsPDF not available, falling back to CSV', err);
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

  async function payNow() {
    if (!currentInvoice) return;
    try {
      // Call backend to mark paid
      const invoiceNumber = currentInvoice.invoiceNumber || currentInvoice.id;
      if (!invoiceNumber) return;
      const res = await (await import("@/api/invoices")).markInvoicePaid(invoiceNumber);
      // update UI
      setCurrentInvoice((prev: any) => ({ ...(prev || {}), status: "Paid", paidDate: new Date().toISOString().split('T')[0] }));
      // Optionally show toast (if useToast available)
      // TODO: integrate with toasts
    } catch (err) {
      console.error('Failed to mark invoice paid', err);
    }
  }

  // find resident's flat
  useEffect(() => {
    if (!user?.societyId) return;
    const sid = Number(user.societyId);
    if (Number.isNaN(sid)) return;
    getFlats(sid)
      .then((res) => {
        if (!res || !Array.isArray(res)) return;
        // try match by email first, then by name
        const found = res.find((f: any) => (f.email && user.email && f.email.toLowerCase() === user.email.toLowerCase()) || (f.ownerName && user.name && f.ownerName.toLowerCase() === user.name.toLowerCase()));
        if (found) setFlat(found);
      })
      .catch(() => {});
  }, [user?.societyId, user?.email, user?.name]);

  // fetch maintenance config
  useEffect(() => {
    if (!user?.societyId) return;
    getMaintenanceConfig(String(user.societyId))
      .then((res) => {
        if (res && res.charges) setCharges(res.charges);
      })
      .catch(() => {});
  }, [user?.societyId]);

  // fetch invoices and find current unpaid for this flat
  useEffect(() => {
    if (!user?.societyId || !flat) return;
    const sid = Number(user.societyId);
    getInvoices(sid)
      .then((res) => {
        if (!res || !Array.isArray(res)) return;
        const candidates = res.filter((inv: any) => {
          // match by flatId or ownerName or email
          if (flat.id && inv.flatId && Number(inv.flatId) === Number(flat.id)) return true;
          if (inv.ownerName && flat.ownerName && inv.ownerName.toLowerCase() === flat.ownerName.toLowerCase()) return true;
          return false;
        });
        // find latest unpaid (status may be 'Unpaid' or 'unpaid')
        const unpaid = candidates.filter((c: any) => (c.status || "").toString().toLowerCase() === "unpaid");
        const pick = unpaid.length ? unpaid.sort((a: any, b: any) => new Date(b.dueDate || b.createdAt).getTime() - new Date(a.dueDate || a.createdAt).getTime())[0] : candidates.sort((a: any, b: any) => new Date(b.dueDate || b.createdAt).getTime() - new Date(a.dueDate || a.createdAt).getTime())[0];
        if (pick) setCurrentInvoice(pick);
      })
      .catch(() => {});
  }, [user?.societyId, flat]);

  const displayName = (flat && (flat.ownerName || flat.owner)) || user?.name || user?.email || "Resident";

  return (
    <ResidentLayout>
      <PageHeader
        title={`Welcome back, ${displayName}`}
        description={
          societyName
            ? `Here's your maintenance summary — ${societyName}${flat && flat.flatNumber ? ` • Flat ${flat.flatNumber}` : ""}`
            : "Here's your maintenance summary"
        }
      />

      {/* Current Bill Card */}
      <div className="bg-card rounded-lg border p-6 mb-6 animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Month's Bill</p>
            <p className="text-3xl font-semibold tracking-tight mt-1 financial-amount">{maintenanceTotal ? fmt(maintenanceTotal) : currentInvoice ? fmt(Number(currentInvoice.amount)) : "—"}</p>
          </div>
          <StatusBadge status={(currentInvoice && (String(currentInvoice.status).toLowerCase() as any)) || "unpaid"} />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due: {currentInvoice ? new Date(currentInvoice.dueDate || currentInvoice.createdAt).toLocaleDateString() : "—"}</span>
          <span>Invoice: {currentInvoice ? currentInvoice.invoiceNumber : "—"}</span>
        </div>
        <div className="flex gap-3">
          <Button onClick={payNow} disabled={!currentInvoice}>
            <IndianRupee className="mr-2 h-4 w-4" />
            Pay Now
          </Button>
          <Button variant="outline" onClick={() => downloadInvoice(currentInvoice)} disabled={!currentInvoice}>
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-card rounded-lg border p-6 mb-6 animate-fade-in">
        <h3 className="font-medium mb-4">Bill Breakdown</h3>
        <div className="space-y-3">
          {charges && charges.length ? (
            charges.map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="financial-amount">{fmt(Number(item.amount || 0))}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No breakdown available</div>
          )}
          <div className="border-t pt-3 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span className="financial-amount">{maintenanceTotal ? fmt(maintenanceTotal) : "—"}</span>
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
