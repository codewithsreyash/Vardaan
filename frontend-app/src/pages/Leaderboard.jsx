import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [yourRank, setYourRank] = useState(null);
  const [filter, setFilter] = useState("weekly");

  useEffect(() => {
    api.get(`/leaderboard?filter=${filter}`).then((res) => {
      setUsers(res.data.users || []);
      setYourRank(res.data.currentUser || null);
    });
  }, [filter]);

  return (
    <AppShell title="Leaderboard">
      <div className="space-y-4">
        {/* Your Rank Card */}
        {yourRank && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
            <img
              src={yourRank.avatar || "https://via.placeholder.com/64"}
              alt="You"
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <p className="font-semibold">Your Rank</p>
            <p className="text-green-600 font-bold">
              #{yourRank.rank} — {yourRank.points} points
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-3">
          {["daily", "weekly", "all"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                filter === t
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {t === "daily"
                ? "Daily"
                : t === "weekly"
                ? "Weekly"
                : "All-Time"}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {users.map((u, i) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3 bg-white rounded-xl border shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-600">{i + 1}</span>
                <img
                  src={u.avatar || "https://via.placeholder.com/40"}
                  alt={u.name}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{u.name}</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                {u.points} pts
                {i < 3 && <Trophy size={16} className="text-yellow-500" />}
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <p className="text-gray-500 text-center">No leaderboard data yet.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
