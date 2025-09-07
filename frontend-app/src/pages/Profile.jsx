import AppShell from "../components/AppShell";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const settings = [
  { label: "Profile", path: "/profile" },
  { label: "Notifications", path: "/settings/notifications" },
  { label: "Privacy", path: "/settings/privacy" },
  { label: "Language", path: "/settings/language", value: "English" },
  { label: "Linked Accounts", path: "/settings/linked-accounts" },
];

const general = [
  { label: "App Version", value: "1.2.3" },
  { label: "Help & Support", path: "/settings/help" },
  { label: "Terms of Service", path: "/settings/terms" },
  { label: "Privacy Policy", path: "/settings/policy" },
];

export default function Settings() {
  return (
    <AppShell title="Settings" showFab={false}>
      <div className="divide-y divide-gray-200">
        {/* Account Section */}
        <div className="py-3">
          <h2 className="px-4 text-xs font-semibold text-gray-500 mb-2">ACCOUNT</h2>
          {settings.map((s, i) => (
            <Link
              key={i}
              to={s.path || "#"}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <span>{s.label}</span>
              <span className="flex items-center text-gray-400 text-sm">
                {s.value && <span className="mr-1">{s.value}</span>}
                <ChevronRight size={18} />
              </span>
            </Link>
          ))}
        </div>

        {/* General Section */}
        <div className="py-3">
          <h2 className="px-4 text-xs font-semibold text-gray-500 mb-2">GENERAL</h2>
          {general.map((s, i) => (
            <Link
              key={i}
              to={s.path || "#"}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <span>{s.label}</span>
              <span className="flex items-center text-gray-400 text-sm">
                {s.value && <span className="mr-1">{s.value}</span>}
                {s.path && <ChevronRight size={18} />}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
