
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GoalList } from "@/components/goals/GoalList";
import { DashboardSummary } from "./DashboardSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Rocket, Sparkles, Star } from "lucide-react";
import { MotivationalQuote } from "./MotivationalQuote";
import { GoalSuggestions } from "./GoalSuggestions";

const Dashboard = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      navigate("/");
    }
  }, [authState, navigate]);

  if (authState.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center mb-2">
          <h1 className="text-4xl font-bold">
            Hello, <span className="gradient-text-vibrant">{authState.user?.name}</span>!
          </h1>
          <Star className="h-6 w-6 ml-2 text-masterplan-amber animate-pulse-scale" />
        </div>
        <p className="text-muted-foreground">
          Track your goals, stay accountable, and achieve more!
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-12">
        <div className="md:col-span-2">
          <DashboardSummary />
        </div>
        <div>
          <MotivationalQuote />
        </div>
      </div>

      <GoalList />

      <div className="mt-12">
        <GoalSuggestions />
      </div>

      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-br from-purple-500/20 via-masterplan-purple/15 to-masterplan-teal/10 animated-bg border border-purple-200/30">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-3 gradient-text-vibrant">Ready to take your productivity to the next level?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Invite friends to view your goals and hold each other accountable. 
              Shared accountability increases your chances of success by up to 95%!
            </p>
            <Button className="bg-gradient-to-r from-masterplan-purple via-purple-500 to-masterplan-teal hover:opacity-90 shadow-lg shadow-purple-500/20">
              <Rocket className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
