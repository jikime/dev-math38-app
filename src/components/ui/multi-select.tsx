"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "선택하세요...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleSelect = (currentValue: string) => {
    // 현재 값이 이미 선택되어 있으면 제거하고, 아니면 추가
    if (selected.includes(currentValue)) {
      onChange(selected.filter((item) => item !== currentValue))
    } else {
      onChange([...selected, currentValue])
    }
    // 드롭다운은 닫지 않음 (다중 선택을 위해)
  }

  // 검색어에 따라 필터링된 옵션들
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 선택된 항목들의 라벨을 표시하는 컴포넌트
  const SelectedBadges = () => (
    <div className="flex gap-1 flex-wrap">
      {selected.length > 0 ? (
        <>
          {selected.slice(0, 3).map((item) => {
            const option = options.find((option) => option.value === item)
            return (
              <Badge
                variant="secondary"
                key={item}
                className="mr-1 mb-1"
              >
                {option?.label}
                <span
                  className="ml-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(item)
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </span>
              </Badge>
            )
          })}
          {selected.length > 3 && (
            <Badge variant="secondary" className="mr-1 mb-1">
              +{selected.length - 3}개 더
            </Badge>
          )}
        </>
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
  )

  // 커스텀 SelectItem 컴포넌트 - 기본 동작을 오버라이드
  const CustomSelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => {
    const isSelected = selected.includes(value)
    
    return (
      <div 
        className={cn(
          "flex items-center px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent",
          isSelected ? "bg-accent/50" : ""
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleSelect(value)
        }}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
        {children}
      </div>
    )
  }

  return (
    <Select
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          // 닫힐 때 검색어 초기화
          setSearchQuery("")
        }
      }}
      value={selected.length > 0 ? selected[0] : ""}
      onValueChange={() => {}} // 실제 선택은 CustomSelectItem에서 처리
      disabled={disabled}
    >
      <SelectTrigger 
        className={cn(
          "w-full min-h-10 h-auto",
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          <SelectedBadges />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-2">
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="과목 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <SelectGroup>
          {filteredOptions.length > 0 ? (
            <div className="grid grid-cols-2 gap-1">
              {filteredOptions.map((option) => (
                <div key={option.value}>
                  <CustomSelectItem value={option.value}>
                    {option.label}
                  </CustomSelectItem>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              과목을 찾을 수 없습니다.
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}