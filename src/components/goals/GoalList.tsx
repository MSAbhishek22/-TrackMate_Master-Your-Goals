
import { useState } from "react";
import { Goal } from "@/types";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
import { useGoals } from "@/contexts/GoalContext";

export const GoalList: React.FC = () => {
  const { goals, deleteGoal } = useGoals();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | undefined>();
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const handleAddGoal = () => {
    setGoalToEdit(undefined);
    setIsAddingGoal(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setGoalToEdit(goal);
    setIsAddingGoal(true);
  };

  const handleDeleteRequest = (goalId: string) => {
    setGoalToDelete(goalId);
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete);
      setGoalToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <Button onClick={handleAddGoal} className="bg-gradient-to-r from-masterplan-purple to-masterplan-teal">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-4">Create your first goal to get started!</p>
          <Button onClick={handleAddGoal} className="bg-gradient-to-r from-masterplan-purple to-masterplan-teal">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={handleEditGoal}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Goal form dialog */}
      {isAddingGoal && (
        <GoalForm
          isOpen={isAddingGoal}
          onClose={() => {
            setIsAddingGoal(false);
            setGoalToEdit(undefined);
          }}
          goalToEdit={goalToEdit}
        />
      )}

      {/* Confirm delete dialog */}
      <AlertDialog open={!!goalToDelete} onOpenChange={(open) => !open && setGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this goal and all its tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
