import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import AddReport from "./pages/AddReport";
import MyReports from "./pages/MyReports";
import Leaderboard from "./pages/Leaderboard";
import TrackReport from "./pages/TrackReport";
import TrackReportDetails from "./pages/TrackReportDetails";
import TradePlastic from "./pages/TradePlastic";
import Suggestions from "./pages/Suggestions";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">Loading…</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}

function AuthRedirect({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">Loading…</div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const hasSeenOnboarding = localStorage.getItem("seenOnboarding");

  return (
    <AuthProvider>
      <UIProvider>
        <Routes>
          {/* Onboarding */}
          <Route path="/welcome" element={<Onboarding />} />

          {/* Auth */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-report"
            element={
              <ProtectedRoute>
                <AddReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-report"
            element={
              <ProtectedRoute>
                <TrackReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-report/:id"
            element={
              <ProtectedRoute>
                <TrackReportDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trade-plastic"
            element={
              <ProtectedRoute>
                <TradePlastic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <ProtectedRoute>
                <Suggestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={
              hasSeenOnboarding ? (
                <Navigate to="/login" replace />
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />
        </Routes>
      </UIProvider>
    </AuthProvider>
  );
}
