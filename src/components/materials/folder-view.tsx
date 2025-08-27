"use client"

import React, { useState, useEffect } from "react"
import { ProvidedFolder, ProvidedFolderGroup, useFoldersByGrade } from "@/hooks/use-folders"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, FolderOpen, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FolderViewProps {
  grade: number | undefined
  onFolderClick: (folderId: string) => void
  selectedFolderId?: string
}

export function FolderView({ grade, onFolderClick, selectedFolderId }: FolderViewProps) {
  const [view, setView] = useState<'groups' | 'folders'>('groups')
  const [selectedGroup, setSelectedGroup] = useState<ProvidedFolderGroup | null>(null)

  const { data: folderGroups, isLoading, error } = useFoldersByGrade(grade)

  // grade가 변경되면 그룹 뷰로 초기화
  useEffect(() => {
    setView('groups')
    setSelectedGroup(null)
  }, [grade])

  // 그룹 선택 처리
  const handleGroupClick = (group: ProvidedFolderGroup) => {
    setSelectedGroup(group)
    setView('folders')
  }

  // 뒤로 가기 처리
  const handleBackToGroups = () => {
    setView('groups')
    setSelectedGroup(null)
  }

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-sm text-gray-500">폴더 로딩 중...</div>
      </div>
    )
  }

  // 에러 UI
  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 text-center">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    )
  }

  // 데이터 없음 UI
  if (!folderGroups || folderGroups.length === 0) {
    return (
      <div className="text-gray-500 text-sm p-4 text-center">
        제공하는 폴더가 없습니다.
      </div>
    )
  }

  return (
    <div className="w-full">
      {view === 'groups' ? (
        // 그룹 목록 뷰
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">폴더 그룹</h4>
          <div className="h-48 overflow-y-auto space-y-2">
            {folderGroups.map((group) => (
            <div
              key={group.groupId}
              onClick={() => handleGroupClick(group)}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer border border-gray-200 bg-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium">{group.groupName}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {group.folderCount}개 폴더
              </Badge>
            </div>
            ))}
          </div>
        </div>
      ) : (
        // 폴더 목록 뷰
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToGroups}
              className="p-1 h-auto"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h4 className="text-sm font-medium text-gray-700">
              {selectedGroup?.groupName}
            </h4>
          </div>
          
          {selectedGroup && selectedGroup.folders.length > 0 ? (
            <div className="h-72 overflow-y-auto">
              <div className="space-y-2">
                {selectedGroup.folders.map((folder) => (
                <div
                  key={folder.folderId}
                  className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer border transition-colors ${
                    selectedFolderId === folder.folderId
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => onFolderClick(folder.folderId)}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className={`w-4 h-4 ${
                      selectedFolderId === folder.folderId ? "text-blue-600" : "text-yellow-600"
                    }`} />
                    <span className={`text-sm ${
                      selectedFolderId === folder.folderId ? "font-medium text-blue-800" : ""
                    }`}>
                      {folder.folderName}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      selectedFolderId === folder.folderId ? "border-blue-300 text-blue-700" : ""
                    }`}
                  >
                    {folder.paperCount}개 문항
                  </Badge>
                </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm text-center py-8">
              하위 폴더가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}