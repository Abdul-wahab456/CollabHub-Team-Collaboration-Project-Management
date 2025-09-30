"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();

  const onLogout = async () => {
    const accessToken = localStorage.getItem("access_token");

    // Clear local storage first
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userId");

    // Revoke Google token
    if (accessToken) {
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          }
        );
      } catch (error) {
        console.log("Error revoking Google token:", error);
      }
    }

    // 🔥 ADD THIS: Redirect to Google logout to clear their session
    window.location.href = "https://accounts.google.com/Logout";

    // Then redirect to your login page
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 1000);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar className="size-6">
            <AvatarFallback className="text-xs">P</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 dark:bg-popover dark:text-popover-foreground dark:border-border"
      >
        <DropdownMenuLabel className="dark:text-popover-foreground ">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-border" />
        <DropdownMenuItem
          className="dark:focus:bg-accent dark:focus:text-accent-foreground dark:text-popover-foreground "
          onClick={() => console.log("[v0] Profile clicked")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="dark:focus:bg-accent dark:focus:text-accent-foreground dark:text-popover-foreground"
          onClick={onLogout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
