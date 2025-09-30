"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  LayoutGrid,
  MessageSquare,
  FolderKanban,
  FileIcon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import NotificationBell from "@/components/notification-bell";
import UserMenu from "@/components/user-menu";
import ThemeToggle from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id: userId } = React.use(params); // unwrap params

  const navItems = [
    { href: `/dashboard/${userId}`, label: "Overview", icon: Home },
    {
      href: `/dashboard/${userId}/projects`,
      label: "Projects",
      icon: LayoutGrid,
    },
    {
      href: `/dashboard/${userId}/task-board`,
      label: "Task Board",
      icon: FolderKanban,
    },
    { href: `/dashboard/${userId}/chat`, label: "Chat", icon: MessageSquare },
    { href: `/dashboard/${userId}/files`, label: "Files", icon: FileIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar - fixed */}
      <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                onClick={() => setSidebarOpen((s) => !s)}
              >
                {sidebarOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
              <Link
                href="/dashboard"
                className="font-semibold text-sm md:text-base"
              >
                Team Dashboard
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - fixed on desktop, overlay on mobile */}
      <aside
        className={cn(
          "fixed z-40 top-14 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-label="Sidebar navigation"
      >
        <nav className="flex h-full flex-col py-4">
          <ul className="flex-1 px-2 gap-2 flex flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.label === "Overview"
                  ? pathname === item.href // exact match only
                  : pathname.startsWith(item.href); // allow nested for other items

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-foreground",
                      isActive && "bg-secondary text-white"
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="text-pretty">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-2"></div>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="pt-14 md:pl-64">
        <div className="mx-auto max-w-screen-2xl p-4">{children}</div>
      </main>
    </div>
  );
}
