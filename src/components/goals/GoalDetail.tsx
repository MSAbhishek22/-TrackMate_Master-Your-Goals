
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGoals } from "@/contexts/GoalContext";
import { SubGoal } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Calendar, CheckCircle, Circle, Clock, Edit, PlusCircle, Share2, Trash2 } from "lucide-react";
import { SubGoalForm } from "./SubGoalForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const GoalDetail = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const { getGoal, updateSubGoal, deleteSubGoal, shareGoal } = useGoals();
  const navigate = useNavigate();
  const [isAddingSubGoal, setIsAddingSubGoal] = useState(false);
  const [subGoalToEdit, setSubGoalToEdit] = useState<SubGoal | undefined>();
  const [subGoalToDelete, setSubGoalToDelete] = useState<string | null>(null);

  const goal = goalId ? getGoal(goalId) : undefined;

  if (!goal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Goal not found</h2>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
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

  const handleSubGoalStatusToggle = (subGoalId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "in-progress" : "completed";
    updateSubGoal(goalId!, subGoalId, { status: newStatus as any });
    
    toast.success(`Task marked as ${newStatus.replace("-", " ")}`);
    
    if (newStatus === "completed") {
      // Show celebration animation
      const element = document.getElementById(`subgoal-${subGoalId}`);
      if (element) {
        const celebrationEl = document.createElement("div");
        celebrationEl.className = "animate-celebration absolute inset-0 flex items-center justify-center text-2xl";
        celebrationEl.textContent = "🎉";
        element.style.position = "relative";
        element.appendChild(celebrationEl);
        
        setTimeout(() => {
          element.removeChild(celebrationEl);
        }, 1000);
      }
    }
  };

  const handleShareGoal = async () => {
    const shareLink = shareGoal(goalId!);
    
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success("Share link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy share link.");
      }
    }
  };

  const handleEditSubGoal = (subGoal: SubGoal) => {
    setSubGoalToEdit(subGoal);
    setIsAddingSubGoal(true);
  };

  const confirmDeleteSubGoal = () => {
    if (subGoalToDelete) {
      deleteSubGoal(goalId!, subGoalToDelete);
      setSubGoalToDelete(null);
      toast.success("Task deleted successfully!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-2 p-0 h-8 w-8">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{goal.title}</h1>
          <div className="ml-4">{getStatusBadge(goal.status)}</div>
        </div>
        
        {goal.description && (
          <p className="text-muted-foreground mb-4">{goal.description}</p>
        )}
        
        <div className="flex flex-wrap gap-6 mb-6">
          {goal.deadline && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Due: {format(new Date(goal.deadline), "PPP")}</span>
            </div>
          )}
          
          {goal.createdAt && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Created: {format(new Date(goal.createdAt), "PPP")}</span>
            </div>
          )}
          
          {goal.streak && goal.streak > 0 && (
            <div className="flex items-center">
              <Badge variant="secondary" className="bg-masterplan-purple/10 text-masterplan-purple">
                {goal.streak} day streak 🔥
              </Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate(`/goals/${goalId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Goal
          </Button>
          <Button onClick={handleShareGoal}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      {/* Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Button onClick={() => {
            setSubGoalToEdit(undefined);
            setIsAddingSubGoal(true);
          }}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        {goal.subGoals.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No tasks added yet. Add tasks to track your progress!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {goal.subGoals.map((subGoal) => (
              <Card 
                key={subGoal.id} 
                id={`subgoal-${subGoal.id}`}
                className={`overflow-hidden transition-all ${getStatusClass(subGoal.status)}`}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="mr-2 p-1 h-6 w-6 mt-0.5"
                        onClick={() => handleSubGoalStatusToggle(subGoal.id, subGoal.status)}
                      >
                        {subGoal.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-status-completed" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
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
                    
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => handleEditSubGoal(subGoal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setSubGoalToDelete(subGoal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add/Edit SubGoal Modal */}
      {isAddingSubGoal && (
        <SubGoalForm 
          isOpen={isAddingSubGoal}
          onClose={() => {
            setIsAddingSubGoal(false);
            setSubGoalToEdit(undefined);
          }}
          goalId={goalId!}
          subGoalToEdit={subGoalToEdit}
        />
      )}
      
      {/* Confirm Delete AlertDialog */}
      <AlertDialog open={!!subGoalToDelete} onOpenChange={(open) => !open && setSubGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSubGoal}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GoalDetail;
