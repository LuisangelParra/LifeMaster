import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Note, Task, Mission, FocusSession, Badge, Area, Theme, Goal, Project, Subproject } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'START_FOCUS_SESSION'; payload: { duration: number; type: string } }
  | { type: 'END_FOCUS_SESSION' }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'UPDATE_MISSION'; payload: Mission }
  | { type: 'UNLOCK_BADGE'; payload: Badge }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOAD_STATE'; payload: AppState }
  // Knowledge Hub Actions
  | { type: 'ADD_AREA'; payload: Area }
  | { type: 'UPDATE_AREA'; payload: Area }
  | { type: 'DELETE_AREA'; payload: string }
  | { type: 'ADD_THEME'; payload: Theme }
  | { type: 'UPDATE_THEME'; payload: Theme }
  | { type: 'DELETE_THEME'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_SUBPROJECT'; payload: Subproject }
  | { type: 'UPDATE_SUBPROJECT'; payload: Subproject }
  | { type: 'DELETE_SUBPROJECT'; payload: string };

const initialState: AppState = {
  notes: [],
  tasks: [],
  missions: [
    {
      id: '1',
      title: 'Daily Notes',
      description: 'Create 3 notes today',
      type: 'daily',
      target: 3,
      current: 0,
      xpReward: 100,
      completed: false,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Weekly Focus',
      description: 'Complete 10 focus sessions this week',
      type: 'weekly',
      target: 10,
      current: 0,
      xpReward: 500,
      completed: false,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ],
  focusSessions: [],
  userStats: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    badges: [],
    totalNotes: 0,
    totalTasks: 0,
    totalFocusTime: 0
  },
  theme: 'light',
  // Knowledge Hub Initial State
  areas: [
    {
      id: '1',
      title: 'Career Development',
      description: 'Professional growth and skill development',
      color: '#8b5cf6',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Health & Wellness',
      description: 'Physical and mental health initiatives',
      color: '#10b981',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  themes: [
    {
      id: '1',
      areaId: '1',
      title: 'Web Development',
      description: 'Frontend and backend development skills',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  goals: [
    {
      id: '1',
      themeId: '1',
      title: 'Master React Ecosystem',
      description: 'Become proficient in React, Next.js, and related tools',
      priority: 'high',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  projects: [],
  subprojects: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      const loaded = action.payload;
      return {
        // primero pon tus valores por defecto …
        ...initialState,
        // … y sobreescribe con lo que tengas guardado
        ...loaded,
        // profundiza en userStats para no perder propiedades nuevas
        userStats: {
          ...initialState.userStats,
          ...loaded.userStats,
        },
        // y en cada array, asegúrate de usar el guardado o el default
        notes: loaded.notes ?? initialState.notes,
        tasks: loaded.tasks ?? initialState.tasks,
        missions: loaded.missions ?? initialState.missions,
        focusSessions: loaded.focusSessions ?? initialState.focusSessions,
        areas: loaded.areas ?? initialState.areas,
        themes: loaded.themes ?? initialState.themes,
        goals: loaded.goals ?? initialState.goals,
        projects: loaded.projects ?? initialState.projects,
        subprojects: loaded.subprojects ?? initialState.subprojects,
      };
    
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload],
        userStats: {
          ...state.userStats,
          totalNotes: state.userStats.totalNotes + 1
        }
      };
    
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id ? action.payload : note
        )
      };
    
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    
    case 'COMPLETE_TASK':
      const task = state.tasks.find(t => t.id === action.payload);
      if (!task || task.completed) return state;
      
      return {
        ...state,
        tasks: state.tasks.map(t => 
          t.id === action.payload 
            ? { ...t, completed: true, completedAt: new Date() }
            : t
        ),
        userStats: {
          ...state.userStats,
          xp: state.userStats.xp + task.xpReward,
          totalXp: state.userStats.totalXp + task.xpReward,
          totalTasks: state.userStats.totalTasks + 1
        }
      };
    
    case 'START_FOCUS_SESSION':
      return {
        ...state,
        currentFocusSession: {
          startTime: new Date(),
          duration: action.payload.duration,
          type: action.payload.type
        }
      };
    
    case 'END_FOCUS_SESSION':
      if (!state.currentFocusSession) return state;
      
      const session: FocusSession = {
        id: Date.now().toString(),
        duration: state.currentFocusSession.duration,
        type: state.currentFocusSession.type as any,
        tags: [],
        startTime: state.currentFocusSession.startTime,
        endTime: new Date(),
        xpEarned: Math.floor(state.currentFocusSession.duration * 2)
      };
      
      return {
        ...state,
        focusSessions: [...state.focusSessions, session],
        currentFocusSession: undefined,
        userStats: {
          ...state.userStats,
          xp: state.userStats.xp + session.xpEarned,
          totalXp: state.userStats.totalXp + session.xpEarned,
          totalFocusTime: state.userStats.totalFocusTime + session.duration
        }
      };
    
    case 'ADD_XP':
      const newXp = state.userStats.xp + action.payload;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      return {
        ...state,
        userStats: {
          ...state.userStats,
          xp: newXp,
          totalXp: state.userStats.totalXp + action.payload,
          level: newLevel,
          xpToNextLevel: (newLevel * 100) - newXp
        }
      };
    
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };

    // Knowledge Hub Reducers
    case 'ADD_AREA':
      return {
        ...state,
        areas: [...state.areas, action.payload]
      };

    case 'UPDATE_AREA':
      return {
        ...state,
        areas: state.areas.map(area => 
          area.id === action.payload.id ? action.payload : area
        )
      };

    case 'DELETE_AREA':
      return {
        ...state,
        areas: state.areas.filter(area => area.id !== action.payload),
        themes: state.themes.filter(theme => theme.areaId !== action.payload)
      };

    case 'ADD_THEME':
      return {
        ...state,
        themes: [...state.themes, action.payload]
      };

    case 'UPDATE_THEME':
      return {
        ...state,
        themes: state.themes.map(theme => 
          theme.id === action.payload.id ? action.payload : theme
        )
      };

    case 'DELETE_THEME':
      return {
        ...state,
        themes: state.themes.filter(theme => theme.id !== action.payload),
        goals: state.goals.filter(goal => goal.themeId !== action.payload)
      };

    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? action.payload : goal
        )
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload),
        projects: state.projects.filter(project => project.goalId !== action.payload)
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === action.payload.id ? action.payload : project
        )
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        subprojects: state.subprojects.filter(subproject => subproject.projectId !== action.payload)
      };

    case 'ADD_SUBPROJECT':
      return {
        ...state,
        subprojects: [...state.subprojects, action.payload]
      };

    case 'UPDATE_SUBPROJECT':
      return {
        ...state,
        subprojects: state.subprojects.map(subproject => 
          subproject.id === action.payload.id ? action.payload : subproject
        )
      };

    case 'DELETE_SUBPROJECT':
      return {
        ...state,
        subprojects: state.subprojects.filter(subproject => subproject.id !== action.payload)
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [storedState, setStoredState] = useLocalStorage('lifemaster-state', initialState);
  const [state, dispatch] = useReducer(appReducer, storedState);

  useEffect(() => {
    setStoredState(state);
  }, [state, setStoredState]);

  useEffect(() => {
    if (storedState !== initialState) {
      dispatch({ type: 'LOAD_STATE', payload: storedState });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}