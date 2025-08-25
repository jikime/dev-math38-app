"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { SubjectTop } from "@/types/subject"

interface SubjectTreeProps {
  data: SubjectTop[]
  selectedKeys: string[]
  onSelectionChange: (keys: string[]) => void
  className?: string
}

interface SubjectTreeNodeProps {
  node: SubjectTop
  selectedKeys: string[]
  onSelectionChange: (keys: string[]) => void
  level: number
}

function SubjectTreeNode({ node, selectedKeys, onSelectionChange, level }: SubjectTreeNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedKeys.includes(node.key.toString())

  const handleToggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  // 모든 하위 노드의 키를 재귀적으로 수집하는 함수
  const getAllChildKeys = (node: SubjectTop): string[] => {
    const keys = [node.key.toString()]
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        keys.push(...getAllChildKeys(child))
      }
    }
    return keys
  }

  const handleCheckboxChange = (checked: boolean) => {
    const keyString = node.key.toString()
    
    if (checked) {
      // 체크 시: 현재 노드와 모든 하위 노드를 선택
      const allKeys = getAllChildKeys(node)
      const newSelectedKeys = [...new Set([...selectedKeys, ...allKeys])]
      onSelectionChange(newSelectedKeys)
    } else {
      // 체크 해제 시: 현재 노드와 모든 하위 노드를 선택 해제
      const allKeys = getAllChildKeys(node)
      const newSelectedKeys = selectedKeys.filter(key => !allKeys.includes(key))
      onSelectionChange(newSelectedKeys)
    }
  }

  // 들여쓰기 계산
  const indentLevel = level * 20

  return (
    <div className="select-none">
      <div 
        className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded-md cursor-pointer"
        style={{ paddingLeft: `${indentLevel + 8}px` }}
      >
        {/* 확장/축소 버튼 */}
        <div className="flex items-center justify-center w-4 h-4">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpand}
              className="p-0 h-4 w-4 hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>

        {/* 체크박스 */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          className="h-4 w-4"
        />

        {/* 제목 */}
        <span 
          className={cn(
            "text-sm flex-1",
            level === 0 && "font-semibold text-gray-900",
            level === 1 && "font-medium text-gray-800",
            level >= 2 && "text-gray-700"
          )}
          onClick={handleToggleExpand}
        >
          {node.title}
        </span>
      </div>

      {/* 자식 노드들 */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children!.map((child) => (
            <SubjectTreeNode
              key={child.key}
              node={child}
              selectedKeys={selectedKeys}
              onSelectionChange={onSelectionChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function SubjectTree({ data, selectedKeys, onSelectionChange, className }: SubjectTreeProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("p-4 text-center text-gray-500 text-sm", className)}>
        선택된 과목의 상세 항목이 없습니다.
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", className)}>
      {data.map((node) => (
        <SubjectTreeNode
          key={node.key}
          node={node}
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          level={0}
        />
      ))}
    </div>
  )
}