"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { type Task, TaskCard } from "./task-card";

export type BoardColumn = {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
};

interface TaskColumnProps {
  column: BoardColumn;
  onDeleteTask?: (taskId: string) => void;
}

export function TaskColumn({ column, onDeleteTask }: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <section className="flex h-full min-h-[18rem] flex-col rounded-xl border bg-muted/20 shadow-sm backdrop-blur">
      <header className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground">{column.title}</h2>
          {column.description ? (
            <p className="text-xs text-muted-foreground">{column.description}</p>
          ) : null}
        </div>
        <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-full bg-background px-2 text-xs font-medium text-muted-foreground">
          {column.tasks.length}
        </span>
      </header>
      <SortableContext items={column.tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            "flex flex-1 flex-col gap-3 px-4 py-4 transition-colors",
            isOver ? "bg-primary/10" : "bg-background"
          )}
        >
          {column.tasks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-card/40 p-6 text-center text-xs text-muted-foreground">
              Drop a task here
            </div>
          ) : (
            column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}