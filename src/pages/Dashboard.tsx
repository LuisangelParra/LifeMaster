import React from 'react';
import { 
  Brain, 
  Target, 
  Timer, 
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Clock,
  Folder,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';

const Dashboard = () => {
  const { state } = useApp();
  if (!state || !state.userStats) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Cargando datos…
        </p>
      </div>
    );
  }
  const stats = [
    {
      title: 'Total XP',
      value: state.userStats.totalXp.toLocaleString(),
      icon: Star,
      color: 'text-violet-600',
      bg: 'bg-violet-100 dark:bg-violet-900'
    },
    {
      title: 'Current Streak',
      value: `${state.userStats.streak} days`,
      icon: Zap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900'
    },
    {
      title: 'Focus Time',
      value: `${Math.round(state.userStats.totalFocusTime / 60)}h`,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-900'
    },
    {
      title: 'Level Progress',
      value: `${state.userStats.level}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900'
    }
  ];

  const recentNotes     = state.notes?.slice(-3) ?? [];
  const incompleteTasks = (state.tasks ?? []).filter(task => !task.completed).slice(0, 5);
  const activeMissions  = (state.missions ?? []).filter(mission => !mission.completed);
  const activeProjects  = (state.projects ?? []).filter(project => project.status === 'active').slice(0, 3);

  // Knowledge Hub Stats
  const totalAreas     = state.areas?.length ?? 0;
  const totalProjects  = state.projects?.length ?? 0;
  const completedGoals = (state.goals ?? []).filter(goal => goal.completed).length;
  const totalGoals     = state.goals?.length ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back! 
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Level {state.userStats.level} Productivity Master
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Knowledge Hub Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Folder className="w-6 h-6 mr-2 text-emerald-600" />
          Knowledge Hub Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Folder className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAreas}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Life Areas</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedGoals}/{totalGoals}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Goals Completed</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProjects}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Brain className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{state.notes.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Knowledge Notes</p>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
              Active Projects
            </h2>
          </div>
          <div className="space-y-3">
            {activeProjects.length > 0 ? (
              activeProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {project.title}
                    </h3>
                    <Badge 
                      variant={project.priority === 'high' ? 'error' : project.priority === 'medium' ? 'warning' : 'secondary'}
                      size="sm"
                    >
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {project.description}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {project.progress}% complete
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No active projects. Create your first project in the Knowledge Hub!
              </p>
            )}
          </div>
        </Card>

        {/* Active Missions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-violet-600" />
              Active Missions
            </h2>
          </div>
          <div className="space-y-3">
            {activeMissions.length > 0 ? (
              activeMissions.map((mission) => (
                <div key={mission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {mission.title}
                    </h3>
                    <Badge variant="primary" size="sm">
                      {mission.xpReward} XP
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {mission.description}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(mission.current / mission.target) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {mission.current} / {mission.target}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No active missions. New ones will appear soon!
              </p>
            )}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Timer className="w-5 h-5 mr-2 text-amber-600" />
              Pending Tasks
            </h2>
          </div>
          <div className="space-y-3">
            {incompleteTasks.length > 0 ? (
              incompleteTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {task.title}
                    </h3>
                    <Badge 
                      variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'secondary'}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No pending tasks. You're all caught up!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;