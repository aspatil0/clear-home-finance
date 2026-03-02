
import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllSocieties, Society } from "@/api/societies";



export default function SuperAdminAllSocieties() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const data = await getAllSocieties();
      setSocieties(data);
    } catch (err) {
      // Optionally show error
    }
  };

  // Placeholder for toggleActive if you want to implement status toggling in the future
  const toggleActive = (id: number) => {
    // Implement status toggle logic here if needed
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
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.address}</td>
                  <td className="px-5 py-3.5">
                    {/* Status/Active logic can be added here if you have such a field in DB */}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {/* Actions can be added here */}
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
