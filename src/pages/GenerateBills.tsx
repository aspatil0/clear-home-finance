// import { useState, useEffect } from "react";
// import { getMaintenanceConfig } from "@/api/maintenance";
// import { getFlats } from "@/api/flats";
// import { generateInvoices } from "@/api/invoices";
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { AdminLayout } from "@/components/layouts/AdminLayout";
// import { PageHeader } from "@/components/shared/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Receipt, Mail, CheckCircle, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// export default function GenerateBills() {
//   const { user } = useAuth();
//   const [month, setMonth] = useState("february-2026");
//   const [sendEmail, setSendEmail] = useState(true);
//   const [generating, setGenerating] = useState(false);
//   const [generated, setGenerated] = useState(false);
//   const [latePayment, setLatePayment] = useState(false);
//   const [lateFeeRule, setLateFeeRule] = useState({
//     mode: "AUTO",
//     feeType: "Per Day %",
//     feeValue: 1.0,
//     graceDays: 0,
//     applyBase: "Outstanding",
//     autoRunHour: 0,
//     maxCap: "",
//     taxCode: "101",
//     compounding: false,
//     active: false,
//   });
//   const [latePaid, setLatePaid] = useState(false);
//   const { toast } = useToast();

//   // Dynamic: fetch maintenance config and calculate amount per flat

//   const [amountPerFlat, setAmountPerFlat] = useState(0);
//   const [totalFlats, setTotalFlats] = useState(0);

//   useEffect(() => {
//     async function fetchData() {
//       const societyId = user?.societyId || 1;
//       try {
//         // Fetch maintenance config
//         const data = await getMaintenanceConfig(societyId);
//         const charges = data?.data?.config?.charges;
//         if (Array.isArray(charges)) {
//           const total = charges.reduce((sum, c) => sum + (parseInt(c.amount) || 0), 0);
//           setAmountPerFlat(total);
//         } else {
//           setAmountPerFlat(0);
//         }
//         // Fetch flats for this society
//         const flats = await getFlats(societyId);
//         setTotalFlats(Array.isArray(flats) ? flats.length : 0);
//       } catch (err) {
//         setAmountPerFlat(0);
//         setTotalFlats(0);
//       }
//     }
//     fetchData();
//   }, [user?.societyId]);

//   const outstanding = amountPerFlat * totalFlats;
//   const lateFee = latePayment && lateFeeRule.active
//     ? Math.min(
//         ((lateFeeRule.feeValue / 100) * outstanding * Math.max(1, lateFeeRule.graceDays)),
//         lateFeeRule.maxCap ? Number(lateFeeRule.maxCap) : Number.POSITIVE_INFINITY
//       )
//     : 0;
//   const totalWithLateFee = outstanding + lateFee;

//   const handleGenerate = async () => {
//     setGenerating(true);
//     // Fetch flats for this society
//     const societyId = user?.societyId || 1;
//     const flats = await getFlats(societyId);
//     // Prepare invoice data
//     const invoices = (Array.isArray(flats) ? flats : []).map((flat: any, idx: number) => ({
//       id: `INV-${month.replace(/[^\d]/g, "")}-${idx + 1}`,
//       flat: flat.flatNumber || flat.name || `Flat-${idx + 1}`,
//       owner: flat.ownerName || flat.owner || "",
//       amount: amountPerFlat,
//       status: "unpaid",
//       date: new Date(),
//       societyId,
//     }));
//     // Send to backend
//     await generateInvoices(societyId, invoices);
//     setGenerating(false);
//     setGenerated(true);
//     if (latePayment && lateFeeRule.active) setLatePaid(true);
//     toast({
//       title: "Bills generated successfully",
//       description: `${invoices.length} bills generated for ${month.replace("-", " ")}. ${sendEmail ? "Email notifications sent." : ""}${latePayment && lateFeeRule.active ? " Late payment applied." : ""}`,
//     });
//   };

//   return (
//     <AdminLayout>
//       <PageHeader title="Generate Bills" description="Generate monthly maintenance bills for all flats" />

