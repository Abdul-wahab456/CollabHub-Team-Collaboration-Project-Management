"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, Trash2Icon, UserPlusIcon } from "lucide-react";
import { Create } from "../../../../components/projects/create";
import { Edit } from "../../../../components/projects/edit";
import { Delete } from "../../../../components/projects/delete";
import { AddTeamMember } from "../../../../components/projects/add-team-member";

interface Project {
  id: number;
  name: string;
  description?: string;
  creator: { name: string };
  members: Array<{ id: number; name: string; email: string }>;
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setReady(true);
      fetchProjects();
    }
  }, [router]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load projects");
      const json = await res.json();
      setProjects(json);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  if (!ready) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-balance text-2xl font-semibold">Projects</h1>
        <Create onProjectCreated={fetchProjects}>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Create>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <div className="flex items-center gap-2">
                <AddTeamMember 
                  projectId={p.id.toString()} 
                  onMemberAdded={fetchProjects}
                >
                  <Button variant="ghost" size="icon">
                    <UserPlusIcon className="h-4 w-4" />
                    <span className="sr-only">Add team member</span>
                  </Button>
                </AddTeamMember>
                <Edit 
                  project={{
                    id: p.id.toString(),
                    name: p.name,
                    description: p.description || "",
                    owner: p.creator.name,
                    progress: "Active", // You can add status field to your schema later
                  }}
                  onProjectUpdated={fetchProjects}
                >
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit project</span>
                  </Button>
                </Edit>
                <Delete 
                  projectId={p.id.toString()}
                  onProjectDeleted={fetchProjects}
                >
                  <Button variant="ghost" size="icon">
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete project</span>
                  </Button>
                </Delete>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div>Owner: {p.creator.name}</div>
              <div>Members: {p.members.length}</div>
              {p.description && <div className="mt-2">{p.description}</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}