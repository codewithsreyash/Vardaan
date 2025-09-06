import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/reports/my").then((res) => setReports(res.data));
  }, []);

  return (
    <AppShell title="My Reports">
      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <h2 className="font-semibold">{r.title || r.category}</h2>
            <p className="text-sm text-white/70">{r.description}</p>
            <p className="text-xs mt-2">
              Status:{" "}
              <span className="capitalize font-semibold">{r.status}</span>
            </p>
          </div>
        ))}
        {reports.length === 0 && (
          <p className="text-white/60">No reports submitted yet.</p>
        )}
      </div>
    </AppShell>
  );
}
