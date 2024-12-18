import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Trade from "@/pages/Trade";
import TradeMobile from "@/pages/TradeMobile";
import Portfolio from "@/pages/Portfolio";
import Wallet from "@/pages/Wallet";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth/AuthPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AuthProvider } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  {isMobile ? <TradeMobile /> : <Trade />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;