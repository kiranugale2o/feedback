import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquarePlus, List, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/submit", label: "Submit Feedback", icon: MessageSquarePlus },
  { to: "/feedback", label: "All Feedback", icon: List },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquarePlus className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">FeedbackHub</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-8">{children}</main>
    </div>
  );
}
