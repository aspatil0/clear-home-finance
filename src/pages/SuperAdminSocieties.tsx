import { useState, useEffect } from "react";
import { createSociety, getAllSocieties, Society } from "@/api/societies";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocietyForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}


const emptyForm: SocietyForm = { name: "", email: "", phone: "", address: "" };

export default function SuperAdminSocieties() {
  const [societies, setSocieties] = useState<Society[]>([]);

  // Fetch all societies on mount and after creation
  useEffect(() => {
    fetchSocieties();
    // eslint-disable-next-line
  }, []);

  const fetchSocieties = async () => {
    try {
      const data = await getAllSocieties();
      setSocieties(data);
    } catch (err) {
      // Optionally show error
    }
  };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SocietyForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<SocietyForm>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const validate = (): boolean => {
    const e: Partial<SocietyForm> = {};
    if (!form.name.trim()) e.name = "Society name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createSociety({
        name: form.name,
        email: form.email,
        address: form.address,
      });
      setSaving(false);
      setSaved(true);
      toast({ title: "Society created", description: `${form.name} has been added successfully.` });
      fetchSocieties();
      setTimeout(() => {
        setSaved(false);
        setForm(emptyForm);
        setErrors({});
        setOpen(false);
      }, 1500);
    } catch (err) {
      setSaving(false);
      toast({ title: "Error", description: "Failed to create society." });
    }
  };

  const updateField = (field: keyof SocietyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <SuperAdminLayout>
      <PageHeader title="Societies" description="Create and manage housing societies" />

      <div className="mb-6">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Society
        </Button>
      </div>


      <div className="bg-card rounded-lg border p-8 animate-fade-in">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Society Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Address</th>
              <th className="text-left px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {societies.map((soc) => (
              <tr key={soc.id} className="border-b">
                <td className="px-4 py-2">{soc.name}</td>
                <td className="px-4 py-2">{soc.email}</td>
                <td className="px-4 py-2">{soc.address}</td>
                <td className="px-4 py-2">{new Date(soc.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {societies.length === 0 && (
              <tr><td colSpan={4} className="text-center text-muted-foreground py-4">No societies found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Society</DialogTitle>
            <DialogDescription>Fill in the details to register a new housing society.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="soc-name">Society Name</Label>
              <Input id="soc-name" placeholder="e.g. Green Valley Residency" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="soc-email">Email</Label>
              <Input id="soc-email" type="email" placeholder="society@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="soc-phone">Phone Number</Label>
              <Input id="soc-phone" placeholder="9876543210" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="soc-address">Address</Label>
              <Textarea id="soc-address" placeholder="Full address of the society" value={form.address} onChange={(e) => updateField("address", e.target.value)} rows={3} />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saving || saved}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saved && <CheckCircle className="mr-2 h-4 w-4" />}
              {saved ? "Created!" : saving ? "Creating..." : "Create Society"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
}
