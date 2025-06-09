import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  Timer, 
  Home, 
  Settings,
  Sun,
  Moon,
  Trophy,
  BookOpen,
  CheckSquare,
  Folder
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { state, dispatch } = useApp();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/knowledge', icon: Folder, label: 'Knowledge Hub' },
    { to: '/quests', icon: Target, label: 'Life Quests' },
    { to: '/focus', icon: Timer, label: 'Monk Mode' },
    { to: '/notes', icon: BookOpen, label: 'Quick Notes' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              LifeMaster
            </h1>
            <p className="text-xs text-slate-400">Level {state.userStats.level}</p>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="p-4 border-b border-slate-700">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-300">XP Progress</span>
          <span className="text-violet-400">
            {state.userStats.xp} / {state.userStats.level * 100}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ 
              width: `${(state.userStats.xp % 100)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-violet-400 ${
                isActive
                  ? 'bg-slate-800 text-violet-400 border-r-2 border-violet-400'
                  : 'text-slate-300'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          className="flex items-center space-x-3 w-full px-2 py-2 text-sm text-slate-300 hover:text-violet-400 transition-colors"
        >
          {state.theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
          <span>Toggle Theme</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;