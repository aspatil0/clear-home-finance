import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

const variantStyles = {
  default: "bg-card",
  success: "bg-card border-success/20",
  warning: "bg-card border-warning/20",
  destructive: "bg-card border-overdue/20",
};

const iconBg = {
  default: "bg-accent text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-overdue/10 text-overdue",
};

export function StatCard({ label, value, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border p-5 animate-fade-in", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight mt-1 financial-amount">{value}</p>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconBg[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
