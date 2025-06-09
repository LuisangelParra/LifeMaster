import React, { useState } from 'react';
import { Plus, CheckSquare, Circle, Trash2, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';

const Tasks = () => {
  const { state, dispatch } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const filteredTasks = state.tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    const xpReward = {
      'low': 10,
      'medium': 25,
      'high': 50
    }[newTask.priority];

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || undefined,
      completed: false,
      priority: newTask.priority,
      tags: [],
      xpReward,
      createdAt: new Date()
    };

    dispatch({ type: 'ADD_TASK', payload: task });
    setNewTask({ title: '', description: '', priority: 'medium' });
    setIsCreating(false);
  };

  const handleCompleteTask = (taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });
  };

  const pendingTasks = state.tasks.filter(task => !task.completed);
  const completedTasks = state.tasks.filter(task => task.completed);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <CheckSquare className="w-8 h-8 mr-3 text-blue-600" />
            Task Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your tasks and earn XP for completion
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsCreating(true)}>
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <Circle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {pendingTasks.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</p>
        </Card>
        
        <Card className="p-6 text-center">
          <CheckSquare className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedTasks.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-violet-600 text-sm font-bold">XP</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedTasks.reduce((total, task) => total + task.xpReward, 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">XP Earned</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Tasks' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' }
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value as any)}
              className={`
                px-3 py-1 rounded-lg text-sm font-medium transition-colors
                ${filter === filterOption.value
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Create Task Form */}
      {isCreating && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New Task
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <textarea
              placeholder="Task description (optional)..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low Priority (+10 XP)</option>
                <option value="medium">Medium Priority (+25 XP)</option>
                <option value="high">High Priority (+50 XP)</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="success" onClick={handleCreateTask}>
                Create Task
              </Button>
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="p-6" hover>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => !task.completed && handleCompleteTask(task.id)}
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1
                      ${task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                      }
                    `}
                  >
                    {task.completed && <CheckSquare className="w-4 h-4" />}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`
                      text-lg font-semibold
                      ${task.completed 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                      }
                    `}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`
                        text-sm mt-1
                        ${task.completed 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-600 dark:text-gray-400'
                        }
                      `}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={
                          task.priority === 'high' ? 'error' :
                          task.priority === 'medium' ? 'warning' : 'secondary'
                        }
                        size="sm"
                      >
                        {task.priority} priority
                      </Badge>
                      
                      <Badge variant="primary" size="sm">
                        +{task.xpReward} XP
                      </Badge>
                      
                      {task.completed && task.completedAt && (
                        <Badge variant="success" size="sm">
                          Completed {new Date(task.completedAt).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'No tasks found' :
               filter === 'pending' ? 'No pending tasks' :
               'No completed tasks'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'pending' 
                ? "Great job! You're all caught up."
                : "Create your first task to get started."
              }
            </p>
            {filter !== 'completed' && (
              <Button icon={Plus} onClick={() => setIsCreating(true)}>
                Create Your First Task
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;