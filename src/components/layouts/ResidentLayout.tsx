import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, FileText, Home, LogOut, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResidentLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">SocietyHub</span>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { label: "Home", to: "/resident", icon: <Home className="h-4 w-4" /> },
              { label: "Invoices", to: "/resident/invoices", icon: <FileText className="h-4 w-4" /> },
              { label: "Payments", to: "/resident/payments", icon: <CreditCard className="h-4 w-4" /> },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/resident"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Flat {user?.flatNumber}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
