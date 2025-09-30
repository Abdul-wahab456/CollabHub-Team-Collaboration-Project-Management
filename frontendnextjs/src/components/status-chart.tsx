"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type StatusStats = {
  InProgress: number;
  Completed: number;
  ToDo: number;
};

export default function StatusChart({ data }: { data: StatusStats }) {
  const chartData = [
    { status: "In Progress", count: data.InProgress },
    { status: "Completed", count: data.Completed },
    { status: "todo", count: data.ToDo },
  ];

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <XAxis
            dataKey="status"
            tick={{ fill: "var(--foreground, white)" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--foreground, white)" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip />
          <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
          <Bar
            dataKey="count"
            name="Tasks"
            fill="#5ce4a4"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
