import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyReports from "./pages/MyReports";
import TeamDashboard from "./pages/TeamDashboard";
import Projects from "./pages/Projects";
import { useAuth } from "./context/AuthContext";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout>
              <MyReports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["manager"]}>
            <Layout>
              <TeamDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute roles={["manager"]}>
            <Layout>
              <Projects />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
