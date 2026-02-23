import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CheckCircle, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChargeItem {
  id: string;
  label: string;
  amount: string;
}

export default function MaintenanceConfig() {
  const [charges, setCharges] = useState<ChargeItem[]>([
    { id: "1", label: "Base Maintenance", amount: "3000" },
    { id: "2", label: "Sinking Fund", amount: "500" },
    { id: "3", label: "Water Charges", amount: "400" },
    { id: "4", label: "Parking", amount: "300" },
    { id: "5", label: "Common Area Electricity", amount: "300" },
  ]);
  const [dueDay, setDueDay] = useState("15");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const total = charges.reduce((sum, c) => sum + (parseInt(c.amount) || 0), 0);

  const addCharge = () => {
    setCharges([...charges, { id: Date.now().toString(), label: "", amount: "" }]);
  };

  const removeCharge = (id: string) => setCharges(charges.filter((c) => c.id !== id));

  const updateCharge = (id: string, field: "label" | "amount", value: string) => {
    setCharges(charges.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleSave = () => {
    setSaved(true);
    toast({ title: "Configuration saved", description: "Maintenance charges updated successfully." });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <PageHeader title="Maintenance Configuration" description="Set up monthly maintenance charge components" />

      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-lg border p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Charge Components</h3>
            <Button variant="outline" size="sm" onClick={addCharge}>
              <Plus className="mr-2 h-3.5 w-3.5" /> Add Component
            </Button>
          </div>

          <div className="space-y-3">
            {charges.map((charge) => (
              <div key={charge.id} className="flex items-center gap-3">
                <Input
                  value={charge.label}
                  onChange={(e) => updateCharge(charge.id, "label", e.target.value)}
                  placeholder="Charge name"
                  className="flex-1 text-sm"
                />
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                  <Input
                    value={charge.amount}
                    onChange={(e) => updateCharge(charge.id, "amount", e.target.value)}
                    placeholder="0"
                    className="pl-7 text-sm text-right"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeCharge(charge.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="text-sm font-medium">Total per flat</span>
            <span className="text-lg font-semibold financial-amount">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 animate-fade-in">
          <h3 className="font-medium mb-4">Payment Terms</h3>
          <div className="space-y-2 max-w-xs">
            <Label>Due Date (Day of month)</Label>
            <Input value={dueDay} onChange={(e) => setDueDay(e.target.value)} type="number" min="1" max="28" />
            <p className="text-xs text-muted-foreground">Bills will be due on the {dueDay}th of each month</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            {saved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            {saved ? "Saved!" : "Save Configuration"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
