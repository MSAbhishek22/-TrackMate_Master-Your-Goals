import AuthPage from "@/components/auth/AuthPage";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { authState } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, show the auth page
  return <AuthPage />;
};

export default Index;
