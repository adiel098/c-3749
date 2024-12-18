import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Loading:", isLoading);
  console.log("ProtectedRoute - Current session:", session ? "Exists" : "None", session?.user?.id);
  console.log("ProtectedRoute - Current location:", location.pathname);

  if (isLoading) {
    console.log("ProtectedRoute - Still loading");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    console.log("ProtectedRoute - Redirecting to auth page");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute - Rendering protected content");
  return children;
}