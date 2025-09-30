import { NextResponse } from "next/server"

export async function GET() {
  const now = new Date()
  const data = [
    {
      id: "n-1",
      type: "assignment",
      title: "You were assigned: Implement Task Board drag & drop",
      time: "2m ago",
    },
    {
      id: "n-2",
      type: "deadline",
      title: "Deadline today: Website Redesign - Sprint 3",
      time: "1h ago",
    },
    {
      id: "n-3",
      type: "chat",
      title: "Alice mentioned you in #design-review",
      time: "3h ago",
    },
  ]
  return NextResponse.json(data)
}
