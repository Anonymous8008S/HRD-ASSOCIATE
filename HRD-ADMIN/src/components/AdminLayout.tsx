import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Building2, Home, Briefcase, FolderKanban, MessageSquare, LogOut, MessageSquareQuote } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import useAuthStore from "@/stores/useAuthStore";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/properties", icon: Building2, label: "Properties" },
  { to: "/commercial", icon: Briefcase, label: "Commercial" },
  { to: "/projects", icon: FolderKanban, label: "Projects" },
  { to: "/inquiries", icon: MessageSquare, label: "Inquiries" },
  { to: "/content", icon: MessageSquareQuote, label: "Content" },

];

const AdminLayout = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <img src={logo} alt="HRD Associates" className="w-10 h-10 rounded-md object-cover" />
          <div>
            <h1 className="text-sm font-semibold gold-text font-serif">HRD Associates</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest">BUILD | RENT | SALE</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground w-full transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
