
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  theme?: string;
}

// Goal types
export type GoalStatus = 'not-started' | 'in-progress' | 'completed';

export interface SubGoal {
  id: string;
  title: string;
  status: GoalStatus;
  deadline?: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: GoalStatus;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
  subGoals: SubGoal[];
  streak?: number;
  shared?: boolean;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Sharing types
export interface InviteLink {
  id: string;
  goalId: string;
  inviterId: string;
  expires: Date;
  status: 'active' | 'expired' | 'revoked';
}
