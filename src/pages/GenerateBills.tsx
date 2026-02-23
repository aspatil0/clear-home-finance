import { useState } from "react";
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
  const { toast } = useToast();

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
    toast({
      title: "Bills generated successfully",
      description: `48 bills generated for February 2026. ${sendEmail ? "Email notifications sent." : ""}`,
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
                <div className="flex justify-between border-t pt-2 mt-2"><span className="font-medium text-foreground">Total billing</span><span className="font-semibold financial-amount">₹2,16,000</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="sendEmail" checked={sendEmail} onCheckedChange={(v) => setSendEmail(!!v)} />
              <label htmlFor="sendEmail" className="text-sm text-muted-foreground cursor-pointer">
                <Mail className="inline h-3.5 w-3.5 mr-1" />
                Send email notifications to all residents
              </label>
            </div>

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
