import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { 
  X, Home, PlusCircle, FileText, Trophy, MapPin, 
  Recycle, MessageSquare, ThumbsUp, Settings, LogOut 
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: <Home size={18} /> },
  { to: "/add-report", label: "Report an Issue", icon: <PlusCircle size={18} /> },
  { to: "/my-reports", label: "My Reports", icon: <FileText size={18} /> },
  { to: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
  { to: "/track-report", label: "Track My Reports", icon: <MapPin size={18} /> },
  { to: "/trade-plastic", label: "Plastic Exchange", icon: <Recycle size={18} /> },
  { to: "/suggestions", label: "Suggestions & Feedback", icon: <MessageSquare size={18} /> },
  { to: "/voting", label: "Vote on Issues", icon: <ThumbsUp size={18} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-gray-900 shadow-xl transform flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-bold text-lg text-green-600">🌍 CivicSetu</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Links */}
        <ul className="p-3 space-y-1 flex-1 overflow-y-auto">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                  loc.pathname === l.to
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {l.icon}
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ✅ Logout at bottom */}
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
