import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Header Image */}
        <img
          src="https://media.licdn.com/dms/image/v2/D4E12AQFiP1ScSaTSKQ/article-cover_image-shrink_720_1280/B4EZYaEYAqHYAI-/0/1744194077862?e=2147483647&v=beta&t=0BZ3SguyTPdef3-gFQ86ic-XmggvhnEIcwBuD4IKSPI"
          alt="CivicSetu"
          className="h-36 w-full object-cover"
        />

        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Create your Account</h2>
          <p className="text-gray-500 text-center text-sm">
            Join CivicSetu and be a part of the change.
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Register
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="flex-1 border-t" />
            Or sign up with
            <span className="flex-1 border-t" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-4">
            <button className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <FcGoogle size={20} /> Google
            </button>
            <button className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
              <FaFacebook size={20} className="text-blue-600" /> Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