//       <div className="max-w-lg">
//         {!generated ? (
//           <div className="bg-card rounded-lg border p-6 space-y-6 animate-fade-in">
//             <div className="space-y-2">
//               <Label>Billing Month</Label>
//               <Select value={month} onValueChange={setMonth}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="february-2026">February 2026</SelectItem>
//                   <SelectItem value="march-2026">March 2026</SelectItem>
//                   <SelectItem value="april-2026">April 2026</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//               <p className="text-sm font-medium">Bill Summary</p>
//               <div className="text-sm text-muted-foreground space-y-1">
//                 <div className="flex justify-between"><span>Total flats</span><span className="font-medium text-foreground">{totalFlats}</span></div>
//                 <div className="flex justify-between"><span>Amount per flat</span><span className="font-medium text-foreground">₹{amountPerFlat.toLocaleString()}</span></div>
//                 {!latePayment || !lateFeeRule.active ? (
//                   <div className="flex justify-between border-t pt-2 mt-2"><span className="font-medium text-foreground">Total billing</span><span className="font-semibold financial-amount">₹{(totalFlats * amountPerFlat).toLocaleString()}</span></div>
//                 ) : (
//                   <>
//                     <div className="flex justify-between"><span>Late Fee</span><span className="font-medium text-foreground">₹{lateFee.toLocaleString()}</span></div>
//                     <div className="flex justify-between border-t pt-2 mt-2"><span className="font-medium text-foreground">Total with Late Fee</span><span className="font-semibold financial-amount">₹{totalWithLateFee.toLocaleString()}</span></div>
//                   </>
//                 )}
//                 {latePaid && <div className="text-xs text-warning">Marked as Late Paid</div>}
//               </div>
//             </div>


//             <div className="flex items-center gap-2">
//               <Checkbox id="sendEmail" checked={sendEmail} onCheckedChange={(v) => setSendEmail(!!v)} />
//               <label htmlFor="sendEmail" className="text-sm text-muted-foreground cursor-pointer">
//                 <Mail className="inline h-3.5 w-3.5 mr-1" />
//                 Send email notifications to all residents
//               </label>
//             </div>

//             <div className="flex items-center gap-2">
//               <Checkbox id="latePayment" checked={latePayment} onCheckedChange={(v) => setLatePayment(!!v)} />
//               <label htmlFor="latePayment" className="text-sm text-muted-foreground cursor-pointer">
//                 <Receipt className="inline h-3.5 w-3.5 mr-1" />
//                 Apply Late Payment
//               </label>
//             </div>

