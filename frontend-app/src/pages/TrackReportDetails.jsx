import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function TrackReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get(`/reports/${id}`).then((res) => setReport(res.data));
  }, [id]);

  if (!report) {
    return (
      <AppShell title="Report Details" showFab={false}>
        <p className="text-gray-500">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={report.title || "Report Details"} showFab={false}>
      {/* Description */}
      <p className="text-gray-700 mb-4">{report.description}</p>

      {/* Location */}
      <h3 className="font-semibold">Location</h3>
      <div className="rounded-xl overflow-hidden border my-2">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${report.location_lat},${report.location_lng}&zoom=14&size=400x200&markers=color:red|${report.location_lat},${report.location_lng}&key=YOUR_API_KEY`}
          alt="map"
          className="w-full"
        />
      </div>

      {/* Media */}
      {report.photo_url && (
        <>
          <h3 className="font-semibold mt-4">Media</h3>
          <img
            src={report.photo_url}
            alt="report"
            className="w-full h-48 object-cover rounded-xl mt-2"
          />
        </>
      )}

      {/* Status */}
      <div className="mt-4">
        <StatusBadge status={report.status} />
      </div>

      {/* Timeline */}
      <h3 className="font-semibold mt-6">Timeline</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>📌 Reported: {new Date(report.created_at).toLocaleDateString()}</li>
        {report.status !== "pending" && <li>⚡ Assigned to team</li>}
        {report.status === "resolved" && <li>✅ Resolved</li>}
      </ul>

      {/* Comments */}
      <h3 className="font-semibold mt-6">Comments</h3>
      <div className="space-y-3">
        {report.comments?.length ? (
          report.comments.map((c, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl p-3 text-sm text-gray-700"
            >
              <p className="font-medium">{c.author}</p>
              <p>{c.text}</p>
              <span className="text-xs text-gray-400">
                {new Date(c.date).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/track-report")}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded-xl"
      >
        Back to Reports
      </button>
    </AppShell>
  );
}
