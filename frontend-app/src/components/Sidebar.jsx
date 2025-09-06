import { Link, useLocation } from "react-router-dom";
import { useUI } from "../context/UIContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/add-report", label: "Add Report" },
  { to: "/my-reports", label: "My Reports" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/track-report", label: "Track My Report" },
  { to: "/trade-plastic", label: "Trade Plastic" },
  { to: "/suggestions", label: "Suggestions" },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const loc = useLocation();

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-800 text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="font-bold">Menu</div>
        <button onClick={() => setSidebarOpen(false)} className="text-xl">✖</button>
      </div>
      <ul className="p-3 space-y-1">
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              onClick={() => setSidebarOpen(false)}
              className={`block rounded-lg px-3 py-2 ${loc.pathname === l.to ? "bg-white/15" : "hover:bg-white/10"}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
