import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  FileText,
  Plus,
  MessageSquare,
  Recycle,
  Trophy,
  MapPin,
  ThumbsUp,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ title = "CivicSetu", children, showFab = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/add-report", label: "Report an Issue", icon: <Plus size={18} /> },
    { to: "/my-reports", label: "My Reports", icon: <FileText size={18} /> },
    { to: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
    { to: "/track-report", label: "Track My Reports", icon: <MapPin size={18} /> },
    { to: "/trade-plastic", label: "Plastic Exchange", icon: <Recycle size={18} /> },
    { to: "/suggestions", label: "Suggestions & Feedback", icon: <MessageSquare size={18} /> },
    { to: "/voting", label: "Vote on Issues", icon: <ThumbsUp size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 z-50 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-green-600">🌍 CivicSetu</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} className="text-gray-700" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm font-medium ${
                location.pathname === item.to
                  ? "bg-green-100 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 mt-4"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <button className="md:hidden" onClick={() => setOpen(true)}>
              <Menu size={22} className="text-gray-700" />
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
          className="fixed bottom-6 right-6 md:right-10 md:bottom-10 bg-green-600 hover:bg-green-700 p-4 rounded-full shadow-lg text-white"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}
