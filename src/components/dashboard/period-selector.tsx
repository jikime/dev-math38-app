"use client"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface PeriodSelectorProps {
  selectedYear: number
  selectedMonth: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
}

export function PeriodSelector({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: PeriodSelectorProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="년도 선택" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {months.map((month, index) => (
          <Button
            key={index}
            variant={selectedMonth === index + 1 ? "default" : "outline"}
            onClick={() => onMonthChange(index + 1)}
            className={cn(
              "px-4 py-2 text-sm",
              selectedMonth === index + 1 && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  )
}