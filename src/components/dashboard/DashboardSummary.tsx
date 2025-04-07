
import { useGoals } from "@/contexts/GoalContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target } from "lucide-react";
import { isBefore } from "date-fns";

export const DashboardSummary: React.FC = () => {
  const { goals } = useGoals();
  
  // Calculate summary statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.status === "completed").length;
  const inProgressGoals = goals.filter(goal => goal.status === "in-progress").length;
  
  // Calculate overall progress
  const overallProgress = totalGoals > 0
    ? Math.round((completedGoals + inProgressGoals * 0.5) / totalGoals * 100)
    : 0;
  
  // Find upcoming deadlines (next 7 days)
  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);
  
  const upcomingDeadlines = goals
    .filter(goal => 
      goal.deadline && 
      isBefore(new Date(goal.deadline), next7Days) && 
      goal.status !== "completed"
    )
    .sort((a, b) => {
      return new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime();
    });
  
  // Find the longest streak
  const longestStreak = Math.max(0, ...goals.map(goal => goal.streak || 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="dashboard-card col-span-full animate-fade-in border border-purple-200/30 bg-gradient-to-br from-masterplan-purple/5 to-masterplan-teal/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 gradient-text">Overall Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span>Progress across all goals</span>
            <span className="font-semibold">{overallProgress}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-2 bg-gray-100" 
            style={{
              background: 'linear-gradient(90deg, rgba(108,99,255,0.2) 0%, rgba(46,196,182,0.2) 100%)',
            }}
          />
          
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="p-2 rounded-md bg-white/80 shadow-sm">
              <div className="text-3xl font-bold gradient-text">{totalGoals}</div>
              <div className="text-sm text-muted-foreground">Total Goals</div>
            </div>
            <div className="p-2 rounded-md bg-white/80 shadow-sm">
              <div className="text-3xl font-bold" style={{color: '#FFD166'}}>{inProgressGoals}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="p-2 rounded-md bg-white/80 shadow-sm">
              <div className="text-3xl font-bold" style={{color: '#06D6A0'}}>{completedGoals}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="dashboard-card animate-fade-in border border-purple-200/30 bg-gradient-to-br from-masterplan-amber/5 to-masterplan-coral/10">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2 text-masterplan-amber" />
            <h3 className="text-lg font-medium gradient-text-warm">Upcoming Deadlines</h3>
          </div>
          
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 3).map(goal => (
                <div key={goal.id} className="flex items-start p-2 bg-white/80 rounded-md shadow-sm">
                  <div className={`w-3 h-3 rounded-full mt-1.5 mr-2 ${goal.status === "in-progress" ? "bg-status-in-progress" : "bg-status-not-started"}`}></div>
                  <div>
                    <div className="font-medium">{goal.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Due {new Date(goal.deadline!).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingDeadlines.length > 3 && (
                <div className="text-sm text-muted-foreground pt-1 text-center">
                  +{upcomingDeadlines.length - 3} more deadlines
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground bg-white/80 rounded-md">
              <p>No upcoming deadlines!</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="dashboard-card animate-fade-in border border-purple-200/30 bg-gradient-to-br from-masterplan-teal/5 to-masterplan-green/10">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 mr-2 text-masterplan-teal" />
            <h3 className="text-lg font-medium gradient-text">Achievement Stats</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 bg-white/80 rounded-md shadow-sm">
              <span className="text-sm">Completion Rate</span>
              <span className="font-medium">{totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white/80 rounded-md shadow-sm">
              <span className="text-sm">Longest Streak</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-status-completed" />
                <span className="font-medium">{longestStreak} days</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-white/80 rounded-md shadow-sm">
              <span className="text-sm">Goals This Month</span>
              <span className="font-medium">{totalGoals}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
