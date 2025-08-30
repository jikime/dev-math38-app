"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  List,
  ArrowUpDown,
  FolderOpen,
  Archive,
  X,
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
  
  // 폴더 생성 모달 상태
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [folderType, setFolderType] = useState("교과서")
  const [folderName, setFolderName] = useState("")
  
  // PDF 업로드 모달 상태
  const [isPdfUploadOpen, setIsPdfUploadOpen] = useState(false)
  
  // HWP 업로드 모달 상태
  const [isHwpUploadOpen, setIsHwpUploadOpen] = useState(false)
  
  // 빈 파일 만들기 모달 상태
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  
  // 드롭다운 메뉴 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

  // 폴더 생성 처리
  const handleCreateFolder = () => {
    if (!folderName.trim()) return
    
    // TODO: API 호출로 폴더 생성
    console.log('폴더 생성:', { type: folderType, name: folderName })
    
    // 모달 닫기 및 상태 초기화
    setIsCreateFolderOpen(false)
    setFolderName("")
    setFolderType("교과서")
  }

  // PDF 업로드 처리
  const handlePdfUpload = () => {
    // TODO: PDF 파일 업로드 로직
    console.log('PDF 업로드')
    setIsPdfUploadOpen(false)
  }

  // HWP 업로드 처리
  const handleHwpUpload = () => {
    // TODO: HWP 파일 업로드 로직
    console.log('HWP 업로드')
    setIsHwpUploadOpen(false)
  }

  // 빈 파일 생성 처리
  const handleCreateFile = () => {
    if (!fileName.trim()) return
    
    // TODO: 빈 파일 생성 API 호출
    console.log('빈 파일 생성:', fileName)
    
    // 모달 닫기 및 상태 초기화
    setIsCreateFileOpen(false)
    setFileName("")
  }

  // 모달 열기 핸들러들 (드롭다운도 함께 닫기)
  const handleOpenHwpModal = () => {
    setIsHwpUploadOpen(true)
    setIsDropdownOpen(false)
  }

  const handleOpenPdfModal = () => {
    setIsPdfUploadOpen(true)
    setIsDropdownOpen(false)
  }

  const handleOpenCreateFileModal = () => {
    setIsCreateFileOpen(true)
    setIsDropdownOpen(false)
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
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-300px)]">
        {/* Left Sidebar - Folder Structure */}
        <div className="col-span-3">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg">폴더 구조</h3>
                <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderPlus className="w-4 h-4 mr-1" />
                      새 폴더
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>폴더 생성</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-3">
                        <Label htmlFor="folder-type" className="text-sm font-medium">
                          <span className="text-red-500">*</span> 폴더 정보 :
                        </Label>
                        <RadioGroup value={folderType} onValueChange={setFolderType} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="교과서" id="textbook" />
                            <Label htmlFor="textbook">교과서</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="문제집" id="workbook" />
                            <Label htmlFor="workbook">문제집</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="시험지" id="exam" />
                            <Label htmlFor="exam">시험지</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="모의고사" id="mock" />
                            <Label htmlFor="mock">모의고사</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="folder-name" className="text-sm font-medium">
                          <span className="text-red-500">*</span> 폴더명 :
                        </Label>
                        <Input
                          id="folder-name"
                          placeholder="폴더명"
                          value={folderName}
                          onChange={(e) => setFolderName(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex justify-center pt-4">
                        <Button 
                          onClick={handleCreateFolder}
                          className="bg-blue-600 hover:bg-blue-700 px-8"
                          disabled={!folderName.trim()}
                        >
                          저장
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 border rounded-md p-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="리스트 보기">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="파일 순서 바꾸기">
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="북그룹 이동하기">
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                  </div>
                  <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Upload className="w-4 h-4 mr-2" />
                        파일 업로드
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleOpenHwpModal}>
                        <FileText className="w-4 h-4 mr-2" />
                        HWP 파일 업로드
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleOpenPdfModal}>
                        <FileText className="w-4 h-4 mr-2 text-red-600" />
                        PDF 파일 업로드
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleOpenCreateFileModal}>
                        <File className="w-4 h-4 mr-2" />
                        빈 파일 만들기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

            </div>
            <div className="px-6 pt-0 flex-1">
              <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-1">#</div>
                <div className="col-span-8">파일명</div>
                <div className="col-span-2">문제수</div>
                <div className="col-span-1"></div>
              </div>
              <ScrollArea className="h-[calc(100vh-500px)]">
                <div className="space-y-2 p-3">
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
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* PDF 업로드 모달 */}
      <Dialog open={isPdfUploadOpen} onOpenChange={setIsPdfUploadOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              PDF 이미지 파일 업로드
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPdfUploadOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50">
              <div className="flex flex-col items-center space-y-4">
                <Archive className="h-16 w-16 text-blue-500" />
                <div className="space-y-2">
                  <p className="text-lg text-gray-700">
                    파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요.
                  </p>
                  <p className="text-sm text-gray-500">
                    파일은 .pdf 파일만 업로드 가능합니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handlePdfUpload} className="bg-gray-600 hover:bg-gray-700">
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* HWP 업로드 모달 */}
      <Dialog open={isHwpUploadOpen} onOpenChange={setIsHwpUploadOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              수학 문제 한글 파일 업로드
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHwpUploadOpen(false)}
                className="ml-auto h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {/* 단계 표시 */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="ml-2 font-medium text-blue-600">파일 선택</span>
                <div className="ml-4 text-sm text-gray-600">파일을 선택해 주세요.</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                  2
                </div>
                <span className="ml-2 text-gray-500">문제 업로드</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                  3
                </div>
                <span className="ml-2 text-gray-500">완료</span>
              </div>
            </div>

            {/* 업로드 영역 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50/50 mb-8">
              <div className="flex flex-col items-center space-y-4">
                <Archive className="h-16 w-16 text-blue-500" />
                <div className="space-y-2">
                  <p className="text-lg text-gray-700">
                    파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요.
                  </p>
                  <p className="text-sm text-gray-500">
                    .hwp 파일만 업로드 가능합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                샘플 파일 다운로드
              </Button>
              <Button onClick={handleHwpUpload} className="bg-gray-600 hover:bg-gray-700">
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 빈 파일 만들기 모달 */}
      <Dialog open={isCreateFileOpen} onOpenChange={setIsCreateFileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              새파일 등록
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateFileOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* 북그룹 정보 */}
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium min-w-[80px]">북그룹 :</Label>
              <span className="text-sm text-gray-700">
                {bookGroupDetail?.title || selectedFolder || "중 1 레벨테스트"}
              </span>
            </div>

            {/* 파일명 입력 */}
            <div className="flex items-center gap-3">
              <Label htmlFor="file-name" className="text-sm font-medium min-w-[80px]">
                <span className="text-red-500">*</span> 파일 명 :
              </Label>
              <Input
                id="file-name"
                placeholder="파일 이름"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleCreateFile}
                className="bg-blue-600 hover:bg-blue-700 px-8"
                disabled={!fileName.trim()}
              >
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
