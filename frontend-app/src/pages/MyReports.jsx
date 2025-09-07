import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

const statusTabs = ["All", "Active", "Resolved", "Draft"];

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/reports/my")
      .then((res) => {
        setReports(res.data || []);
        setFiltered(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
      });
  }, []);

  useEffect(() => {
    let data = [...reports];
    if (activeTab !== "All") {
      data = data.filter(
        (r) => r.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }
    if (search.trim()) {
      data = data.filter((r) =>
        (r.category || r.description || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }
    setFiltered(data);
  }, [activeTab, search, reports]);

  return (
    <AppShell title="My Reports">
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg text-sm"
        />

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Report List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="p-4 border rounded-xl bg-white shadow-sm"
              >
                <h2 className="font-semibold text-gray-800">
                  {r.category}
                </h2>
                <p className="text-sm text-gray-600">{r.description}</p>
                {r.photo_url && (
                  <img
                    src={r.photo_url}
                    alt="issue"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
                <p className="text-xs mt-2">
                  Status:{" "}
                  <span
                    className={`capitalize font-semibold ${
                      r.status === "Active"
                        ? "text-yellow-600"
                        : r.status === "Resolved"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </p>
                {r.suggestion && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Suggestion: {r.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No reports found.</p>
        )}
      </div>
    </AppShell>
  );
}
