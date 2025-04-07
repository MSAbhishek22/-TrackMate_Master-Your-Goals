
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGoals } from "@/contexts/GoalContext";
import { Plus, Sparkles } from "lucide-react";
import { GoalStatus, SubGoal } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Different gradient styles for each suggestion
const gradientStyles = [
  "gradient-card-purple vibrant-shadow",
  "gradient-card-warm vibrant-shadow",
  "gradient-card-cool vibrant-shadow",
  "gradient-card-teal vibrant-shadow"
];

const goalSuggestions = [
  {
    title: "Establish a Daily Study Routine",
    description: "Create a consistent daily schedule for studying with specific time blocks.",
    subGoals: [
      { id: uuidv4(), title: "Morning review session", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Afternoon focused work", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Evening summary and preparation", status: "not-started" as GoalStatus },
    ],
    icon: "✨"
  },
  {
    title: "Prepare for Upcoming Exams",
    description: "Organize study materials and create a preparation plan for finals.",
    subGoals: [
      { id: uuidv4(), title: "Create study guides for each subject", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Schedule practice tests", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Form/join study group", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Review past exams", status: "not-started" as GoalStatus },
    ],
    icon: "🚀"
  },
  {
    title: "Complete Semester Project",
    description: "Break down and manage your semester-end project in manageable pieces.",
    subGoals: [
      { id: uuidv4(), title: "Research and outline", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Draft initial version", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Get feedback", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Finalize and submit", status: "not-started" as GoalStatus },
    ],
    icon: "📊"
  },
  {
    title: "Build Technical Skills",
    description: "Enhance your technical abilities through practical projects and courses.",
    subGoals: [
      { id: uuidv4(), title: "Complete online course", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Build a personal project", status: "not-started" as GoalStatus },
      { id: uuidv4(), title: "Practice with coding challenges", status: "not-started" as GoalStatus },
    ],
    icon: "💻"
  }
];

export const GoalSuggestions: React.FC = () => {
  const { addGoal } = useGoals();
  const [addedSuggestions, setAddedSuggestions] = useState<number[]>([]);

  const handleAddSuggestion = (index: number) => {
    const suggestion = goalSuggestions[index];
    
    addGoal({
      title: suggestion.title,
      description: suggestion.description,
      status: "not-started",
      subGoals: suggestion.subGoals,
    });
    
    setAddedSuggestions(prev => [...prev, index]);
    toast.success("Suggested goal added to your list!");
  };

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Sparkles className="h-6 w-6 mr-2 text-masterplan-amber" />
        <span className="gradient-text-vibrant">Goal Suggestions</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {goalSuggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className={`card-hover overflow-hidden ${gradientStyles[index % gradientStyles.length]}`}
          >
            <div className="absolute top-0 right-0 p-2 text-2xl opacity-30">{suggestion.icon}</div>
            
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">{suggestion.title}</h3>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {suggestion.description}
              </p>
              <div className="text-xs text-muted-foreground mb-4 font-medium">
                {suggestion.subGoals.length} pre-defined tasks
              </div>
              
              <Button 
                className={`w-full ${addedSuggestions.includes(index) ? "" : "bg-gradient-to-r from-masterplan-purple to-masterplan-teal hover:opacity-90"}`}
                variant={addedSuggestions.includes(index) ? "outline" : "default"}
                onClick={() => handleAddSuggestion(index)}
                disabled={addedSuggestions.includes(index)}
              >
                {addedSuggestions.includes(index) ? (
                  "Added"
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add to My Goals
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
