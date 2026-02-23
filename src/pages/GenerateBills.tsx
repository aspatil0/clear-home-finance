import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Receipt, Mail, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GenerateBills() {

  const [month, setMonth] = useState("february-2026");
  const [sendEmail, setSendEmail] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [latePayment, setLatePayment] = useState(false);
  const [lateFeeRule, setLateFeeRule] = useState({
    mode: "AUTO",
    feeType: "Per Day %",
    feeValue: 1.0,
    graceDays: 0,
    applyBase: "Outstanding",
    autoRunHour: 0,
    maxCap: "",
    taxCode: "101",
    compounding: false,
    active: false,
  });
  const [latePaid, setLatePaid] = useState(false);
  const { toast } = useToast();

  // Example calculation: 1% per day on outstanding (hardcoded for demo)
  const outstanding = 4500 * 48; // ₹2,16,000
  const lateFee = latePayment && lateFeeRule.active
    ? Math.min(
        ((lateFeeRule.feeValue / 100) * outstanding * Math.max(1, lateFeeRule.graceDays)),
        lateFeeRule.maxCap ? Number(lateFeeRule.maxCap) : Number.POSITIVE_INFINITY
      )
    : 0;
  const totalWithLateFee = outstanding + lateFee;

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
    if (latePayment && lateFeeRule.active) setLatePaid(true);
    toast({
      title: "Bills generated successfully",
      description: `48 bills generated for February 2026. ${sendEmail ? "Email notifications sent." : ""}${latePayment && lateFeeRule.active ? " Late payment applied." : ""}`,
    });
  };

  return (
    <AdminLayout>
      <PageHeader title="Generate Bills" description="Generate monthly maintenance bills for all flats" />

      <div className="max-w-lg">
        {!generated ? (
          <div className="bg-card rounded-lg border p-6 space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label>Billing Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="february-2026">February 2026</SelectItem>
                  <SelectItem value="march-2026">March 2026</SelectItem>
                  <SelectItem value="april-2026">April 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Bill Summary</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between"><span>Total flats</span><span className="font-medium text-foreground">48</span></div>
                <div className="flex justify-between"><span>Amount per flat</span><span className="font-medium text-foreground">₹4,500</span></div>
                {!latePayment || !lateFeeRule.active ? (
                  <div className="flex justify-between border-t pt-2 mt-2"><span className="font-medium text-foreground">Total billing</span><span className="font-semibold financial-amount">₹2,16,000</span></div>
                ) : (
                  <>
                    <div className="flex justify-between"><span>Late Fee</span><span className="font-medium text-foreground">₹{lateFee.toLocaleString()}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2"><span className="font-medium text-foreground">Total with Late Fee</span><span className="font-semibold financial-amount">₹{totalWithLateFee.toLocaleString()}</span></div>
                  </>
                )}
                {latePaid && <div className="text-xs text-warning">Marked as Late Paid</div>}
              </div>
            </div>


            <div className="flex items-center gap-2">
              <Checkbox id="sendEmail" checked={sendEmail} onCheckedChange={(v) => setSendEmail(!!v)} />
              <label htmlFor="sendEmail" className="text-sm text-muted-foreground cursor-pointer">
                <Mail className="inline h-3.5 w-3.5 mr-1" />
                Send email notifications to all residents
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="latePayment" checked={latePayment} onCheckedChange={(v) => setLatePayment(!!v)} />
              <label htmlFor="latePayment" className="text-sm text-muted-foreground cursor-pointer">
                <Receipt className="inline h-3.5 w-3.5 mr-1" />
                Apply Late Payment
              </label>
            </div>

            {latePayment && (
              <>
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle>Late Fee Rule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs mb-1">Mode</label>
                        <Input value={lateFeeRule.mode} onChange={e => setLateFeeRule(r => ({ ...r, mode: e.target.value }))} disabled className="bg-muted" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Fee Type</label>
                        <Input value={lateFeeRule.feeType} onChange={e => setLateFeeRule(r => ({ ...r, feeType: e.target.value }))} disabled className="bg-muted" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Fee Value</label>
                        <Input type="number" value={lateFeeRule.feeValue} onChange={e => setLateFeeRule(r => ({ ...r, feeValue: parseFloat(e.target.value) }))} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Grace Days</label>
                        <Input type="number" value={lateFeeRule.graceDays} onChange={e => setLateFeeRule(r => ({ ...r, graceDays: parseInt(e.target.value) }))} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Apply Base</label>
                        <Input value={lateFeeRule.applyBase} onChange={e => setLateFeeRule(r => ({ ...r, applyBase: e.target.value }))} disabled className="bg-muted" />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Auto Run Hour UTC</label>
                        <Input type="number" value={lateFeeRule.autoRunHour} onChange={e => setLateFeeRule(r => ({ ...r, autoRunHour: parseInt(e.target.value) }))} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Max Cap %</label>
                        <Input type="number" value={lateFeeRule.maxCap} onChange={e => setLateFeeRule(r => ({ ...r, maxCap: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Tax Code</label>
                        <Input value={lateFeeRule.taxCode} onChange={e => setLateFeeRule(r => ({ ...r, taxCode: e.target.value }))} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={lateFeeRule.compounding} onCheckedChange={v => setLateFeeRule(r => ({ ...r, compounding: v }))} />
                        <span className="text-xs">Compounding</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={lateFeeRule.active} onCheckedChange={v => setLateFeeRule(r => ({ ...r, active: v }))} />
                        <span className="text-xs">Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {(lateFeeRule.active) && (
                  <div className="mt-4 p-4 rounded-lg border bg-muted/50">
                    <div className="flex justify-between text-base font-medium">
                      <span>Total with Late Fee</span>
                      <span>₹{totalWithLateFee.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            <Button className="w-full" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Bills...</>
              ) : (
                <><Receipt className="mr-2 h-4 w-4" /> Generate Bills</>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border p-8 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-success/10 mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-medium mb-1">Bills Generated Successfully</h3>
            <p className="text-sm text-muted-foreground mb-6">48 bills for February 2026 have been generated and emailed to residents.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setGenerated(false)}>Generate Another</Button>
              <Button onClick={() => window.location.href = "/admin/invoices"}>View Invoices</Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