//             {latePayment && (
//               <>
//                 <Card className="mt-2">
//                   <CardHeader>
//                     <CardTitle>Late Fee Rule</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-xs mb-1">Mode</label>
//                         <Input value={lateFeeRule.mode} onChange={e => setLateFeeRule(r => ({ ...r, mode: e.target.value }))} disabled className="bg-muted" />
//                       </div>
//                       <div>
//                         <label className="block text-xs mb-1">Fee Type</label>
//                         <Input value={lateFeeRule.feeType} onChange={e => setLateFeeRule(r => ({ ...r, feeType: e.target.value }))} disabled className="bg-muted" />
//                       </div>
//                       <div>
//                         <label className="block text-xs mb-1">Fee Value</label>
//                         <Input type="number" value={lateFeeRule.feeValue} onChange={e => setLateFeeRule(r => ({ ...r, feeValue: parseFloat(e.target.value) }))} />
//                       </div>
//                       <div>
//                         <label className="block text-xs mb-1">Grace Days</label>
//                         <Input type="number" value={lateFeeRule.graceDays} onChange={e => setLateFeeRule(r => ({ ...r, graceDays: parseInt(e.target.value) }))} />
//                       </div>
//                       <div>
//                         <label className="block text-xs mb-1">Apply Base</label>
//                         <Input value={lateFeeRule.applyBase} onChange={e => setLateFeeRule(r => ({ ...r, applyBase: e.target.value }))} disabled className="bg-muted" />
//                       </div>
//                       <div>
//                         <label className="block text-xs mb-1">Auto Run Hour UTC</label>
//                         <Input type="number" value={lateFeeRule.autoRunHour} onChange={e => setLateFeeRule(r => ({ ...r, autoRunHour: parseInt(e.target.value) }))} />
//                       </div>
//                       <div>
//                         <label className="block text-xs mb-1">Max Cap %</label>
//                         <Input type="number" value={lateFeeRule.maxCap} onChange={e => setLateFeeRule(r => ({ ...r, maxCap: e.target.value }))} />
//                       </div>
//                       <div>
//                         <label className="block text-xs mb-1">Tax Code</label>
//                         <Input value={lateFeeRule.taxCode} onChange={e => setLateFeeRule(r => ({ ...r, taxCode: e.target.value }))} />
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Switch checked={lateFeeRule.compounding} onCheckedChange={v => setLateFeeRule(r => ({ ...r, compounding: v }))} />
//                         <span className="text-xs">Compounding</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Switch checked={lateFeeRule.active} onCheckedChange={v => setLateFeeRule(r => ({ ...r, active: v }))} />
//                         <span className="text-xs">Active</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 {(lateFeeRule.active) && (
//                   <div className="mt-4 p-4 rounded-lg border bg-muted/50">
//                     <div className="flex justify-between text-base font-medium">
//                       <span>Total with Late Fee</span>
//                       <span>₹{totalWithLateFee.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             <Button className="w-full" onClick={handleGenerate} disabled={generating}>
//               {generating ? (
//                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Bills...</>
//               ) : (
//                 <><Receipt className="mr-2 h-4 w-4" /> Generate Bills</>
//               )}
//             </Button>
//           </div>
//         ) : (
//           <div className="bg-card rounded-lg border p-8 text-center animate-fade-in">
//             <div className="inline-flex items-center justify-center p-3 rounded-full bg-success/10 mb-4">
//               <CheckCircle className="h-8 w-8 text-success" />
//             </div>
//             <h3 className="text-lg font-medium mb-1">Bills Generated Successfully</h3>
//             <p className="text-sm text-muted-foreground mb-6">{totalFlats} bills for February 2026 have been generated and emailed to residents.</p>
//             <div className="flex justify-center gap-3">
//               <Button variant="outline" onClick={() => setGenerated(false)}>Generate Another</Button>
//               <Button onClick={() => window.location.href = "/admin/invoices"}>View Invoices</Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
import { useState, useEffect } from "react";
import { getMaintenanceConfig } from "@/api/maintenance";
import { getFlats } from "@/api/flats";
import { generateInvoices } from "@/api/invoices";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Receipt, Mail, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GenerateBills() {
  const { user } = useAuth();
  const { toast } = useToast();

  // YYYY-MM format (IMPORTANT)
  const [month, setMonth] = useState("2026-02");

  const [sendEmail, setSendEmail] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [latePayment, setLatePayment] = useState(false);
  const [latePaid, setLatePaid] = useState(false);

  const [amountPerFlat, setAmountPerFlat] = useState(0);
  const [totalFlats, setTotalFlats] = useState(0);

  const [lateFeeRule, setLateFeeRule] = useState({
    mode: "AUTO",
    feeType: "Per Day %",
    feeValue: 1,
    graceDays: 0,
    applyBase: "Outstanding",
    autoRunHour: 0,
    maxCap: "",
    taxCode: "101",
    compounding: false,
    active: false,
  });

  /* ----------------------------------------
     FETCH CONFIG + FLATS
  ---------------------------------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const societyId = user?.societyId || 1;

        const configRes = await getMaintenanceConfig(societyId);
        const charges = configRes?.data?.config?.charges || [];

        const total = Array.isArray(charges)
          ? charges.reduce(
              (sum: number, c: any) => sum + Number(c.amount || 0),
              0
            )
          : 0;

        setAmountPerFlat(total);

        const flats = await getFlats(societyId);
        setTotalFlats(Array.isArray(flats) ? flats.length : 0);
      } catch {
        setAmountPerFlat(0);
        setTotalFlats(0);
      }
    }

    fetchData();
  }, [user?.societyId]);

  /* ----------------------------------------
     CALCULATIONS
  ---------------------------------------- */
  const outstanding = amountPerFlat * totalFlats;

  const lateFee =
    latePayment && lateFeeRule.active
      ? Math.min(
          (lateFeeRule.feeValue / 100) * outstanding,
          lateFeeRule.maxCap
            ? Number(lateFeeRule.maxCap)
            : Number.POSITIVE_INFINITY
        )
      : 0;

  const totalWithLateFee = outstanding + lateFee;

  /* ----------------------------------------
     GENERATE INVOICES (FIXED)
  ---------------------------------------- */
  // const handleGenerate = async () => {
  //   try {
  //     setGenerating(true);

  //     const societyId = user?.societyId || 1;
  //     const flats = await getFlats(societyId);

  //     if (!Array.isArray(flats) || flats.length === 0) {
  //       throw new Error("No flats found");
  //     }

  //     const [year, monthIndex] = month.split("-").map(Number);
  //     const dueDate = new Date(year, monthIndex - 1, 1);

  //     const invoices = flats.map((flat: any, index: number) => ({
  //       invoiceNumber: `INV-${year}${String(monthIndex).padStart(2, "0")}-${String(
  //         index + 1
  //       ).padStart(3, "0")}`,
  //       flatId: flat._id, // ✅ Mongo ObjectId
  //       ownerName: flat.ownerName || "",
  //       amount: amountPerFlat,
  //       status: "Unpaid",
  //       dueDate,
  //       paidDate: null,
  //       societyId,
  //     }));

  //     await generateInvoices(societyId, invoices);

  //     setGenerated(true);
  //     if (latePayment && lateFeeRule.active) setLatePaid(true);

  //     toast({
  //       title: "Bills generated successfully",
  //       description: `${invoices.length} invoices generated for ${month}`,
  //     });
  //   } catch (err: any) {
  //     console.error(err);
  //     toast({
  //       title: "Failed to generate bills",
  //       description: err?.message || "Internal server error",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setGenerating(false);
  //   }
  // };
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const societyId = user?.societyId || 1;
      const flats = await getFlats(societyId);
      if (!Array.isArray(flats) || flats.length === 0) {
        throw new Error("No flats found");
      }
      const [year, monthIndex] = month.split("-").map(Number);
      const dueDate = `${year}-${String(monthIndex).padStart(2, "0")}-01`; // YYYY-MM-DD
      const invoices = flats.map((flat: any, index: number) => ({
        invoiceNumber: `INV-${year}${String(monthIndex).padStart(2, "0")}-${String(
          index + 1
        ).padStart(3, "0")}`,
        flatId: flat.id,               // ✅ FIXED (INT)
        societyId,                     // ✅ INT
        ownerName: flat.ownerName || "",
        amount: amountPerFlat,
        status: "Unpaid",              // ✅ ENUM MATCH
        dueDate,                       // ✅ DATE STRING
        paidDate: null,
      }));
      await generateInvoices(societyId, invoices);
      setGenerated(true);
      toast({
        title: "Bills generated successfully",
        description: `${invoices.length} invoices generated.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to generate bills",
        description: err?.message || "Server error",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };
  /* ----------------------------------------
     UI
  ---------------------------------------- */
  return (
    <AdminLayout>
      <PageHeader
        title="Generate Bills"
        description="Generate monthly maintenance bills for all flats"
      />

      <div className="max-w-lg">
        {!generated ? (
          <div className="bg-card rounded-lg border p-6 space-y-6">
            <div>
              <Label>Billing Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026-02">February 2026</SelectItem>
                  <SelectItem value="2026-03">March 2026</SelectItem>
                  <SelectItem value="2026-04">April 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total flats</span>
                <span>{totalFlats}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount per flat</span>
                <span>₹{amountPerFlat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{totalWithLateFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={sendEmail}
                onCheckedChange={(v) => setSendEmail(!!v)}
              />
              <Mail className="h-4 w-4" />
              <span className="text-sm">Send email notifications</span>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={latePayment}
                onCheckedChange={(v) => setLatePayment(!!v)}
              />
              <Receipt className="h-4 w-4" />
              <span className="text-sm">Apply late payment</span>
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Bills...
                </>
              ) : (
                <>
                  <Receipt className="mr-2 h-4 w-4" />
                  Generate Bills
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border p-8 text-center">
            <CheckCircle className="mx-auto h-10 w-10 text-green-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Bills Generated Successfully
            </h3>
            <p className="text-sm mb-6">
              {totalFlats} invoices generated for {month}
            </p>
            <Button onClick={() => (window.location.href = "/admin/invoices")}>
              View Invoices
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}