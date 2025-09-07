import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowLeft, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AddReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState(""); // will be set after fetching categories
  const [categories, setCategories] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [location, setLocation] = useState([18.5204, 73.8567]); // default Pune
  const [address, setAddress] = useState("Fetching address...");
  const [image, setImage] = useState(null);

  // ✅ Fetch categories from backend
  // ✅ Fetch categories
useEffect(() => {
  fetch("http://localhost:5000/api/reports/categories")
    .then((res) => res.json())
    .then((data) => {
      setCategories(data || []);
      if (data?.length) setCategory(data[0]); // default to first category
    })
    .catch((error) => {
      console.error("Failed to fetch categories:", error);
      setCategories(["garbage", "streetlight", "pothole", "other"]); // fallback
      setCategory("garbage");
    });
}, []);

// ✅ Fetch live location + reverse geocode
useEffect(() => {
  const trendingTitle = searchParams.get("title");
  if (trendingTitle) setTitle(trendingTitle);

  let watchId;
  let timeoutId;
  let lastFetchTime = 0; // Keep this here but be aware of scope
  let isActive = true; // Add flag to prevent state updates after cleanup
  const MIN_FETCH_INTERVAL = 2000; // 2 seconds between API calls

  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (!isActive) return; // Prevent updates after cleanup
        
        const newLoc = [pos.coords.latitude, pos.coords.longitude];
        setLocation(newLoc);

        // Clear previous timeout
        clearTimeout(timeoutId);

        // Debounce and rate limit API calls
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTime;
        const delay = Math.max(0, MIN_FETCH_INTERVAL - timeSinceLastFetch);

        timeoutId = setTimeout(async () => {
          if (!isActive) return; // Prevent API calls after cleanup
          
          try {
            lastFetchTime = Date.now();

            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLoc[0]}&lon=${newLoc[1]}`,
              {
                headers: {
                  'User-Agent': 'LocationApp/1.0 (contact@yourapp.com)'
                }
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Only update state if component is still active
            if (isActive) {
              setAddress(data?.display_name || "Address not available");
            }

          } catch (error) {
            console.error("Reverse geocoding error:", error);
            if (isActive) {
              setAddress("Address not available");
            }
          }
        }, delay);
      },
      (err) => {
        console.error("Location error:", err);
        if (isActive) {
          setAddress("Location access denied");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache location for 1 minute
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser");
    setAddress("Geolocation not supported");
  }

  // Cleanup function
  return () => {
    isActive = false; // Prevent any pending state updates
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [searchParams]); // Consider if searchParams dependency is needed

  // ✅ Capture image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // ✅ Submit Report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert("You must be logged in to submit a report");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("category", category);
    formData.append("latitude", location[0]);
    formData.append("longitude", location[1]);
    formData.append("address", address || "Unknown address");
    if (suggestion) formData.append("suggestion", suggestion);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`, // ✅ backend JWT
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit report");

      navigate("/my-reports");
    } catch (err) {
      console.error("Report error:", err);
      alert("Error submitting report. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center p-4 border-b bg-white">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Report Issue</h1>
      </header>

      {/* Map */}
      <div className="h-56 w-full">
        <MapContainer
          center={location}
          zoom={15}
          className="h-full w-full rounded-lg shadow"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={location}></Marker>
        </MapContainer>
      </div>

      {/* Address */}
      <div className="p-4">
        <p className="text-sm text-gray-700">📍 {address}</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        id="report-form"
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Issue Title</label>
          <input
            type="text"
            placeholder="e.g. Broken Streetlight"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-green-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            placeholder="Provide a detailed description of the issue."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-green-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-green-200"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Suggestion (Optional)
          </label>
          <textarea
            placeholder="Suggest an improvement..."
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={2}
            className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-green-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Capture Photo</label>
          <div className="flex gap-4">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center border rounded-lg text-gray-400">
                <Camera />
              </div>
            )}
            <label className="w-24 h-20 flex items-center justify-center border rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-xs text-gray-600">Open Camera</span>
            </label>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex gap-4 p-4 border-t bg-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 py-3 rounded-lg border text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="report-form"
          className="flex-1 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}
