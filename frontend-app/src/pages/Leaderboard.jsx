import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/leaderboard").then((res) => setUsers(res.data));
  }, []);

  return (
    <AppShell title="Leaderboard">
      <div className="space-y-3">
        {users.map((u, i) => (
          <div
            key={u.id}
            className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <span>
              {i + 1}. {u.name}
            </span>
            <span className="font-semibold">{u.points} pts</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
