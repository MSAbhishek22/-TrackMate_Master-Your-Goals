
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoalProvider } from "@/contexts/GoalContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/dashboard/Dashboard";
import GoalDetail from "./components/goals/GoalDetail";
import SharedGoalView from "./components/goals/SharedGoalView";
import ProfilePage from "./components/profile/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GoalProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="goals/:goalId" element={<GoalDetail />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route path="/shared/:shareId" element={<SharedGoalView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GoalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
