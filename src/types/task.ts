export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To-Do' | 'In-Progress' | 'Completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
}

export interface TaskFilters {
  priority?: Priority;
  status?: Status;
  dueDate?: string;
}

export type SortOption = 'oldest' | 'newest' | 'dueDate';