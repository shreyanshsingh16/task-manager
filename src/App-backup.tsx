import React, { useState, useEffect } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { FilterBar } from './components/FilterBar';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Task, Priority, Status, SortOption } from './types/task';
import { format } from 'date-fns';
import { Calendar, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { cn } from './lib/utils';

// Simple TaskCard without drag and drop
const SimpleTaskCard: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isDuplicate?: boolean;
}> = ({ task, onEdit, onDelete, isDuplicate }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  
  const priorityColors: Record<Priority, string> = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityIcons: Record<Priority, React.ReactNode> = {
    Low: <div className="w-2 h-2 rounded-full bg-green-500" />,
    Medium: <div className="w-2 h-2 rounded-full bg-yellow-500" />,
    High: <div className="w-2 h-2 rounded-full bg-red-500" />,
  };

  return (
    <Card className={cn(
      "mb-3 cursor-pointer hover:shadow-md transition-shadow",
      isOverdue && "border-red-300 bg-red-50"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {task.title}
            {isDuplicate && (
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                Duplicate Task
              </span>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
        
        <div className="space-y-2">
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border",
            priorityColors[task.priority]
          )}>
            {priorityIcons[task.priority]}
            {task.priority}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
              {isOverdue && <AlertCircle className="h-3 w-3 text-red-500" />}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(task.createdAt), 'MMM dd')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple TaskColumn without drag and drop
const SimpleTaskColumn: React.FC<{
  title: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  duplicateTasks: Set<number>;
}> = ({ title, tasks, onEditTask, onDeleteTask, duplicateTasks }) => {
  const columnStyles: Record<Status, string> = {
    'To-Do': 'bg-slate-50 border-slate-200',
    'In-Progress': 'bg-blue-50 border-blue-200',
    'Completed': 'bg-green-50 border-green-200',
  };

  const columnHeaders: Record<Status, string> = {
    'To-Do': 'To-Do',
    'In-Progress': 'In Progress',
    'Completed': 'Completed',
  };

  return (
    <div className={cn(
      "flex-1 min-w-0 rounded-lg border-2 border-dashed p-4",
      columnStyles[title]
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{columnHeaders[title]}</h2>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
          {tasks.length}
        </span>
      </div>
      
      <div className="min-h-[200px]">
        {tasks.map((task) => (
          <SimpleTaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            isDuplicate={duplicateTasks.has(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Load initial tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Try to load from localStorage first
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        } else {
          // Load from JSON file if no saved tasks
          const response = await fetch('/tasks.json');
          const initialTasks = await response.json();
          setTasks(initialTasks);
          localStorage.setItem('tasks', JSON.stringify(initialTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        // Fallback data if fetch fails
        const fallbackTasks = [
          {
            id: 101,
            title: "Design Homepage UI",
            description: "Create wireframes and layout structure",
            priority: "High" as Priority,
            status: "To-Do" as Status,
            dueDate: "2025-02-12T09:00:00Z",
            createdAt: "2025-01-25T14:10:00Z"
          }
        ];
        setTasks(fallbackTasks);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = tasks.filter(task => {
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesPriority && matchesStatus;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, priorityFilter, statusFilter, sortBy]);

  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const grouped = {
      'To-Do': [] as Task[],
      'In-Progress': [] as Task[],
      'Completed': [] as Task[],
    };

    filteredAndSortedTasks.forEach(task => {
      grouped[task.status].push(task);
    });

    return grouped;
  }, [filteredAndSortedTasks]);

  // Find duplicate tasks (same title in same status)
  const duplicateTasks = React.useMemo(() => {
    const duplicates = new Set<number>();
    const titlesByStatus: Record<Status, Record<string, number[]>> = {
      'To-Do': {},
      'In-Progress': {},
      'Completed': {},
    };

    tasks.forEach(task => {
      const title = task.title.toLowerCase().trim();
      if (!titlesByStatus[task.status][title]) {
        titlesByStatus[task.status][title] = [];
      }
      titlesByStatus[task.status][title].push(task.id);
    });

    Object.values(titlesByStatus).forEach(statusTitles => {
      Object.values(statusTitles).forEach(taskIds => {
        if (taskIds.length > 1) {
          taskIds.forEach(id => duplicates.add(id));
        }
      });
    });

    return duplicates;
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleClearFilters = () => {
    setPriorityFilter('All');
    setStatusFilter('All');
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            priorityFilter={priorityFilter}
            statusFilter={statusFilter}
            sortBy={sortBy}
            onPriorityFilterChange={setPriorityFilter}
            onStatusFilterChange={setStatusFilter}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['To-Do', 'In-Progress', 'Completed'] as Status[]).map(status => (
            <SimpleTaskColumn
              key={status}
              title={status}
              tasks={tasksByStatus[status]}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              duplicateTasks={duplicateTasks}
            />
          ))}
        </div>
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
}

export default App;