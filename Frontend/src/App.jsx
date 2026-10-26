import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import Signup from "./components/Signup";
import { useAuth } from "./context/AuthProvider";
import Courses from "./courses/Courses";
import Home from "./home/Home";

function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center"><span className="loading loading-spinner loading-lg text-amber-500" /></div>;
  }
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
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}
