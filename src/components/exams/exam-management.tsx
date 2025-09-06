"use client"

import { useState, useEffect } from "react"
import { useSubjects } from "@/hooks/use-subjects"
import { useExamFolderGroups, useExamPapersByFolder, type ExamFolderGroup, type ExamPaperItem } from "@/hooks/use-exams"
import ExamPaperView from "./exam-paper-view"
import type { CloudBookGroup } from "@/types/cloud"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FlexibleSelect } from "@/components/ui/flexible-select"
import type { SelectOption } from "@/components/ui/flexible-select"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  MoreVertical,
  Plus,
  Printer,
  Download,
  Edit,
  Copy,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"


// FolderTreeNode 컴포넌트
interface FolderTreeNodeProps {
  folder: ExamFolderGroup;
  level: number;
  expandedFolders: Set<string>;
  selectedFolder: string;
  onToggleExpand: (folderId: string) => void;
  onSelectFolder: (folderId: string) => void;
}

function FolderTreeNode({ 
  folder, 
  level, 
  expandedFolders, 
  selectedFolder, 
  onToggleExpand, 
  onSelectFolder 
}: FolderTreeNodeProps) {
  const hasChildren = folder.children && folder.children.length > 0
  const isExpanded = expandedFolders.has(folder.value)
  const isSelected = selectedFolder === folder.value
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
        onClick={() => onSelectFolder(folder.value)}
      >
        <div className="flex items-center gap-2 w-full">
          {/* 확장/축소 아이콘 */}
          <div className="flex items-center justify-start w-4 h-4">
            {hasChildren ? (
              <div 
                className="p-0 h-4 w-4 hover:bg-muted flex items-center justify-start cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand(folder.value)
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
              key={childFolder.value}
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

export function ExamManagement() {
  const [selectedFolder, setSelectedFolder] = useState("")
  const [selectedPaper, setSelectedPaper] = useState<ExamPaperItem | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

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

  // 시험지 폴더 그룹 데이터 조회
  const { data: folderGroups, isLoading: foldersLoading } = useExamFolderGroups(selectedSubject)

  // 폴더별 시험지 목록 조회
  const { data: examPapers, isLoading: papersLoading } = useExamPapersByFolder(selectedFolder)

  // ExamFolderGroup를 CloudBookGroup 형태로 변환
  const mapExamFolderToCloudGroup = (examFolder: ExamFolderGroup): CloudBookGroup => ({
    bookGroupId: 0,
    academyId: 0,
    parentBookGroupId: null,
    subjectId: parseInt(selectedSubject || '0'),
    groupName: examFolder.title,
    indexNum: 0,
    canRemove: false,
    groupType: 0,
    subList: null,
    created: '',
    title: examFolder.title,
    value: examFolder.value,
    key: examFolder.value,
    children: examFolder.children ? examFolder.children.map(mapExamFolderToCloudGroup) : null,
  })

  const mappedFolders = folderGroups ? folderGroups.map(mapExamFolderToCloudGroup) : null

  // 첫 번째 폴더를 기본 선택하고 루트 폴더들을 자동 확장
  useEffect(() => {
    if (folderGroups && folderGroups.length > 0 && !selectedFolder) {
      // 첫 번째 폴더 선택
      setSelectedFolder(folderGroups[0].value)
      
      // 루트 레벨 폴더들을 자동으로 확장
      const rootFolderValues = folderGroups.map(folder => folder.value)
      setExpandedFolders(new Set(rootFolderValues))
    }
  }, [folderGroups, selectedFolder])

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

  // 과목 선택 변경 처리
  const handleSubjectChange = (value: string | string[]) => {
    const newSubject = Array.isArray(value) ? value[0] : value
    setSelectedSubject(newSubject)
  }

  // 시험지 클릭 시 선택하기
  const handlePaperClick = (paper: ExamPaperItem) => {
    setSelectedPaper(paper)
  }


  // 선택된 폴더의 시험지 목록 (API 데이터 사용)
  const filteredPapers = examPapers || []


  // 첫 번째 시험지를 기본 선택
  const defaultPaper = filteredPapers[0] || null
  const currentPaper = selectedPaper || defaultPaper


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Left Sidebar - Subject, Exam List, and Folders */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Subject Selection and Folder Structure */}
          <div className="bg-card text-card-foreground rounded-xl border py-4 h-auto">
            <div className="px-4">
              <FlexibleSelect
                options={subjectOptions}
                value={selectedSubject}
                onValueChange={handleSubjectChange}
                placeholder="과목을 선택하세요"
                disabled={subjectsLoading}
                className="w-full"
                multiple={false}
              />
              
              {subjectsLoading && (
                <div className="text-sm text-muted-foreground mt-2">과목 목록 로딩중...</div>
              )}
              
              {!subjectsLoading && (!subjectOptions || subjectOptions.length === 0) && (
                <div className="text-sm text-red-500 mt-2">과목 목록을 불러올 수 없습니다</div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            {/* Folder Structure */}
            <div className="px-4">
              <div className="h-[150px] overflow-y-auto">
                <div className="space-y-1">
                  {foldersLoading ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      폴더를 불러오는 중...
                    </div>
                  ) : mappedFolders && mappedFolders.length > 0 ? (
                    mappedFolders.map((folder) => (
                      <FolderTreeNode
                        key={folder.key}
                        folder={folder}
                        level={0}
                        expandedFolders={expandedFolders}
                        selectedFolder={selectedFolder}
                        onToggleExpand={handleToggleExpand}
                        onSelectFolder={handleSelectFolder}
                      />
                    ))
                  ) : selectedSubject ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      폴더가 없습니다
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      과목을 선택하세요
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Exam List */}
          <div className="bg-card text-card-foreground flex flex-col rounded-xl border py-4 h-150">
            <div className="px-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  시험지 목록
                </h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
            </div>
            <ScrollArea className="px-4 flex-1 h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {papersLoading ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    시험지를 불러오는 중...
                  </div>
                ) : filteredPapers.length > 0 ? (
                  filteredPapers.map((paper) => (
                  <div
                    key={paper.paperId}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      currentPaper?.paperId === paper.paperId
                        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handlePaperClick(paper)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight mb-2">
                          {paper.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {paper.countProblems}문제
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              미리보기
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              편집
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              복제
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="w-4 h-4 mr-2" />
                              인쇄
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              다운로드
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  ))
                ) : selectedFolder ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    선택한 폴더에 시험지가 없습니다
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    폴더를 선택하세요
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

        </div>

        {/* Right - Exam Preview */}
        <div className="col-span-9">
          <div className="bg-white dark:bg-gray-900 text-card-foreground flex flex-col rounded-xl border py-4 h-full flex flex-col">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 border-b">
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    수정
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    프린트
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-6 flex-1 pt-0">
              <div className="h-full flex flex-col">
                <div className="flex-1 mt-4">
                  {currentPaper ? (
                    <ScrollArea className="h-[calc(100vh-280px)] bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="p-4">
                        <ExamPaperView paperId={currentPaper.paperId} />
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="h-[calc(100vh-280px)] bg-white dark:bg-gray-800 rounded-lg border p-6 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>시험지를 선택하세요</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
