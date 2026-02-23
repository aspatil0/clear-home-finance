import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Building2, CheckCircle, XCircle, CreditCard } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <SuperAdminLayout>
      <PageHeader title="Super Admin Dashboard" description="Manage all societies and platform configuration" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Societies" value="12" icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Active" value="10" icon={<CheckCircle className="h-5 w-5" />} variant="success" />
        <StatCard label="Inactive" value="2" icon={<XCircle className="h-5 w-5" />} variant="warning" />
        <StatCard label="Payment Configs" value="8" icon={<CreditCard className="h-5 w-5" />} />
      </div>

      <div className="bg-card rounded-lg border p-6 animate-fade-in">
        <h3 className="font-medium mb-2">Welcome, System Admin</h3>
        <p className="text-sm text-muted-foreground">
          Use the sidebar to manage societies, view all registered societies, and configure payment settings.
        </p>
      </div>
    </SuperAdminLayout>
  );
}
