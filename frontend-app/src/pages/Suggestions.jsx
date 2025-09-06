import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    api.get("/suggestions").then((res) => setSuggestions(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/suggestions", { suggestion: text });
    setSuggestions((s) => [res.data, ...s]);
    setText("");
  };

  return (
    <AppShell title="Suggestions">
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 h-12 outline-none"
          placeholder="Share your suggestion..."
        />
        <button className="px-4 rounded-xl bg-red-600">Submit</button>
      </form>

      <div className="space-y-3">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          >
            {s.suggestion}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
