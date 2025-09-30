"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  type: "assignment" | "deadline" | "chat";
  title: string;
  time: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
};

export default function NotificationBell() {
  const { data } = useSWR<Notification[]>("/api/notifications", fetcher, {
    refreshInterval: 15000,
  });

  const count = data?.length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open notifications">
          <div className="relative">
            <Bell className="size-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none text-primary-foreground">
                {count}
              </span>
            ) : null}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto p-2">
          {data?.length ? (
            <ul className="space-y-2">
              {data.map((n) => (
                <li key={n.id} className="rounded-md border p-2 text-sm">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.time}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              {"You’re all caught up!"}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
