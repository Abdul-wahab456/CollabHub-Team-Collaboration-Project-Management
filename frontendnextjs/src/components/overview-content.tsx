"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusChart from "@/components/status-chart";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type OverviewData = {
  kpis: {
    InProgress: number;
    Completed: number;
    ToDo: number;
    TeamMembers: number;
    ProjectManager: number;
  };
};

export default function Overview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/overview`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setData(json);
      } catch (err) {
      }
    };
    fetchData();
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Project Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.kpis.ProjectManager}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.kpis.TeamMembers}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.kpis.Completed}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task Progress by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart data={data.kpis} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
