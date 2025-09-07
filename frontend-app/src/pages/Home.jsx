import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { User, Menu } from "lucide-react";
import { useUI } from "../context/UIContext";
import Sidebar from "../components/Sidebar";

// Fix leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function HomePage() {
  const navigate = useNavigate();
  const { setSidebarOpen } = useUI();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const stats = [
    { label: "Reports", value: 12 },
    { label: "Points", value: 230 },
  ];

  const trendingIssues = [
    { id: 1, title: "Potholes", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUXtdQi9T16Wi9Qx5drf1WTyAyWocThwHY3w&s" },
    { id: 2, title: "Trash Overflow", image: "https://media.assettype.com/deccanherald%2F2024-10-13%2Fneiirbix%2Ffile7xlb8dqb6g35jhe7bo.jpg?w=undefined&auto=format%2Ccompress&fit=max" },
    { id: 3, title: "Street Light", image: "https://highlandradio.com/wp-content/uploads/2015/01/streetlights.jpg" },
    { id: 4, title: "Dangerous Riding", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2suNN0CTrQLblek_ytm6e4yfRDOlBYfGNCw&s" },
  ];

  const [issues] = useState([
    { id: 1, lat: 28.6139, lng: 77.209, title: "Garbage Overflow" },
    { id: 2, lat: 28.615, lng: 77.205, title: "Broken Streetlight" },
  ]);

  // user live location
  const [location, setLocation] = useState([18.5204, 73.8567]); // default Pune

  useEffect(() => {
    if (navigator.geolocation) {
      // watch live location
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      // cleanup on unmount
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b bg-white z-20">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">CivicSetu</h1>
        <button onClick={() => navigate("/profile")}>
          <User className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {user.name || "Citizen"} 👋
        </h2>

        {/* Trending Issues */}
        <section>
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Trending Issues
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trendingIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => navigate("/add-report", { state: { issue } })}
                className="min-w-[140px] cursor-pointer bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="h-24 w-full object-cover"
                />
                <div className="p-2 text-center text-sm font-medium text-gray-700">
                  {issue.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Map */}
        <section>
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Nearby Issues
          </h3>
          <MapContainer
            center={location}
            zoom={15}
            className="h-64 w-full rounded-xl shadow-md relative z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {issues.map((issue) => (
              <Marker key={issue.id} position={[issue.lat, issue.lng]}>
                <Popup>{issue.title}</Popup>
              </Marker>
            ))}
            <Marker position={location}>
              <Popup>📍 You are here</Popup>
            </Marker>
          </MapContainer>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-md text-center"
            >
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
