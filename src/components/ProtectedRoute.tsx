import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Loading:", isLoading);
  console.log("ProtectedRoute - Session:", session ? "Exists" : "None");
  console.log("ProtectedRoute - Location:", location.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    console.log("ProtectedRoute - No session, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute - Session exists, rendering content");
  return children;
}