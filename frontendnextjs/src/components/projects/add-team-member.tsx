"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";

export function AddTeamMember({
  children,
  projectId,
  onMemberAdded,
}: {
  children: React.ReactNode;
  projectId: string;
  onMemberAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>(); // ✅ Move hook here

  // ✅ Add useEffect to fetch users
  useEffect(() => {
    if (open && id) {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}/projects/members`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [open, id]); // Fetch when dialog opens

  const handleAddTeamMember = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}/projects/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          projectId: parseInt(projectId),
          email: email,
        }),
      });
      if (!res.ok) throw new Error("Failed to add team member");

      setOpen(false);
      setEmail("");
      onMemberAdded();
    } catch (err) {
      console.error("Error adding team member:", err);
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
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to add to this project.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div> */}
        <Select
  value={email}
  onValueChange={(value) => setEmail(value)}
>
  <SelectTrigger className="col-span-3">
    <SelectValue placeholder="Select email" />
  </SelectTrigger>
<SelectContent>
  {/* <SelectItem value="unassigned">Unassigned</SelectItem> */}
  {users.map((user) => (
    <SelectItem key={user.id} value={user.email}>  {/* If user has id */}
      {user.name} - {user.email}
    </SelectItem>
  ))}
</SelectContent>
</Select>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddTeamMember}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
