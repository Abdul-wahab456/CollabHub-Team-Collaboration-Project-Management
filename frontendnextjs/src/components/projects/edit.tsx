"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";


interface Project {
  id: string;
  name: string;
  owner: string;
  progress: string;
  description?: string;
}

export function Edit({
  children,
  project,
  onProjectUpdated,
}: {
  children: React.ReactNode;
  project: Project;
  onProjectUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    setProjectName(project.name);
    setProjectDescription(project.description || "");
  }, [project]);

  const handleEditProject = async () => {
    if (!projectName.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}/projects/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          id: parseInt(project.id),
          data: {
            name: projectName,
            description: projectDescription || undefined,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to update project");
      
      setOpen(false);
      onProjectUpdated(); // Refresh projects list
    } catch (err) {
      console.error("Error updating project:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Project Name
            </Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
  type="submit" 
  onClick={handleEditProject}
  disabled={isLoading}
>
  {isLoading ? "Saving..." : "Save Changes"}
</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
