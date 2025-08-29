"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number | string
  maxValue?: number
  subtitle?: string
  className?: string
  valueClassName?: string
}

export function StatsCard({
  title,
  value,
  maxValue,
  subtitle,
  className,
  valueClassName,
}: StatsCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          {maxValue && (
            <span className="text-xs text-muted-foreground">
              MAX {maxValue}명
            </span>
          )}
        </div>
        <div className={cn("text-3xl font-bold", valueClassName)}>
          {typeof value === 'number' ? value.toLocaleString() : value}
          {typeof value === 'number' && <span className="text-lg font-normal ml-1">{subtitle}</span>}
        </div>
      </div>
    </Card>
  )
}