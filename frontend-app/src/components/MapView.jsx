export default function MapView({ issues = [] }) {
  // Placeholder box – swap with Leaflet/Google Maps later
  return (
    <div className="w-full h-72 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-600">
      Map Placeholder ({issues.length} issues)
    </div>
  );
}
