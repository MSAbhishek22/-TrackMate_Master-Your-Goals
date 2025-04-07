
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { GoalStatus, SubGoal } from "@/types";
import { useGoals } from "@/contexts/GoalContext";

interface SubGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  subGoalToEdit?: SubGoal;
}

export const SubGoalForm: React.FC<SubGoalFormProps> = ({ 
  isOpen, 
  onClose, 
  goalId, 
  subGoalToEdit 
}) => {
  const { addSubGoal, updateSubGoal } = useGoals();
  const [title, setTitle] = useState(subGoalToEdit?.title || "");
  const [status, setStatus] = useState<GoalStatus>(subGoalToEdit?.status || "not-started");
  const [deadline, setDeadline] = useState<Date | undefined>(subGoalToEdit?.deadline);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (subGoalToEdit) {
        // Update existing sub-goal
        updateSubGoal(goalId, subGoalToEdit.id, {
          title,
          status,
          deadline,
        });
      } else {
        // Add new sub-goal
        addSubGoal(goalId, {
          title,
          status,
          deadline,
        });
      }

      onClose();
    } catch (err) {
      setError("Failed to save sub-goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {subGoalToEdit ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Research Topic"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as GoalStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="deadline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-masterplan-purple to-masterplan-teal">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                subGoalToEdit ? "Update Task" : "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
