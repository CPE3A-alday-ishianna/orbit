import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage   from "./pages/LandingPage";
import AuthPage      from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import MapPage       from "./pages/MapPage";
import StatisticsPage from "./pages/StatisticsPage";
import AppLayout     from "./components/AppLayout";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🛰</div>
        <p style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", color:"var(--orbit-green)" }}>
          Initializing O.R.B.I.T...
        </p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/"     element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/map"        element={<MapPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
