"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ExamPapersChartProps {
  data: Array<{
    date: string
    count: number
  }>
}

export function ExamPapersChart({ data }: ExamPapersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">시험지 출제 수</CardTitle>
        <p className="text-sm text-muted-foreground">TOTAL</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              tickLine={{ stroke: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Bar
              dataKey="count"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">날짜: 2025-07-07</p>
          <p className="text-xs text-muted-foreground">일별 연역 사용 현황: 19건</p>
        </div>
      </CardContent>
    </Card>
  )
}