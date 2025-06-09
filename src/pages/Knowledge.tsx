import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Link, 
  BookOpen, 
  Edit3, 
  Folder,
  Target,
  Briefcase,
  Calendar,
  Filter,
  ArrowRight,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Note, Area, Theme, Goal, Project, Subproject } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';

type ViewMode = 'hierarchy' | 'notes' | 'calendar' | 'map';
type CreateMode = 'area' | 'theme' | 'goal' | 'project' | 'subproject' | 'note' | null;

const Knowledge = () => {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    context: '',
    deliverables: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    color: '#8b5cf6',
    startDate: '',
    endDate: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      summary: '',
      context: '',
      deliverables: '',
      priority: 'medium',
      color: '#8b5cf6',
      startDate: '',
      endDate: ''
    });
    setCreateMode(null);
  };

  const handleCreateArea = () => {
    if (!formData.title.trim()) return;

    const area: Area = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      color: formData.color,
      priority: formData.priority,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_AREA', payload: area });
    dispatch({ type: 'ADD_XP', payload: 50 });
    resetForm();
  };

  const handleCreateTheme = () => {
    if (!formData.title.trim() || !selectedArea) return;

    const theme: Theme = {
      id: Date.now().toString(),
      areaId: selectedArea,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_THEME', payload: theme });
    dispatch({ type: 'ADD_XP', payload: 40 });
    resetForm();
  };

  const handleCreateGoal = () => {
    if (!formData.title.trim() || !selectedTheme) return;

    const goal: Goal = {
      id: Date.now().toString(),
      themeId: selectedTheme,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_GOAL', payload: goal });
    dispatch({ type: 'ADD_XP', payload: 75 });
    resetForm();
  };

  const handleCreateProject = () => {
    if (!formData.title.trim() || !selectedGoal) return;

    const project: Project = {
      id: Date.now().toString(),
      goalId: selectedGoal,
      title: formData.title,
      description: formData.description,
      summary: formData.summary,
      context: formData.context,
      deliverables: formData.deliverables.split('\n').filter(Boolean),
      priority: formData.priority,
      status: 'planning',
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      progress: 0,
      milestones: [],
      linkedNotes: [],
      linkedProjects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_PROJECT', payload: project });
    dispatch({ type: 'ADD_XP', payload: 100 });
    resetForm();
  };

  const getAreaThemes = (areaId: string) => 
    state.themes.filter(theme => theme.areaId === areaId);

  const getThemeGoals = (themeId: string) => 
    state.goals.filter(goal => goal.themeId === themeId);

  const getGoalProjects = (goalId: string) => 
    state.projects.filter(project => project.goalId === goalId);

  const getProjectSubprojects = (projectId: string) => 
    state.subprojects.filter(subproject => subproject.projectId === projectId);

  const filteredAreas = state.areas.filter(area => {
    const matchesSearch = area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || area.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'paused': return 'text-amber-600 bg-amber-100 dark:bg-amber-900';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-emerald-600" />
            Knowledge Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your hierarchical second brain for life management
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            icon={Plus} 
            onClick={() => setCreateMode('area')}
            variant="success"
          >
            New Area
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { mode: 'hierarchy', label: 'Hierarchy', icon: Folder },
          { mode: 'notes', label: 'Notes', icon: BookOpen },
          { mode: 'calendar', label: 'Calendar', icon: Calendar },
          { mode: 'map', label: 'Relations Map', icon: Link }
        ].map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as ViewMode)}
            className={`
              flex items-center gap-2 px-4 py-2 border-b-2 transition-colors
              ${viewMode === mode
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search areas, themes, goals, projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Create Form Modal */}
      {createMode && (
        <Card className="p-6 border-2 border-emerald-200 dark:border-emerald-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New {createMode.charAt(0).toUpperCase() + createMode.slice(1)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            {createMode === 'area' && (
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            )}

            {createMode === 'theme' && (
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Area</option>
                {state.areas.map(area => (
                  <option key={area.id} value={area.id}>{area.title}</option>
                ))}
              </select>
            )}

            {createMode === 'goal' && (
              <>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Theme</option>
                  {state.themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.title}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </>
            )}

            {createMode === 'project' && (
              <>
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Goal</option>
                  {state.goals.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.title}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </>
            )}
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />

          {createMode === 'project' && (
            <>
              <textarea
                placeholder="Project Summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={2}
                className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <textarea
                placeholder="Context & Background"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                rows={2}
                className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <textarea
                placeholder="Deliverables (one per line)"
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                rows={3}
                className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="success" 
              onClick={() => {
                switch (createMode) {
                  case 'area': handleCreateArea(); break;
                  case 'theme': handleCreateTheme(); break;
                  case 'goal': handleCreateGoal(); break;
                  case 'project': handleCreateProject(); break;
                }
              }}
            >
              Create {createMode}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Hierarchy View */}
      {viewMode === 'hierarchy' && (
        <div className="space-y-6">
          {filteredAreas.map((area) => (
            <Card key={area.id} className="p-6" hover>
              {/* Area Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: area.color }}
                  ></div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {area.title}
                  </h2>
                  <Badge variant="secondary" size="sm" className={getPriorityColor(area.priority)}>
                    {area.priority}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedArea(area.id);
                      setCreateMode('theme');
                    }}
                  >
                    Add Theme
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">{area.description}</p>

              {/* Themes */}
              <div className="space-y-4">
                {getAreaThemes(area.id).map((theme) => (
                  <div key={theme.id} className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {theme.title}
                        </h3>
                        <Badge variant="secondary" size="sm" className={getPriorityColor(theme.priority)}>
                          {theme.priority}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTheme(theme.id);
                          setCreateMode('goal');
                        }}
                      >
                        Add Goal
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{theme.description}</p>

                    {/* Goals */}
                    <div className="space-y-3">
                      {getThemeGoals(theme.id).map((goal) => (
                        <div key={goal.id} className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-purple-600" />
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {goal.title}
                              </h4>
                              <Badge variant="secondary" size="sm" className={getPriorityColor(goal.priority)}>
                                {goal.priority}
                              </Badge>
                              {goal.completed && (
                                <Badge variant="success" size="sm">Completed</Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedGoal(goal.id);
                                setCreateMode('project');
                              }}
                            >
                              Add Project
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{goal.description}</p>
                          
                          {(goal.startDate || goal.endDate) && (
                            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                              {goal.startDate && (
                                <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
                              )}
                              {goal.endDate && (
                                <span>End: {new Date(goal.endDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          )}

                          {/* Projects */}
                          <div className="space-y-2">
                            {getGoalProjects(goal.id).map((project) => (
                              <div key={project.id} className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                      {project.title}
                                    </h5>
                                    <Badge variant="secondary" size="sm" className={getStatusColor(project.status)}>
                                      {project.status}
                                    </Badge>
                                    <Badge variant="secondary" size="sm" className={getPriorityColor(project.priority)}>
                                      {project.priority}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                                
                                {/* Progress Bar */}
                                <div className="mb-2">
                                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${project.progress}%` }}
                                    ></div>
                                  </div>
                                </div>

                                {(project.startDate || project.endDate) && (
                                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    {project.startDate && (
                                      <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                                    )}
                                    {project.endDate && (
                                      <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {filteredAreas.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No areas found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start building your knowledge hierarchy by creating your first area
              </p>
              <Button icon={Plus} onClick={() => setCreateMode('area')}>
                Create Your First Area
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Notes View */}
      {viewMode === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.notes.length > 0 ? (
            state.notes.map((note) => (
              <Card key={note.id} className="p-6 hover:shadow-lg transition-shadow" hover>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {note.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit3}
                    className="ml-2"
                  />
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                  {note.content}
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Created {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  {note.linkedNotes.length > 0 && (
                    <span className="flex items-center">
                      <Link className="w-3 h-3 mr-1" />
                      {note.linkedNotes.length} links
                    </span>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notes found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start capturing your thoughts and ideas
              </p>
              <Button icon={Plus} onClick={() => setCreateMode('note')}>
                Create Your First Note
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Calendar and Map views placeholder */}
      {(viewMode === 'calendar' || viewMode === 'map') && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {viewMode === 'calendar' ? 'Calendar View' : 'Relations Map'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Coming soon! This view will show {viewMode === 'calendar' ? 'all your deadlines and milestones' : 'visual connections between your knowledge items'}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Knowledge;