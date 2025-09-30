"use client";

import { forwardRef, type CSSProperties } from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners";
import { Trash2 } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  due: string;
  priority: "high" | "medium" | "low";
};

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high: "border-destructive/40 bg-destructive/10 text-destructive",
  medium: "border-primary/30 bg-primary/10 text-primary",
  low: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

interface TaskCardContentProps {    // interface is defin ethe shape structure of an object
  task: Task;
  isDragging?: boolean;
  style?: CSSProperties;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  onDelete?: (taskId: string) => void;
  showActions?: boolean;
}

// frowardRef is to Receieve from parent component and send to child component.
const TaskCardContent = forwardRef<HTMLDivElement, TaskCardContentProps>(
  function TaskCardContent(
    { task, isDragging, style, attributes, listeners, onDelete, showActions = true },
    ref
  ) {

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(task.id);
    };

    return (
      <article
        ref={ref}
        style={style}
        className={cn(
          "rounded-lg border bg-card p-3 text-sm shadow-sm ring-offset-background transition-all",
          isDragging ? "ring-2 ring-primary shadow-lg" : "hover:border-primary/40"
        )}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-tight text-foreground">{task.title}</h3>
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              PRIORITY_STYLES[task.priority]
            )}
          >
            {PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{task.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{task.assignee}</span>
          <span>{task.due}</span>
        </div>

        {showActions && (
          <div className="mt-3 flex gap-2 border-t pt-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 flex-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        )}
      </article>
    );
  }
);

TaskCardContent.displayName = "TaskCardContent";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "manipulation",
  };

  return (
    <TaskCardContent
      ref={setNodeRef}
      task={task}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
      onDelete={onDelete}
    />
  );
}

export function TaskCardPreview({ task }: { task: Task }) {
  return (
    <TaskCardContent
      task={task}
      isDragging
      style={{ width: "18rem", maxWidth: "100%" }}
      showActions={false}
    />
  );
}