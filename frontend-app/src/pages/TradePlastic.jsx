import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function TradePlastic() {
  const [trades, setTrades] = useState([]);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    api.get("/trade/my").then((res) => setTrades(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/trade", { weight_kg: weight });
    setTrades((t) => [res.data, ...t]);
    setWeight("");
  };

  return (
    <AppShell title="Plastic Trade Tracking">
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 h-12 outline-none"
          placeholder="Enter weight in kg"
        />
        <button className="px-4 rounded-xl bg-green-600">Log</button>
      </form>

      <div className="space-y-3">
        {trades.map((t) => (
          <div
            key={t.id}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <p>{t.weight_kg} kg recycled</p>
            <p className="text-sm text-white/60">
              Earned {t.reward_points} points
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
