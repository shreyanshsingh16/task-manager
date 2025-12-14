import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskCard } from './TaskCard';
import { Task, Status } from '../types/task';
import { cn } from '../lib/utils';

interface TaskColumnProps {
  title: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  duplicateTasks: Set<number>;
}

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

export const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  onEditTask,
  onDeleteTask,
  duplicateTasks,
}) => {
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
      
      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "min-h-[200px] transition-colors",
              snapshot.isDraggingOver && "bg-white/50"
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "transition-transform",
                      snapshot.isDragging && "rotate-2 shadow-lg"
                    )}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      isDuplicate={duplicateTasks.has(task.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};