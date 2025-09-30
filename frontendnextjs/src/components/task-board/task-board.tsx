"use client";

import { useCallback, useState, useEffect } from "react";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { type BoardColumn, TaskColumn } from "./task-column";
import { type Task, TaskCardPreview } from "./task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "./task-dialog";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusToColumnId: Record<string, string> = {
  ToDo: "ToDo",
  InProgress: "InProgress",
  Completed: "Completed",
};

export function TaskBoard() {
  const { id } = useParams<{ id: string }>();

  const [columns, setColumns] = useState<BoardColumn[]>([
    {
      id: "ToDo",
      title: "ToDo",
      description: "Incoming requests and ideas.",
      tasks: [],
    },
    {
      id: "InProgress",
      title: "InProgress",
      description: "Currently owned by the team.",
      tasks: [],
    },
    {
      id: "Completed",
      title: "Completed",
      description: "Recently completed work.",
      tasks: [],
    },
  ]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  useEffect(() => {
    async function fetchUserProjects() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/projects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        setProjects(data);

        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProjects();
  }, [id]);

  // Fetch tasks when selectedProjectId changes
  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) return;
    console.log(selectedProjectId);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/project/${selectedProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const tasks = await response.json();
      console.log(tasks);
      const newColumns = columns.map((col) => ({
        ...col,
        tasks: tasks
          .filter((task: any) => statusToColumnId[task.status] === col.id)
          .map((task: any) => ({
            id: task.id.toString(),
            title: task.title,
            description: task.description || "",
            assignee: task.assignee?.name || "Unassigned",
            due: task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "No due date",
            priority: task.priority || "low",
          })),
      }));

      setColumns(newColumns);
      console.log(newColumns);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const findTaskById = useCallback(
    (taskId: string) => {
      for (const column of columns) {
        const task = column.tasks.find((item) => item.id === taskId);
        if (task) {
          return task;
        }
      }
      return null;
    },
    [columns]
  );

  const handleDragStart = useCallback(
    // only when renender when the columns update or recreate
    (event: DragStartEvent) => {
      const { active } = event;
      const task = findTaskById(String(active.id));
      if (task) {
        setActiveTask(task);
      }
    },
    [findTaskById]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return; // if not dropped anything

      const activeId = String(active.id);
      const overId = String(over.id);

      if (activeId === overId) return; // if dropped in same position

      let targetColumnId = overId; // targetColumnID where it putting
      const targetColumn = columns.find((col) => col.id === overId); //finding column id

      if (!targetColumn) {
        const foundColumn = columns.find((col) =>
          col.tasks.some((task) => task.id === overId)
        );
        if (foundColumn) {
          targetColumnId = foundColumn.id;
        }
      }
      setColumns((prevColumns) => {
        // Where the task comes from which column
        const sourceColumnIndex = prevColumns.findIndex((column) =>
          column.tasks.some((task) => task.id === activeId)
        );

        if (sourceColumnIndex === -1) return prevColumns; // You try to drag that task which is not exists

        let targetColumnIndex = prevColumns.findIndex(
          // check where the task goes which column
          (column) => column.id === targetColumnId
        );

        if (targetColumnIndex === -1) return prevColumns; // if target column not esists then move previous column
        // create a copy of all column to avoid the mutating state ( means don't directly changes in orgional state instead making new state)
        const nextColumns = prevColumns.map((column) => ({
          // if find the previous column map on next new column
          ...column,
          tasks: [...column.tasks],
        }));

        const sourceColumn = nextColumns[sourceColumnIndex]; // where tasks comes from column index
        const targetColumn = nextColumns[targetColumnIndex]; // where tasks goes the column index

        const sourceTaskIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === activeId
        );
        if (sourceTaskIndex === -1) return prevColumns; // find and remove the source index

        const [movedTask] = sourceColumn.tasks.splice(sourceTaskIndex, 1); // remove task

        const isOverTask = targetColumn.tasks.some(
          (task) => task.id === overId // Was it drop on another task
        );
        let targetTaskIndex: number;

        if (isOverTask) {
          targetTaskIndex = targetColumn.tasks.findIndex(
            (task) => task.id === overId
          );
          if (
            sourceColumnIndex === targetColumnIndex &&
            targetTaskIndex > sourceTaskIndex
          ) {
            targetTaskIndex -= 1;
          }
        } else {
          targetTaskIndex = targetColumn.tasks.length; // get the length of column
        }

        targetColumn.tasks.splice(targetTaskIndex, 0, movedTask);
        return nextColumns;
      });

      const token = localStorage.getItem("access_token");

      // Update task status in backend
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/update/${activeId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: targetColumnId, // "ToDo", "InProgress", or "Completed"
          }),
        }
      );

      console.log("Task status updated successfully");
    },
    [columns, fetchTasks]
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete task");

      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSaveTask = async () => {
    await fetchTasks();
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        No projects assigned to you.
      </div>
    );
  }

  if (!selectedProjectId) {
    return (
      <div className="flex items-center justify-center p-8">
        Please select a project.
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Task Board</h1>
          <Select
            value={selectedProjectId.toString()}
            onValueChange={(value) => setSelectedProjectId(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
        <DragOverlay
          dropAnimation={{
            duration: 180,
            easing: "cubic-bezier(0.2, 0, 0.2, 1)",
          }}
        >
          {activeTask ? <TaskCardPreview task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projectId={selectedProjectId}
        onSave={handleSaveTask}
      />
    </>
  );
}
