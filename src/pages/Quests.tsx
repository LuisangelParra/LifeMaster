import React from 'react';
import { Target, Trophy, Star, Zap, Medal, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';

const Quests = () => {
  const { state } = useApp();

  const levelProgress = (state.userStats.xp % 100) / 100;
  const nextLevelXp = state.userStats.level * 100;

  const mockBadges = [
    { id: '1', name: 'Note Taker', description: 'Created your first note', icon: 'BookOpen', unlocked: state.userStats.totalNotes > 0 },
    { id: '2', name: 'Task Master', description: 'Completed 10 tasks', icon: 'CheckSquare', unlocked: state.userStats.totalTasks >= 10 },
    { id: '3', name: 'Focus Champion', description: 'Completed 5 hours of focus time', icon: 'Clock', unlocked: state.userStats.totalFocusTime >= 300 },
    { id: '4', name: 'Streak Keeper', description: 'Maintained a 7-day streak', icon: 'Zap', unlocked: state.userStats.longestStreak >= 7 },
    { id: '5', name: 'Level Up', description: 'Reached level 5', icon: 'Star', unlocked: state.userStats.level >= 5 },
    { id: '6', name: 'Knowledge Seeker', description: 'Created 50 notes', icon: 'Brain', unlocked: state.userStats.totalNotes >= 50 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="w-8 h-8 mr-3 text-violet-600" />
            Life Quests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gamify your productivity journey
          </p>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Level {state.userStats.level}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Productivity Master
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {state.userStats.xp} / {nextLevelXp} XP
            </p>
            <p className="text-lg font-semibold text-violet-600">
              {nextLevelXp - state.userStats.xp} XP to next level
            </p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-violet-500 to-purple-500 h-4 rounded-full transition-all duration-500 animate-pulse-glow"
            style={{ width: `${levelProgress * 100}%` }}
          ></div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Star className="w-8 h-8 text-violet-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.userStats.totalXp.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
        </Card>
        
        <Card className="p-6 text-center">
          <Zap className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.userStats.streak}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
        </Card>
        
        <Card className="p-6 text-center">
          <Medal className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {mockBadges.filter(b => b.unlocked).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Badges</p>
        </Card>
        
        <Card className="p-6 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.userStats.longestStreak}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Best Streak</p>
        </Card>
      </div>

      {/* Missions and Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Missions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-violet-600" />
            Active Missions
          </h2>
          
          <div className="space-y-4">
            {state.missions.map((mission) => (
              <div key={mission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {mission.title}
                  </h3>
                  <Badge variant={mission.type === 'daily' ? 'primary' : 'secondary'}>
                    {mission.type}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {mission.description}
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Progress: {mission.current} / {mission.target}
                  </span>
                  <span className="text-sm font-medium text-violet-600">
                    +{mission.xpReward} XP
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((mission.current / mission.target) * 100, 100)}%` }}
                  ></div>
                </div>
                
                {mission.completed && (
                  <div className="mt-2 text-center">
                    <Badge variant="success">Completed! 🎉</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Badge Collection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-amber-600" />
            Badge Collection
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockBadges.map((badge) => (
              <div 
                key={badge.id} 
                className={`
                  border-2 rounded-lg p-4 text-center transition-all duration-200
                  ${badge.unlocked 
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
                    : 'border-gray-200 dark:border-gray-700 opacity-50'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center
                  ${badge.unlocked 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600' 
                    : 'bg-gray-300 dark:bg-gray-600'
                  }
                `}>
                  <Medal className={`w-6 h-6 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`} />
                </div>
                
                <h3 className={`
                  font-medium text-sm mb-1
                  ${badge.unlocked 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {badge.name}
                </h3>
                
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {badge.description}
                </p>
                
                {badge.unlocked && (
                  <div className="mt-2">
                    <Badge variant="success" size="sm">Unlocked!</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quests;