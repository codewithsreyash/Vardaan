import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  FileText,
  Plus,
  MessageSquare,
  Recycle,
  Trophy,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ title = "Citizen App", children, showFab = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // ✅ use from AuthContext
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout(); // clear token + user
    navigate("/login", { replace: true }); // ✅ instant redirect
  };

  const navItems = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/my-reports", label: "My Reports", icon: <FileText size={18} /> },
    { to: "/suggestions", label: "Suggestions", icon: <MessageSquare size={18} /> },
    { to: "/trade-plastic", label: "Trade Tracking", icon: <Recycle size={18} /> },
    { to: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h1 className="text-xl font-bold">Citizen App</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
                location.pathname === item.to
                  ? "bg-red-600 text-white"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl hover:bg-red-600 mt-4"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button className="md:hidden" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>

      {/* Floating Action Button */}
      {showFab && (
        <button
          onClick={() => navigate("/add-report")}
          className="fixed bottom-6 right-6 md:right-10 md:bottom-10 bg-red-600 hover:bg-red-700 p-4 rounded-full shadow-xl"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
