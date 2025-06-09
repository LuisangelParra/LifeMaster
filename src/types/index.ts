export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedNotes: string[];
  linkedProjects?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  xpReward: number;
  createdAt: Date;
  completedAt?: Date;
  projectId?: string;
  subprojectId?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  deadline: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirements: {
    type: 'notes' | 'tasks' | 'focus' | 'streak';
    target: number;
  };
}

export interface FocusSession {
  id: string;
  duration: number; // in minutes
  type: 'pomodoro' | 'deep-work' | 'meditation';
  tags: string[];
  startTime: Date;
  endTime: Date;
  xpEarned: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  badges: Badge[];
  totalNotes: number;
  totalTasks: number;
  totalFocusTime: number; // in minutes
}

// New Knowledge Hub Types
export interface Area {
  id: string;
  title: string;
  description: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  id: string;
  areaId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  themeId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  startDate?: Date;
  endDate?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  goalId: string;
  title: string;
  description: string;
  summary: string;
  context: string;
  deliverables: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  linkedNotes: string[];
  linkedProjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subproject {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface AppState {
  notes: Note[];
  tasks: Task[];
  missions: Mission[];
  focusSessions: FocusSession[];
  userStats: UserStats;
  currentFocusSession?: {
    startTime: Date;
    duration: number;
    type: string;
  };
  theme: 'light' | 'dark';
  // Knowledge Hub State
  areas: Area[];
  themes: Theme[];
  goals: Goal[];
  projects: Project[];
  subprojects: Subproject[];
}