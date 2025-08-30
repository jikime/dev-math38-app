"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  label: string;
  value: string;
}

interface FlexibleSelectProps {
  options: SelectOption[];
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  maxCount?: number;
  variant?: "default" | "secondary";
  animation?: number;
}

export function FlexibleSelect({
  options,
  value,
  onValueChange,
  placeholder = "선택하세요",
  disabled = false,
  className,
  multiple = false,
  maxCount = 3,
  variant = "default",
  animation = 0,
}: FlexibleSelectProps) {
  const [open, setOpen] = useState(false)

  // 단일 선택 모드
  if (!multiple) {
    const selectedOption = options.find(option => option.value === value)
    
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-full justify-between", className)}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px]" align="start">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                onValueChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // 다중 선택 모드 (기존 MultiSelect 기능)
  const selectedValues = Array.isArray(value) ? value : []
  const selectedOptions = options.filter(option => selectedValues.includes(option.value))

  const handleSelect = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(val => val !== optionValue)
      : [...selectedValues, optionValue]
    
    onValueChange(newValues)
  }

  const handleRemove = (optionValue: string) => {
    const newValues = selectedValues.filter(val => val !== optionValue)
    onValueChange(newValues)
  }

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between min-h-10 h-auto py-2"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {selectedOptions.slice(0, maxCount).map((option) => (
                    <Badge
                      key={option.value}
                      variant={variant}
                      className="text-xs px-2 py-0.5"
                    >
                      {option.label}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRemove(option.value)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(option.value)
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ))}
                  {selectedOptions.length > maxCount && (
                    <Badge variant={variant} className="text-xs px-2 py-0.5">
                      +{selectedOptions.length - maxCount}
                    </Badge>
                  )}
                </>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px]" align="start">
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleSelect(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}