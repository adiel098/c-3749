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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { session } = useAuth();
  const { data: profile } = useProfile();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={
          isMobile ? (
            <TradeMobile 
              showAuthDialog={showAuthDialog} 
              setShowAuthDialog={setShowAuthDialog} 
            />
          ) : (
            session ? (
              profile?.is_admin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/trade" replace />
              )
            ) : (
              <AuthPage />
            )
          )
        } />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              {profile?.is_admin ? (
                <AdminPanel />
              ) : (
                <Navigate to="/trade" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/trade"
          element={
            isMobile ? (
              <Navigate to="/" replace />
            ) : (
              <ProtectedRoute>
                {profile?.is_admin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <div className={isMobile ? "main-content" : ""}>
                    <Trade />
                  </div>
                )}
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              {profile?.is_admin ? (
                <Navigate to="/admin" replace />
              ) : (
                <div className={isMobile ? "main-content" : ""}>
                  <Portfolio />
                </div>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              {profile?.is_admin ? (
                <Navigate to="/admin" replace />
              ) : (
                <div className={isMobile ? "main-content" : ""}>
                  <Wallet />
                </div>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              {profile?.is_admin ? (
                <Navigate to="/admin" replace />
              ) : (
                <div className={isMobile ? "main-content" : ""}>
                  <History />
                </div>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              {profile?.is_admin ? (
                <Navigate to="/admin" replace />
              ) : (
                <div className={isMobile ? "main-content" : ""}>
                  <Settings />
                </div>
              )}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isMobile && !profile?.is_admin && (
        <>
          <MobileNavBar onAuthRequired={() => setShowAuthDialog(true)} />
          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <DialogContent className="p-0">
              <AuthPage />
            </DialogContent>
          </Dialog>
        </>
      )}
      <Toaster />
    </div>
  );
}

export default App;