export default function StatusBadge({ status }) {
  const map = {
    pending: { label: "Submitted", cls: "bg-neutral-700 text-white" },
    in_progress: { label: "In Progress", cls: "bg-blue-600/20 text-blue-300" },
    resolved: { label: "Resolved", cls: "bg-emerald-600/20 text-emerald-300" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}
