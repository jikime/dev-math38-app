"use client"

import { Button } from "@/components/ui/button"
import type { CloudBookGroup } from "@/types/cloud"
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
} from "lucide-react"

// 재귀적 트리 노드 컴포넌트
export interface FolderTreeNodeProps {
  folder: CloudBookGroup;
  level: number;
  expandedFolders: Set<string>;
  selectedFolder: string;
  onToggleExpand: (folderId: string) => void;
  onSelectFolder: (folderId: string) => void;
}

export function FolderTreeNode({ 
  folder, 
  level, 
  expandedFolders, 
  selectedFolder, 
  onToggleExpand, 
  onSelectFolder 
}: FolderTreeNodeProps) {
  const hasChildren = folder.children && folder.children.length > 0
  const isExpanded = expandedFolders.has(folder.key)
  const isSelected = selectedFolder === folder.key
  const indentLevel = level * 16

  return (
    <div>
      <Button
        variant="ghost"
        className={`w-full justify-start p-2 h-auto ${
          isSelected
            ? "bg-primary/10 text-primary"
            : "hover:bg-muted"
        }`}
        style={{ paddingLeft: `${indentLevel + 8}px` }}
        onClick={() => onSelectFolder(folder.key)}
      >
        <div className="flex items-center gap-2 w-full">
          {/* 확장/축소 아이콘 */}
          <div className="flex items-center justify-start w-4 h-4">
            {hasChildren ? (
              <div 
                className="p-0 h-4 w-4 hover:bg-muted flex items-center justify-start cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand(folder.key)
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </div>
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>

          {/* 폴더 아이콘 */}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-1" />
            ) : (
              <Folder className="w-4 h-4 mr-1" />
            )
          ) : (
            <Folder className="w-4 h-4 mr-1" />
          )}

          {/* 폴더명 */}
          <span className="text-sm flex-1 text-left">{folder.title}</span>
        </div>
      </Button>

      {/* 하위 폴더들 */}
      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map((childFolder) => (
            <FolderTreeNode
              key={childFolder.key}
              folder={childFolder}
              level={level + 1}
              expandedFolders={expandedFolders}
              selectedFolder={selectedFolder}
              onToggleExpand={onToggleExpand}
              onSelectFolder={onSelectFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}
