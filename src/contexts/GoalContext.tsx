
import React, { createContext, useContext, useState, useEffect } from "react";
import { Goal, SubGoal, GoalStatus } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface GoalContextProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "progress">) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  addSubGoal: (goalId: string, subGoal: Omit<SubGoal, "id">) => void;
  updateSubGoal: (goalId: string, subGoalId: string, updates: Partial<SubGoal>) => void;
  deleteSubGoal: (goalId: string, subGoalId: string) => void;
  getGoal: (goalId: string) => Goal | undefined;
  calculateProgress: (goalId: string) => number;
  shareGoal: (goalId: string) => string;
  fetchSharedGoal: (shareId: string) => Goal | null;
}

// Sample initial goals for demonstration
const initialGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Complete Data Structures Course",
    description: "Finish all modules in the online data structures course",
    status: "in-progress",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(),
    progress: 35,
    streak: 3,
    subGoals: [
      {
        id: "subgoal-1",
        title: "Arrays and Linked Lists",
        status: "completed",
      },
      {
        id: "subgoal-2",
        title: "Stacks and Queues",
        status: "completed",
      },
      {
        id: "subgoal-3",
        title: "Trees and Graphs",
        status: "in-progress",
      },
      {
        id: "subgoal-4",
        title: "Heap and Priority Queues",
        status: "not-started",
      },
    ],
  },
  {
    id: "goal-2",
    title: "Submit Term Project",
    description: "Complete and submit the final term project for CS401",
    status: "not-started",
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(),
    progress: 0,
    subGoals: [
      {
        id: "subgoal-5",
        title: "Research and outline",
        status: "not-started",
      },
      {
        id: "subgoal-6",
        title: "Implement core features",
        status: "not-started",
      },
      {
        id: "subgoal-7",
        title: "Write documentation",
        status: "not-started",
      },
      {
        id: "subgoal-8",
        title: "Prepare presentation",
        status: "not-started",
      },
    ],
  },
  {
    id: "goal-3",
    title: "Daily Study Routine",
    description: "Maintain a consistent daily study schedule",
    status: "in-progress",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(),
    progress: 75,
    streak: 7,
    subGoals: [
      {
        id: "subgoal-9",
        title: "Morning review (30 mins)",
        status: "in-progress",
      },
      {
        id: "subgoal-10",
        title: "Afternoon deep work (2 hrs)",
        status: "in-progress",
      },
      {
        id: "subgoal-11",
        title: "Evening summary (30 mins)",
        status: "in-progress",
      },
    ],
  },
];

// Shared goals map for demo purposes
const sharedGoalsMap: Record<string, Goal> = {};

