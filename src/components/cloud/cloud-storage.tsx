"use client"

import { useState, useEffect } from "react"
import type { SelectOption } from "@/components/ui/flexible-select"
import { useSubjects } from "@/hooks/use-subjects"
import { useBookGroups, useBookGroupDetail, useResourceProblems, useBookGroupStats, useSkillChapters } from "@/hooks/use-cloud"
import { FolderStructure } from "./folder-structure/folder-structure"
import { FileListHeader } from "./file-list/file-list-header"
import { FileList } from "./file-list/file-list"
import { PdfUploadModal } from "./modals/pdf-upload-modal"
import { HwpUploadModal } from "./modals/hwp-upload-modal"
import { CreateFileModal } from "./modals/create-file-modal"
import { StatsModal } from "./stats/stats-modal"

export function CloudStorage() {
  const [selectedFolder, setSelectedFolder] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("") 
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  
  // 모달 상태들
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [isPdfUploadOpen, setIsPdfUploadOpen] = useState(false)
  const [isHwpUploadOpen, setIsHwpUploadOpen] = useState(false)
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false)
  const [isStatsOpen, setIsStatsOpen] = useState(false)

  // API 훅을 통해 과목 데이터 조회
  const { data: subjects, isLoading: subjectsLoading } = useSubjects()

  // 과목 데이터를 FlexibleSelect 옵션으로 변환
  const subjectOptions: SelectOption[] = subjects?.map(subject => ({
    label: subject.title,
    value: subject.key.toString()
  })) || []

  // 첫 번째 과목을 기본 선택
  useEffect(() => {
    if (subjects && subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0].key.toString())
    }
  }, [subjects, selectedSubject])

  // 선택된 과목의 폴더 목록 조회
  const { data: bookGroups, isLoading: bookGroupsLoading } = useBookGroups(selectedSubject || "")

  // 과목 선택 변경 처리
  const handleSubjectChange = (value: string | string[]) => {
    const newSubject = Array.isArray(value) ? value[0] : value
    setSelectedSubject(newSubject)
    // 과목 변경시 폴더 선택 초기화
    setSelectedFolder("")
    setExpandedFolders(new Set())
  }

  // 선택된 폴더의 상세 정보와 리소스 문제 목록 조회
  const selectedBookGroupId = selectedFolder ? selectedFolder.toString() : ""
  const { data: bookGroupDetail, isLoading: bookGroupDetailLoading } = useBookGroupDetail(selectedBookGroupId)
  const { data: resourceProblems, isLoading: resourceProblemsLoading } = useResourceProblems(selectedBookGroupId)
  
  // 통계 데이터 조회
  const { data: bookGroupStats, isLoading: bookGroupStatsLoading } = useBookGroupStats(
    isStatsOpen ? selectedBookGroupId : ""
  )
  const { data: skillChapters, isLoading: skillChaptersLoading } = useSkillChapters(
    isStatsOpen && bookGroupStats?.subjectId ? bookGroupStats.subjectId.toString() : ""
  )

  // 첫 번째 폴더를 기본 선택하고 루트 폴더들을 자동 확장
  useEffect(() => {
    if (bookGroups && bookGroups.length > 0 && !selectedFolder) {
      // 첫 번째 폴더 선택
      setSelectedFolder(bookGroups[0].key)
      
      // 루트 레벨 폴더들을 자동으로 확장
      const rootFolderKeys = bookGroups.map(folder => folder.key)
      setExpandedFolders(new Set(rootFolderKeys))
    }
  }, [bookGroups, selectedFolder])

  // 폴더 확장/축소 처리 함수
  const handleToggleExpand = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  // 폴더 선택 처리 함수
  const handleSelectFolder = (folderId: string) => {
    setSelectedFolder(folderId)
  }

  // 리소스 문제 목록 (현재는 필터링 없음)
  const filteredProblems = resourceProblems || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">수작 클라우드</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">시험지 파일을 안전하게 저장하고 관리하세요</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-300px)]">
        {/* Left Sidebar - Folder Structure */}
        <div className="col-span-3">
          <FolderStructure
            subjectOptions={subjectOptions}
            selectedSubject={selectedSubject}
            subjectsLoading={subjectsLoading}
            bookGroups={bookGroups || null}
            bookGroupsLoading={bookGroupsLoading}
            expandedFolders={expandedFolders}
            selectedFolder={selectedFolder}
            isCreateFolderOpen={isCreateFolderOpen}
            onSubjectChange={handleSubjectChange}
            onToggleExpand={handleToggleExpand}
            onSelectFolder={handleSelectFolder}
            onCreateFolderOpenChange={setIsCreateFolderOpen}
          />
        </div>

        {/* Right - File List */}
        <div className="col-span-9">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6  h-full flex flex-col">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <FileListHeader
                title={bookGroupDetail?.title || ""}
                isLoading={bookGroupDetailLoading}
                selectedFolder={selectedFolder}
                onOpenStats={() => setIsStatsOpen(true)}
                onOpenHwpModal={() => setIsHwpUploadOpen(true)}
                onOpenPdfModal={() => setIsPdfUploadOpen(true)}
                onOpenCreateFileModal={() => setIsCreateFileOpen(true)}
              />
            </div>
            <div className="px-6 pt-0 flex-1">
              <FileList
                problems={filteredProblems}
                isLoading={resourceProblemsLoading}
                selectedFolder={selectedFolder}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      <PdfUploadModal 
        isOpen={isPdfUploadOpen} 
        onOpenChange={setIsPdfUploadOpen} 
      />

      <HwpUploadModal 
        isOpen={isHwpUploadOpen} 
        onOpenChange={setIsHwpUploadOpen} 
      />

      <CreateFileModal 
        isOpen={isCreateFileOpen} 
        onOpenChange={setIsCreateFileOpen}
        bookGroupTitle={bookGroupDetail?.title}
        selectedFolder={selectedFolder}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onOpenChange={setIsStatsOpen}
        bookGroupStats={bookGroupStats || null}
        skillChapters={skillChapters || null}
        bookGroupStatsLoading={bookGroupStatsLoading}
        skillChaptersLoading={skillChaptersLoading}
      />
    </div>
  )
}