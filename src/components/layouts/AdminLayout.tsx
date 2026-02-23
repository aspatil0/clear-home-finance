import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Settings,
  FileText,
  CreditCard,
  Building2,
  LogOut,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Society Setup", to: "/admin/setup", icon: <Building2 className="h-4 w-4" /> },
  { label: "Maintenance Config", to: "/admin/maintenance", icon: <Settings className="h-4 w-4" /> },
  { label: "Generate Bills", to: "/admin/generate-bills", icon: <Receipt className="h-4 w-4" /> },
  { label: "Invoices", to: "/admin/invoices", icon: <FileText className="h-4 w-4" /> },
];

const treasurerNav: NavItem[] = [
  { label: "Dashboard", to: "/treasurer", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Payments", to: "/treasurer/payments", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Invoices", to: "/treasurer/invoices", icon: <FileText className="h-4 w-4" /> },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === "treasurer" ? treasurerNav : adminNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sidebar-primary" />
            <div>
              <h2 className="text-sm font-semibold text-sidebar-accent-foreground">SocietyHub</h2>
              <p className="text-xs text-sidebar-foreground/60">{user?.societyName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/treasurer"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-accent-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm w-full text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
