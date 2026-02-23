import { useState } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Society {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

const initialSocieties: Society[] = [
  { id: "1", name: "Green Valley Residency", email: "admin@greenvalley.com", phone: "9876543210", active: true },
  { id: "2", name: "Sunrise Apartments", email: "admin@sunrise.com", phone: "9876543211", active: true },
  { id: "3", name: "Lake View Heights", email: "admin@lakeview.com", phone: "9876543212", active: false },
  { id: "4", name: "Palm Grove Society", email: "admin@palmgrove.com", phone: "9876543213", active: true },
  { id: "5", name: "Silver Oaks Residency", email: "admin@silveroaks.com", phone: "9876543214", active: false },
];

export default function SuperAdminAllSocieties() {
  const [societies, setSocieties] = useState<Society[]>(initialSocieties);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const toggleActive = (id: string) => {
    setSocieties((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, active: !s.active };
        toast({
          title: updated.active ? "Society Activated" : "Society Deactivated",
          description: `${s.name} has been ${updated.active ? "activated" : "deactivated"}.`,
        });
        return updated;
      })
    );
  };

  const filtered = societies.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SuperAdminLayout>
      <PageHeader title="All Societies" description="View and manage all registered societies" />

      <div className="bg-card rounded-lg border animate-fade-in">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search societies..."
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
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Society Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Phone</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium">{s.name}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.email}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.phone}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.active
                          ? "bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Switch checked={s.active} onCheckedChange={() => toggleActive(s.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