const GoalContext = createContext<GoalContextProps | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      // Load goals from localStorage or use initial goals for demo
      const storedGoals = localStorage.getItem("masterplan_goals");
      if (storedGoals) {
        try {
          // Parse dates correctly
          const parsedGoals = JSON.parse(storedGoals, (key, value) => {
            if (key === "deadline" || key === "createdAt" || key === "updatedAt") {
              return value ? new Date(value) : undefined;
            }
            return value;
          });
          setGoals(parsedGoals);
        } catch (error) {
          console.error("Failed to parse stored goals:", error);
          setGoals(initialGoals);
        }
      } else {
        // Use initial goals for demo
        setGoals(initialGoals);
      }
    } else {
      // Clear goals when logged out
      setGoals([]);
    }
  }, [authState.isAuthenticated]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (authState.isAuthenticated && goals.length > 0) {
      localStorage.setItem("masterplan_goals", JSON.stringify(goals));
    }
  }, [goals, authState.isAuthenticated]);

  const calculateProgress = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || goal.subGoals.length === 0) return 0;

    const totalSubGoals = goal.subGoals.length;
    const completedSubGoals = goal.subGoals.filter((sg) => sg.status === "completed").length;
    const inProgressSubGoals = goal.subGoals.filter((sg) => sg.status === "in-progress").length;
    
    // Calculate weighted progress
    return Math.round((completedSubGoals + inProgressSubGoals * 0.5) / totalSubGoals * 100);
  };

  const updateGoalProgress = (goalId: string) => {
    setGoals((prevGoals) => 
      prevGoals.map((goal) => 
        goal.id === goalId 
          ? { ...goal, progress: calculateProgress(goalId) } 
          : goal
      )
    );
  };

  const updateGoalStatus = (goalId: string) => {
    setGoals((prevGoals) => 
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const progress = calculateProgress(goalId);
          
          let status: GoalStatus = "not-started";
          if (progress === 100) {
            status = "completed";
          } else if (progress > 0) {
            status = "in-progress";
          }
          
          return { ...goal, status, progress };
        }
        return goal;
      })
    );
  };

  const addGoal = (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "progress">) => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
    };
    
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    toast.success("Goal added successfully!");
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals((prevGoals) => 
      prevGoals.map((goal) => 
        goal.id === goalId 
          ? { ...goal, ...updates, updatedAt: new Date() } 
          : goal
      )
    );
    toast.success("Goal updated successfully!");
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
    toast.success("Goal deleted successfully!");
  };

  const addSubGoal = (goalId: string, subGoal: Omit<SubGoal, "id">) => {
    const newSubGoal: SubGoal = {
      ...subGoal,
      id: uuidv4(),
    };
    
    setGoals((prevGoals) => 
      prevGoals.map((goal) => 
        goal.id === goalId 
          ? { 
              ...goal, 
              subGoals: [...goal.subGoals, newSubGoal],
              updatedAt: new Date() 
            } 
          : goal
      )
    );
    
    updateGoalProgress(goalId);
    updateGoalStatus(goalId);
    toast.success("Sub-goal added successfully!");
  };

  const updateSubGoal = (goalId: string, subGoalId: string, updates: Partial<SubGoal>) => {
    setGoals((prevGoals) => 
      prevGoals.map((goal) => 
        goal.id === goalId 
          ? { 
              ...goal, 
              subGoals: goal.subGoals.map((sg) => 
                sg.id === subGoalId ? { ...sg, ...updates } : sg
              ),
              updatedAt: new Date()
            } 
          : goal
      )
    );
    
    updateGoalProgress(goalId);
    updateGoalStatus(goalId);
    toast.success("Sub-goal updated successfully!");
  };

  const deleteSubGoal = (goalId: string, subGoalId: string) => {
    setGoals((prevGoals) => 
      prevGoals.map((goal) => 
        goal.id === goalId 
          ? { 
              ...goal, 
              subGoals: goal.subGoals.filter((sg) => sg.id !== subGoalId),
              updatedAt: new Date()
            } 
          : goal
      )
    );
    
    updateGoalProgress(goalId);
    updateGoalStatus(goalId);
    toast.success("Sub-goal deleted successfully!");
  };

  const getGoal = (goalId: string) => {
    return goals.find((goal) => goal.id === goalId);
  };

  const shareGoal = (goalId: string) => {
    // In a real app, we would create a sharing link through an API
    // For demo purposes, we'll create a simple unique ID and store the goal
    const shareId = uuidv4();
    const goal = goals.find((g) => g.id === goalId);
    
    if (goal) {
      sharedGoalsMap[shareId] = { ...goal, shared: true };
      toast.success("Goal shared successfully! Copy the link to share with friends.");
      return `${window.location.origin}/shared/${shareId}`;
    } else {
      toast.error("Goal not found.");
      return "";
    }
  };

  const fetchSharedGoal = (shareId: string) => {
    // In a real app, we would fetch the shared goal from an API
    // For demo purposes, we'll return it from our local map
    return sharedGoalsMap[shareId] || null;
  };

  return (
    <GoalContext.Provider value={{ 
      goals, 
      addGoal, 
      updateGoal, 
      deleteGoal, 
      addSubGoal, 
      updateSubGoal, 
      deleteSubGoal,
      getGoal,
      calculateProgress,
      shareGoal,
      fetchSharedGoal
    }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalProvider");
  }
  return context;
};
