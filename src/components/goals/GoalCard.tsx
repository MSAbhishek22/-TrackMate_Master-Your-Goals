
import { Goal } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Share2, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGoals } from "@/contexts/GoalContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const { shareGoal } = useGoals();
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();

  const getStatusClass = (status: string) => {
    switch (status) {
      case "not-started":
        return "goal-not-started";
      case "in-progress":
        return "goal-in-progress";
      case "completed":
        return "goal-completed";
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

  const handleShare = async () => {
    setIsSharing(true);
    const shareLink = shareGoal(goal.id);
    
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success("Share link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy share link.");
        console.error("Failed to copy: ", error);
      }
    }
    
    setIsSharing(false);
  };

  const handleViewDetails = () => {
    navigate(`/goals/${goal.id}`);
  };

  return (
    <Card className={`card-hover ${getStatusClass(goal.status)}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{goal.title}</h3>
            {getStatusBadge(goal.status)}
            {goal.streak && goal.streak > 0 && (
              <Badge variant="secondary" className="ml-2 bg-masterplan-purple/10 text-masterplan-purple">
                {goal.streak} day streak 🔥
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between mt-2">
              {goal.deadline && (
                <span>
                  Due {formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}
                </span>
              )}
              <span>
                {goal.subGoals.length} {goal.subGoals.length === 1 ? "task" : "tasks"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" className="text-xs" onClick={handleShare} disabled={isSharing}>
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share
          </Button>
          <Button variant="default" size="sm" className="text-xs bg-masterplan-teal hover:bg-masterplan-teal/80" onClick={handleViewDetails}>
            Details
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
