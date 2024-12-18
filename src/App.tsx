import { Routes, Route, Navigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MobileNavBar } from "@/components/MobileNavBar";
import Trade from "@/pages/Trade";
import TradeMobile from "@/pages/TradeMobile";
import Portfolio from "@/pages/Portfolio";
import Wallet from "@/pages/Wallet";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth/AuthPage";
import AdminPanel from "@/pages/admin/AdminPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { session } = useAuth();
  const { data: profile } = useProfile();

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={
          session ? (
            profile?.is_admin ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/trade" replace />
            )
          ) : (
            <AuthPage />
          )
        } />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trade"
          element={
            <ProtectedRoute>
              <div className={isMobile ? "main-content" : ""}>
                {isMobile ? <TradeMobile /> : <Trade />}
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <div className={isMobile ? "main-content" : ""}>
                <Portfolio />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <div className={isMobile ? "main-content" : ""}>
                <Wallet />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <div className={isMobile ? "main-content" : ""}>
                <History />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div className={isMobile ? "main-content" : ""}>
                <Settings />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isMobile && session && !profile?.is_admin && <MobileNavBar />}
      <Toaster />
    </div>
  );
}

export default App;