import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import InstallPrompt from "./InstallPrompt";

export default function Navbar() {
  const { user } = useAuth();
  const { setSidebarOpen } = useUI();
  const loc = useLocation();

  return (
    <nav className="flex items-center justify-between p-3 bg-slate-900 text-white">
      <button onClick={() => setSidebarOpen(true)} aria-label="menu" className="text-2xl leading-none">☰</button>
      <Link to="/" className="font-extrabold text-lg">CivicApp</Link>
      <div className="flex items-center gap-3">
        <InstallPrompt hiddenOnPaths={["/login","/register"]} />
        <Link to="/profile" className="rounded-full bg-white/10 p-1 px-2 text-sm">
          {user?.name ?? "Profile"}
        </Link>
      </div>
    </nav>
  );
}
