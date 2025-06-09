import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';

const Focus = () => {
  const { state, dispatch } = useApp();
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro');

  const durations = [
    { label: '15 min', value: 15 },
    { label: '25 min', value: 25 },
    { label: '45 min', value: 45 },
    { label: '90 min', value: 90 }
  ];

  const sessionTypes = [
    { id: 'pomodoro', label: 'Pomodoro', description: 'Traditional 25-minute focus sessions' },
    { id: 'deep-work', label: 'Deep Work', description: 'Extended focus periods for complex tasks' },
    { id: 'meditation', label: 'Meditation', description: 'Mindfulness and breathing exercises' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startSession = () => {
    setTimeLeft(selectedDuration * 60);
    setIsActive(true);
    dispatch({ 
      type: 'START_FOCUS_SESSION', 
      payload: { duration: selectedDuration, type: sessionType } 
    });
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const stopSession = () => {
    setIsActive(false);
    setTimeLeft(0);
    handleSessionComplete();
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    setTimeLeft(0);
    dispatch({ type: 'END_FOCUS_SESSION' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todaysSessions = state.focusSessions.filter(session => {
    const today = new Date().toDateString();
    return new Date(session.startTime).toDateString() === today;
  });

  const todaysFocusTime = todaysSessions.reduce((total, session) => total + session.duration, 0);
  const weeklyFocusTime = state.focusSessions
    .filter(session => {
      const sessionDate = new Date(session.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    })
    .reduce((total, session) => total + session.duration, 0);

  const progress = timeLeft > 0 ? ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Timer className="w-8 h-8 mr-3 text-amber-600" />
            Monk Mode
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Deep focus sessions for maximum productivity
          </p>
        </div>
      </div>

      {/* Timer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <Card className="p-8 text-center">
            {/* Session Type Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Session Type
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sessionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSessionType(type.id)}
                    disabled={isActive}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 text-left
                      ${sessionType === type.id
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                      }
                      ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {type.label}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Duration
              </h2>
              <div className="flex justify-center gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => setSelectedDuration(duration.value)}
                    disabled={isActive}
                    className={`
                      px-4 py-2 rounded-lg border-2 transition-all duration-200
                      ${selectedDuration === duration.value
                        ? 'border-violet-500 bg-violet-500 text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-300'
                      }
                      ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Display */}
            <div className="mb-8">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="text-violet-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {timeLeft > 0 ? formatTime(timeLeft) : formatTime(selectedDuration * 60)}
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                {!isActive ? (
                  <Button
                    icon={Play}
                    onClick={startSession}
                    variant="success"
                    size="lg"
                    disabled={timeLeft > 0 && timeLeft < selectedDuration * 60}
                  >
                    Start Session
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      icon={Pause}
                      onClick={pauseSession}
                      variant="warning"
                      size="lg"
                    >
                      Pause
                    </Button>
                    <Button
                      icon={Square}
                      onClick={stopSession}
                      variant="error"
                      size="lg"
                    >
                      Stop
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Today's Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
              Today's Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {todaysSessions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Focus Time</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(todaysFocusTime / 60)}h {todaysFocusTime % 60}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">XP Earned</span>
                <span className="font-medium text-violet-600">
                  +{todaysSessions.reduce((total, session) => total + session.xpEarned, 0)}
                </span>
              </div>
            </div>
          </Card>

          {/* Weekly Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Weekly Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(weeklyFocusTime / 60)}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily Average</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(weeklyFocusTime / 7 / 60)}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
                <Badge variant="success" size="sm">
                  {state.userStats.streak} days
                </Badge>
              </div>
            </div>
          </Card>

          {/* Recent Sessions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-amber-600" />
              Recent Sessions
            </h3>
            <div className="space-y-2">
              {state.focusSessions.slice(-5).reverse().map((session) => (
                <div key={session.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {session.duration}m
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      {session.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(session.startTime).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {state.focusSessions.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No sessions yet. Start your first focus session!
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Focus;