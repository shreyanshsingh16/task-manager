import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Plus, CheckSquare } from 'lucide-react';
import { TaskColumn } from './components/TaskColumn';
import { TaskForm } from './components/TaskForm';
import { FilterBar } from './components/FilterBar';
import { Button } from './components/ui/button';
import { Task, Priority, Status, SortOption } from './types/task';

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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as Status;

    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['To-Do', 'In-Progress', 'Completed'] as Status[]).map(status => (
              <TaskColumn
                key={status}
                title={status}
                tasks={tasksByStatus[status]}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                duplicateTasks={duplicateTasks}
              />
            ))}
          </div>
        </DragDropContext>
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
