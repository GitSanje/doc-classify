"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Sample data for the chart
const data = [
  {
    name: "Jul 1",
    approved: 12,
    pending: 5,
    rejected: 1,
  },
  {
    name: "Jul 5",
    approved: 18,
    pending: 7,
    rejected: 2,
  },
  {
    name: "Jul 10",
    approved: 15,
    pending: 4,
    rejected: 0,
  },
  {
    name: "Jul 15",
    approved: 22,
    pending: 8,
    rejected: 1,
  },
  {
    name: "Jul 20",
    approved: 25,
    pending: 6,
    rejected: 0,
  },
  {
    name: "Jul 25",
    approved: 20,
    pending: 5,
    rejected: 1,
  },
  {
    name: "Jul 30",
    approved: 28,
    pending: 4,
    rejected: 0,
  },
]

export function AuditChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="approved" fill="#4ade80" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Bar dataKey="pending" fill="#94a3b8" radius={[4, 4, 0, 0]} className="fill-muted-foreground" />
        <Bar dataKey="rejected" fill="#f87171" radius={[4, 4, 0, 0]} className="fill-destructive" />
      </BarChart>
    </ResponsiveContainer>
  )
}

