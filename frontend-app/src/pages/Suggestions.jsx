import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import api from "../services/api";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Waste Management");
  const [contact, setContact] = useState("");

  useEffect(() => {
    api.get("/suggestions").then((res) => setSuggestions(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/suggestions", {
      suggestion: text,
      category,
      contact,
    });
    setSuggestions((s) => [res.data, ...s]);
    setText("");
    setCategory("Waste Management");
    setContact("");
  };

  return (
    <AppShell title="Public Suggestions">
      <form onSubmit={submit} className="space-y-4">
        {/* Suggestion Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Idea for Improvement
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            rows={3}
            placeholder="E.g., Install more recycling bins in markets..."
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option>Waste Management</option>
            <option>Roads & Transport</option>
            <option>Street Lighting</option>
            <option>Water & Drainage</option>
            <option>Public Safety</option>
            <option>Other</option>
          </select>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact (Optional)
          </label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="Email or phone number (for follow-up)"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md"
        >
          Submit Suggestion
        </button>
      </form>

      {/* Suggestions List */}
      <div className="mt-6 space-y-3">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm"
          >
            <p className="text-gray-800">{s.suggestion}</p>
            {s.category && (
              <p className="text-xs text-gray-500 mt-1">
                Category: {s.category}
              </p>
            )}
            {s.contact && (
              <p className="text-xs text-gray-500">Contact: {s.contact}</p>
            )}
          </div>
        ))}
        {suggestions.length === 0 && (
          <p className="text-gray-500 text-sm">
            No public suggestions submitted yet.
          </p>
        )}
      </div>
    </AppShell>
  );
}
