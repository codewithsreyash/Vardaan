import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("seenOnboarding", "true");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6 text-center space-y-6">
          <h1 className="text-2xl font-bold">Welcome to CivicSetu</h1>
          <p className="text-gray-600">
            Report civic issues, connect with your community, and contribute
            to a cleaner, greener neighborhood.
          </p>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={handleStart}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
