import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Flat {
  id: string;
  number: string;
  owner: string;
  email: string;
  area: string;
}

const initialFlats: Flat[] = [
  { id: "1", number: "A-101", owner: "Amit Patel", email: "amit@email.com", area: "1200" },
  { id: "2", number: "A-102", owner: "Sunita Rao", email: "sunita@email.com", area: "1200" },
  { id: "3", number: "A-201", owner: "Vikram Singh", email: "vikram@email.com", area: "1450" },
];

export default function SocietySetup() {
  const [societyName, setSocietyName] = useState("Green Valley Residency");
  const [address, setAddress] = useState("123 Green Valley Road, Pune 411001");
  const [flats, setFlats] = useState<Flat[]>(initialFlats);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const addFlat = () => {
    setFlats([...flats, { id: Date.now().toString(), number: "", owner: "", email: "", area: "" }]);
  };

  const removeFlat = (id: string) => {
    setFlats(flats.filter((f) => f.id !== id));
  };

  const updateFlat = (id: string, field: keyof Flat, value: string) => {
    setFlats(flats.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleSave = () => {
    setSaved(true);
    toast({ title: "Society details saved", description: "All changes have been saved successfully." });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <PageHeader title="Society Setup" description="Configure your society details and flat registry" />

      <div className="space-y-6 max-w-4xl">
        <div className="bg-card rounded-lg border p-6 animate-fade-in">
          <h3 className="font-medium mb-4">Society Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Society Name</Label>
              <Input value={societyName} onChange={(e) => setSocietyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Flat Registry</h3>
            <Button variant="outline" size="sm" onClick={addFlat}>
              <Plus className="mr-2 h-3.5 w-3.5" /> Add Flat
            </Button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[80px_1fr_1fr_80px_40px] gap-3 text-xs font-medium text-muted-foreground px-1">
              <span>Flat No.</span>
              <span>Owner Name</span>
              <span>Email</span>
              <span>Area (sqft)</span>
              <span></span>
            </div>
            {flats.map((flat) => (
              <div key={flat.id} className="grid grid-cols-[80px_1fr_1fr_80px_40px] gap-3 items-center">
                <Input value={flat.number} onChange={(e) => updateFlat(flat.id, "number", e.target.value)} placeholder="A-101" className="text-sm" />
                <Input value={flat.owner} onChange={(e) => updateFlat(flat.id, "owner", e.target.value)} placeholder="Owner name" className="text-sm" />
                <Input value={flat.email} onChange={(e) => updateFlat(flat.id, "email", e.target.value)} placeholder="email@example.com" className="text-sm" />
                <Input value={flat.area} onChange={(e) => updateFlat(flat.id, "area", e.target.value)} placeholder="1200" className="text-sm" />
                <Button variant="ghost" size="icon" onClick={() => removeFlat(flat.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            {saved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
