
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGoals } from "@/contexts/GoalContext";
import { Goal } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, CheckCircle, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

const SharedGoalView = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const { fetchSharedGoal } = useGoals();
  const navigate = useNavigate();
  const [sharedGoal, setSharedGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareId) {
      // In a real app, this would be an API call
      const goal = fetchSharedGoal(shareId);
      setSharedGoal(goal);
      setLoading(false);
    }
  }, [shareId, fetchSharedGoal]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-2xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!sharedGoal) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Shared goal not found or link has expired</h2>
        <p className="text-muted-foreground mb-6">The shared goal you're looking for is no longer available.</p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "not-started":
        return "border-status-not-started";
      case "in-progress":
        return "border-status-in-progress";
      case "completed":
        return "border-status-completed";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not-started":
        return (
          <Badge variant="outline" className="bg-status-not-started/10 text-status-not-started border-status-not-started">
            Not Started
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-status-in-progress/10 text-status-in-progress border-status-in-progress">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-status-completed/10 text-status-completed border-status-completed">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="mr-2 p-0 h-8 w-8">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <span className="text-sm text-muted-foreground block">Shared Goal</span>
            <h1 className="text-3xl font-bold">{sharedGoal.title}</h1>
          </div>
          <div className="ml-4">{getStatusBadge(sharedGoal.status)}</div>
        </div>
        
        {sharedGoal.description && (
          <p className="text-muted-foreground mb-4">{sharedGoal.description}</p>
        )}
        
        <div className="flex flex-wrap gap-6 mb-6">
          {sharedGoal.deadline && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Due: {format(new Date(sharedGoal.deadline), "PPP")}</span>
            </div>
          )}
          
          {sharedGoal.createdAt && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Created: {format(new Date(sharedGoal.createdAt), "PPP")}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{sharedGoal.progress}%</span>
          </div>
          <Progress value={sharedGoal.progress} className="h-2" />
        </div>
      </div>
      
      {/* Tasks Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        
        {sharedGoal.subGoals.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No tasks added yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sharedGoal.subGoals.map((subGoal) => (
              <Card 
                key={subGoal.id}
                className={`overflow-hidden transition-all ${getStatusClass(subGoal.status)}`}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {subGoal.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-status-completed" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium ${subGoal.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                        {subGoal.title}
                      </h3>
                      
                      {subGoal.deadline && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Due: {format(new Date(subGoal.deadline), "PPP")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedGoalView;
