import React, { useState, useEffect } from 'react';

// Simple inline styles to avoid any CSS issues
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '1rem 2rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  column: {
    backgroundColor: '#f3f4f6',
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    padding: '1rem'
  },
  columnHeader: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    backgroundColor: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  cardTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  cardDescription: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.75rem'
  },
  priority: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  priorityHigh: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca'
  },
  priorityMedium: {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    border: '1px solid #fed7aa'
  },
  priorityLow: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0'
  }
};

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To-Do' | 'In-Progress' | 'Completed';
  dueDate: string;
  createdAt: string;
}

const SimpleTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const priorityStyle = task.priority === 'High' ? styles.priorityHigh :
                       task.priority === 'Medium' ? styles.priorityMedium : styles.priorityLow;

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{task.title}</div>
      <div style={styles.cardDescription}>{task.description}</div>
      <div style={{...styles.priority, ...priorityStyle}}>
        {task.priority}
      </div>
    </div>
  );
};

const SimpleTaskColumn: React.FC<{ 
  title: string; 
  tasks: Task[]; 
}> = ({ title, tasks }) => {
  return (
    <div style={styles.column}>
      <div style={styles.columnHeader}>
        <span>{title}</span>
        <span style={styles.badge}>{tasks.length}</span>
      </div>
      <div>
        {tasks.map(task => (
          <SimpleTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = () => {
      try {
        // Try localStorage first
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
          setIsLoading(false);
          return;
        }

        // Fallback data
        const fallbackTasks: Task[] = [
          {
            id: 101,
            title: "Design Homepage UI",
            description: "Create wireframes and layout structure",
            priority: "High",
            status: "To-Do",
            dueDate: "2025-02-12T09:00:00Z",
            createdAt: "2025-01-25T14:10:00Z"
          },
          {
            id: 102,
            title: "Setup Database Schema",
            description: "Design and implement the database structure",
            priority: "Medium",
            status: "In-Progress",
            dueDate: "2025-02-15T17:00:00Z",
            createdAt: "2025-01-26T09:30:00Z"
          },
          {
            id: 103,
            title: "Write Unit Tests",
            description: "Create comprehensive unit tests for authentication",
            priority: "Low",
            status: "Completed",
            dueDate: "2025-02-10T12:00:00Z",
            createdAt: "2025-01-24T11:15:00Z"
          }
        ];

        setTasks(fallbackTasks);
        localStorage.setItem('tasks', JSON.stringify(fallbackTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Group tasks by status
  const tasksByStatus = {
    'To-Do': tasks.filter(task => task.status === 'To-Do'),
    'In-Progress': tasks.filter(task => task.status === 'In-Progress'),
    'Completed': tasks.filter(task => task.status === 'Completed')
  };

  if (isLoading) {
    return (
      <div style={{...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>
            Loading Task Manager...
          </h2>
          <p style={{color: '#6b7280'}}>Please wait while we load your tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h1 style={styles.title}>📋 Task Manager</h1>
          <button style={styles.button}>
            + Add Task
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.board}>
          <SimpleTaskColumn title="To-Do" tasks={tasksByStatus['To-Do']} />
          <SimpleTaskColumn title="In Progress" tasks={tasksByStatus['In-Progress']} />
          <SimpleTaskColumn title="Completed" tasks={tasksByStatus['Completed']} />
        </div>
      </main>
    </div>
  );
}

export default App;