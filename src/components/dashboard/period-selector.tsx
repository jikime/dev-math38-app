"use client"

import { cn } from "@/lib/utils"

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
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="px-3 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-800"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => onMonthChange(index + 1)}
            className={cn(
              "px-4 py-2 text-sm rounded-md transition-colors",
              selectedMonth === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  )
}