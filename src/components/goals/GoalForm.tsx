
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Goal, GoalStatus } from "@/types";
import { useGoals } from "@/contexts/GoalContext";

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal;
}

export const GoalForm: React.FC<GoalFormProps> = ({ isOpen, onClose, goalToEdit }) => {
  const { addGoal, updateGoal } = useGoals();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Set form values when editing a goal
  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || "");
      setDeadline(goalToEdit.deadline);
    } else {
      // Reset form for new goal
      setTitle("");
      setDescription("");
      setDeadline(undefined);
    }
    setError("");
  }, [goalToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (goalToEdit) {
        // Update existing goal
        updateGoal(goalToEdit.id, {
          title,
          description,
          deadline,
          updatedAt: new Date(),
        });
      } else {
        // Add new goal
        addGoal({
          title,
          description,
          deadline,
          status: "not-started" as GoalStatus,
          subGoals: [],
        });
      }

      onClose();
    } catch (err) {
      setError("Failed to save goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {goalToEdit ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Final Project"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal in more detail..."
              className="min-h-[100px]"
            />
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
                  disabled={(date) => date < new Date()}
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
                goalToEdit ? "Update Goal" : "Create Goal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
