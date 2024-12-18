import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    // Redirect to /auth and save the attempted location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}