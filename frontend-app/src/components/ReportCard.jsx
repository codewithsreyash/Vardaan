import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ReportCard({ report }) {
  return (
    <Link
      to={`/track-report/${report.id}`}
      className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition"
    >
      <img
        src={report.photo_url || `https://picsum.photos/seed/${report.id}/100/100`}
        alt=""
        className="w-16 h-16 rounded-xl object-cover"
      />
      <div className="flex-1">
        <div className="text-base font-semibold leading-5">
          {titleFrom(report)}
        </div>
        <div className="mt-2">
          <StatusBadge status={report.status} />
        </div>
      </div>
      <svg className="w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none">
        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </Link>
  );
}

function titleFrom(r) {
  const map = { garbage: "Garbage Issue", streetlight: "Streetlight Outage", pothole: "Pothole", other: "Reported Issue" };
  return r.title || map[r.category] || "Reported Issue";
}
