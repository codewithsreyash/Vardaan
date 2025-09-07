import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import { Search } from "lucide-react";

export default function TrackReport() {
  const [reports, setReports] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    api.get("/reports").then((res) => setReports(res.data));
  }, []);

  // filter + search
  const filtered = reports
    .filter((r) =>
      (r.title || "").toLowerCase().includes(query.toLowerCase())
    )
    .filter((r) =>
      statusFilter === "all" ? true : r.status === statusFilter
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  return (
    <AppShell title="Track Report Status" showFab={false}>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reports by keyword"
          className="w-full pl-10 pr-3 py-2 rounded-xl bg-gray-100 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 p-2 rounded-xl border"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="flex-1 p-2 rounded-xl border"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <Link
            key={r.id}
            to={`/track-report/${r.id}`}
            className="block bg-white border rounded-xl p-4 hover:shadow"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{r.title}</h2>
              <StatusBadge status={r.status} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Reported on: {new Date(r.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
