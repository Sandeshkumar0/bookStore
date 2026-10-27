import { type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import ScrollProgress from "./components/ScrollProgress";
import Signup from "./components/Signup";
import { useAuth } from "./context/AuthProvider";
import Courses from "./courses/Courses";
import Home from "./home/Home";

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <ScrollProgress />
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader" aria-label="Checking your archive access"><span /></div>;
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PageShell><Home /></PageShell>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/courses"
          element={<ProtectedRoute><PageShell><Courses /></PageShell></ProtectedRoute>}
        />
        <Route path="/course" element={<Navigate to="/courses" replace />} />
        <Route path="/cart" element={<PageShell><Cart /></PageShell>} />
        <Route path="*" element={<PageShell><NotFound /></PageShell>} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3200,
          style: { background: "#171512", color: "#f4efe3", borderRadius: "0", border: "1px solid #4b4439" },
        }}
      />
    </>
  );
}
