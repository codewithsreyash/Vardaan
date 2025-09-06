import AppShell from "../components/AppShell";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const stats = [
    { label: "My Reports", value: 12 },
    { label: "Suggestions", value: 5 },
    { label: "Trades Completed", value: 8 },
    { label: "Points", value: 230 },
  ];

  return (
    <AppShell title="Dashboard">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user.name || "Citizen"} 👋
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-md text-center"
          >
            <h2 className="text-3xl font-bold">{s.value}</h2>
            <p className="text-gray-300">{s.label}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
