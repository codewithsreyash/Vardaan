import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function TrackReport(){
  const { id } = useParams();
  const [r, setR] = useState(null);

  useEffect(()=>{
    api.get("/reports").then(res=>{
      setR((res.data || []).find(x=>String(x.id)===String(id)));
    });
  },[id]);

  if (!r) return <AppShell title="Report Details" showFab={false}><p className="text-white/60">Loading…</p></AppShell>;

  return (
    <AppShell title="Report Details" showFab={false}>
      <h1 className="text-2xl font-extrabold mb-2">{r.title || "Reported Issue"}</h1>

      <div className="space-y-2 text-white/80">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5"/></svg>
          <span className="capitalize">{r.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 2C7 2 3 6 3 11c0 6 9 11 9 11s9-5 9-11c0-5-4-9-9-9Z" stroke="currentColor" strokeWidth="1.5"/></svg>
          <span>{r.location_lat?.toFixed?.(4)}, {r.location_lng?.toFixed?.(4)}</span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
        <img src={r.photo_url || `https://picsum.photos/seed/${r.id}/900/600`} className="w-full h-48 object-cover" />
      </div>

      <div className="mt-5">
        <StatusBadge status={r.status}/>
      </div>

      <section className="mt-6">
        <h3 className="text-lg font-bold mb-3">Status History</h3>
        <ol className="relative border-s border-white/10 ps-5 space-y-5">
          <li><Dot/> <p className="font-semibold">Submitted</p><p className="text-white/60 text-sm">Your report was created.</p></li>
          {r.status !== "pending" && <li><Dot/> <p className="font-semibold">In Progress</p><p className="text-white/60 text-sm">Team is working on it.</p></li>}
          {r.status === "resolved" && <li><Dot/> <p className="font-semibold">Resolved</p><p className="text-white/60 text-sm">Issue has been fixed.</p></li>}
        </ol>
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-bold mb-3">Comments</h3>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-white/70">
          Municipal staff can leave updates here (future).
        </div>
      </section>
    </AppShell>
  );
}

function Dot(){ return <span className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-white/60"></span>; }
