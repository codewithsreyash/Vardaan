import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddReport() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    category: "pothole",
    description: "",
    photo_url: "",
    location_lat: null,
    location_lng: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setForm((f) => ({
            ...f,
            location_lat: pos.coords.latitude,
            location_lng: pos.coords.longitude,
          })),
        () => {}
      );
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/reports", form);
      nav("/my-reports", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="New Report" showFab={false}>
      <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10">
        <div className="aspect-[16/9] relative">
          <img
            src={
              form.photo_url ||
              "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop"
            }
            className="w-full h-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 grid place-items-center bg-black/30">
            <label className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={fileToDataUrl((url) =>
                  setForm((f) => ({ ...f, photo_url: url }))
                )}
              />
              Upload Photo
            </label>
          </div>
        </div>
        <form onSubmit={submit} className="p-4 space-y-4">
          <div className="bg-black/20 rounded-2xl p-3 border border-white/10">
            <label className="text-white/70 text-sm">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl h-11 px-3 outline-none"
            >
              <option value="pothole">Pothole</option>
              <option value="streetlight">Streetlight</option>
              <option value="garbage">Garbage</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="bg-black/20 rounded-2xl p-3 border border-white/10">
            <label className="text-white/70 text-sm">Describe the issue</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none resize-none"
              placeholder="Add more details…"
            />
            <div className="mt-3 text-sm text-white/60">
              {form.location_lat
                ? "Auto-tagged with current location"
                : "Location will be auto-tagged if allowed"}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-red-600 font-semibold disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Submit Report"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function fileToDataUrl(cb) {
  return (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };
}
