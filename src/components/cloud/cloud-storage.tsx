"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FlexibleSelect } from "@/components/ui/flexible-select"
import type { SelectOption } from "@/components/ui/flexible-select"
import { useSubjects } from "@/hooks/use-subjects"
import { useBookGroups, useBookGroupDetail, useResourceProblems } from "@/hooks/use-cloud"
import type { CloudBookGroup, CloudResourceProblem } from "@/types/cloud"
import { FolderTreeNode } from "./folder-tree"
import {
  FileText,
  MoreVertical,
  Download,
  Edit,
  Copy,
  Trash2,
  Eye,
  Upload,
  FolderPlus,
  File,
  ImageIcon,
  BarChart3,
  Type,
  Archive,
  HardDrive,
  FileSpreadsheet,
} from "lucide-react"

// 파일 타입을 파일 확장자에서 추출하는 함수
const getFileTypeFromPath = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase() || ''
  switch (extension) {
    case 'hwp':
      return 'hwp'
    case 'pdf':
      return 'pdf'
    case 'doc':
    case 'docx':
      return 'doc'
    case 'xls':
    case 'xlsx':
      return 'xlsx'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'image'
    default:
      return 'file'
  }
}



export function CloudStorage() {
  const [selectedFolder, setSelectedFolder] = useState("")
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

  // 선택된 폴더 데이터를 재귀적으로 찾기
  const findFolderById = (folders: CloudBookGroup[], targetKey: string): CloudBookGroup | null => {
    for (const folder of folders) {
      if (folder.key === targetKey) {
        return folder
      }
      if (folder.children) {
        const found = findFolderById(folder.children, targetKey)
        if (found) return found
      }
    }
    return null
  }

  
  // 리소스 문제 목록 (현재는 필터링 없음)
  const filteredProblems = resourceProblems || []

  const getFileIcon = (type: string) => {
    switch (type) {
      case "hwp":
        return <File className="w-5 h-5 text-blue-600" />
      case "pdf":
        return <FileText className="w-5 h-5 text-red-600" />
      case "doc":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "xlsx":
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />
      case "image":
        return <ImageIcon className="w-5 h-5 text-purple-600" />
      default:
        return <File className="w-5 h-5 text-gray-600" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "hwp":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pdf":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "doc":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "xlsx":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "image":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // 파일 크기를 추정하는 함수 (실제 크기는 API에서 제공되지 않음)
  const getEstimatedFileSize = (pageCount: number, problemCount: number) => {
    // 대략적인 추정치
    const estimatedSizeMB = Math.max(0.5, (pageCount * 0.3) + (problemCount * 0.1))
    return `${estimatedSizeMB.toFixed(1)}MB`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">수작 클라우드</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">시험지 파일을 안전하게 저장하고 관리하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <HardDrive className="w-4 h-4" />
            <span>사용량: 2.3GB / 10GB</span>
          </div>
          <Button variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />새 폴더
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            파일 업로드
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-300px)]">
        {/* Left Sidebar - Folder Structure */}
        <div className="col-span-3">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg">폴더 구조</h3>
              </div>
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
              
              {!subjectsLoading && (!subjects || subjects.length === 0) && (
                <div className="text-sm text-red-500 mt-2">과목 목록을 불러올 수 없습니다</div>
              )}
            </div>
            <div className="px-6 pt-0">
              <div className="space-y-1">
                {bookGroupsLoading ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    폴더 목록 로딩중...
                  </div>
                ) : bookGroups && bookGroups.length > 0 ? (
                  bookGroups.map((folder) => (
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
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    폴더가 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right - File List */}
        <div className="col-span-9">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full flex flex-col">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {bookGroupDetailLoading ? "로딩중..." : bookGroupDetail?.title || "파일 목록"}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-600" />
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <Archive className="w-4 h-4 text-orange-600" />
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </div>

            </div>
            <div className="px-6 flex-1 overflow-auto pt-0">
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-500 border-b">
                  <div className="col-span-1">#</div>
                  <div className="col-span-8">파일명</div>
                  <div className="col-span-2">문제수</div>
                  <div className="col-span-1"></div>
                </div>
                {resourceProblemsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    파일 목록 로딩중...
                  </div>
                ) : filteredProblems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedFolder ? "파일이 없습니다" : "폴더를 선택해주세요"}
                  </div>
                ) : (
                  filteredProblems.map((problem, index) => {
                    const fileType = getFileTypeFromPath(problem.title)
                    const createdDate = new Date(problem.created).toLocaleDateString('ko-KR')
                    const fileSize = getEstimatedFileSize(problem.pageCount, problem.problemCount)
                    
                    return (
                      <div
                        key={problem.fileId}
                        className="grid grid-cols-12 gap-4 p-3 rounded-lg border hover:border-muted hover:bg-muted/50 transition-all duration-200"
                      >
                        <div className="col-span-1 flex items-center">
                          <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                        </div>
                        <div className="col-span-8 flex items-center gap-3">
                          {getFileIcon(fileType)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{problem.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getFileTypeColor(fileType)}>{fileType.toUpperCase()}</Badge>
                              <span className="text-xs text-muted-foreground">{fileSize}</span>
                              <span className="text-xs text-muted-foreground">{createdDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <span className="text-sm font-medium">{problem.problemCount}</span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
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
                                <Download className="w-4 h-4 mr-2" />
                                다운로드
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                이름 변경
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                복사
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
