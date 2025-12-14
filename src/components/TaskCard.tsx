import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Task, Priority } from '../types/task';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isDuplicate?: boolean;
}

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

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isDuplicate }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

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