"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GradeSelectWithLabel } from "@/components/ui/grade-select"
import { Search, FolderOpen, Plus, Menu } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

import {
  useSaveLectureList,
  useSaveLecturePapers,
  useProvidedFolderPapers,
  useAddPapersFromSaveLecture,
  useAddProvidedPapers
} from "@/hooks/use-materials"
import { useMyLectures, useLectureDetail } from "@/hooks/use-lecture"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 타입 정의 (임시)
interface SaveLectureVO {
  lectureId: string;
  name: string;
  grade: number;
  paperCount: number;
}

interface LecturePaperRO {
  lecturePaperId: string;
  paperId: string;
  title: string;
  description?: string;
  totalQuestions?: number;
  multipleChoice?: number;
  shortAnswer?: number;
}

interface ProvidedPaper {
  paperId: string;
  title: string;
  description?: string;
  totalQuestions?: number;
  multipleChoice?: number;
  shortAnswer?: number;
}

interface TPagination {
  current: number;
  pageSize: number;
  defaultPageSize: number;
  total: number;
}

export function AcademyMaterials() {
  const [grade, setGrade] = useState<number>(3)
  const [keyword, setKeyword] = useState<string>("")
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("")
  const [paginationSkeleton, setPaginationSkeleton] = useState(true)
  const [pagination, setPagination] = useState<TPagination>({
    current: 1,
    pageSize: 30,
    defaultPageSize: 30,
    total: 0,
  })
  
  const [showPaperList, setShowPaperList] = useState<boolean>(false)
  const [saveLectureId, setSaveLectureId] = useState<string>("")
  const [paperIds, setPaperIds] = useState<string[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string>()
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'save' | 'provided'>('save')
  const [mode, setMode] = useState<'save' | 'provided' | 'teacher'>('save')
  const [selectedLectureId, setSelectedLectureId] = useState<string>("")
  
  // 리사이즈 상태
  const [leftWidth, setLeftWidth] = useState<number>(560)
  const [maxLeftWidth, setMaxLeftWidth] = useState<number>(800)
  const minLeftWidth = 200
  
  // 시험지 미리보기
  const [paperViewVisible, setPaperViewVisible] = useState(false)
  const [selectedPaperId, setSelectedPaperId] = useState<string | undefined>(undefined)

  // API 훅들
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()
  const { data: lectureDetail } = useLectureDetail(selectedLectureId || "")
  
  const {
    data: page,
    refetch: refetchSaveLectureList,
    isLoading: isLoadingSaveLectureList,
    error: saveLectureListError,
  } = useSaveLectureList({
    grade: grade,
    keyword: keyword,
    pageNum: pagination?.current,
    size: pagination?.pageSize,
  })
  
  // 디버깅용 로그
  useEffect(() => {
    console.log('📊 Save Lecture List State:', {
      page,
      isLoadingSaveLectureList,
      error: saveLectureListError,
      params: {
        grade,
        keyword,
        pageNum: pagination?.current,
        size: pagination?.pageSize,
      }
    });
  }, [page, isLoadingSaveLectureList, saveLectureListError, grade, keyword, pagination])
  
  const {
    data: saveLecturePapers,
    refetch: refetchSaveLecturePapers,
    isLoading: isLoadingSaveLecturePapers,
  } = useSaveLecturePapers(saveLectureId || null)
  
  const {
    data: providedPapers,
    refetch: refetchProvidedPapers,
    isLoading: isLoadingProvidedPapers,
  } = useProvidedFolderPapers(selectedFolderId || null)
  
  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])
  
  const addPapersFromSaveMutation = useAddPapersFromSaveLecture()
  const addProvidedPapersMutation = useAddProvidedPapers()
  
  // 학년 매핑 (새 컴포넌트에서는 1-12 스케일 사용)
  const gradeMapping: { [key: number]: number } = {
    7: 1, // 중1
    8: 2, // 중2  
    9: 3, // 중3
    10: 4, // 고1
    11: 5, // 고2
    12: 6, // 고3
  }

  // 이벤트 핸들러들
  const showSaveLecture = async (saveLectureId: string) => {
    setSaveLectureId(saveLectureId)
    setShowPaperList(true)
    setViewMode('save')
    setSelectedRows(new Set())
  }
  
  const handleSaveLectureClick = (lectureId: string) => {
    setSaveLectureId(lectureId)
    setViewMode('save')
    setSelectedFolderId('')
    setSelectedRows(new Set())
  }
  
  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId)
    setViewMode('provided')
    setSaveLectureId('')
    setSelectedRows(new Set())
  }
  
  const showPaper = (paperId: string) => {
    setSelectedPaperId(paperId)
    setPaperViewVisible(true)
  }
  
  const deselectPaper = () => {
    setSelectedPaperId(undefined)
    setPaperViewVisible(false)
  }
  
  const paginationChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize })
  }
  
  const applySaveLecture = async () => {
    if (!paperIds || paperIds.length === 0) {
      toast.error("저장할 시험지를 선택해 주세요.")
      return
    }
    
    if (!selectedLectureId) {
      toast.error("강좌를 선택해 주세요.")
      return
    }
    
    try {
      if (viewMode === 'save') {
        await addPapersFromSaveMutation.mutateAsync({
          lectureId: selectedLectureId,
          saveLectureId,
          paperIds
        })
      } else {
        await addProvidedPapersMutation.mutateAsync({
          lectureId: selectedLectureId,
          paperIds
        })
      }
      
      setShowPaperList(false)
      toast.success("강좌에 시험지를 추가했습니다.")
    } catch (error) {
      // 에러는 mutation 내부에서 처리됨
    }
  }
  
  // Debounced 검색
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setKeyword(value)
      refetchSaveLectureList()
    }, 1000),
    []
  )
  
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedKeyword(e.target.value)
  }
  
  const handleGradeChange = (gradeSelectValue: number) => {
    // GradeSelect는 0(전체), 7-9(중학교), 10-12(고등학교) 값을 사용
    // 기존 시스템은 1-6 값을 사용하므로 변환 필요
    let mappedGrade = 3; // 기본값 중3
    
    if (gradeSelectValue === 0) {
      mappedGrade = 3; // 전체 선택시 기본값
    } else if (gradeMapping[gradeSelectValue]) {
      mappedGrade = gradeMapping[gradeSelectValue];
    }
    
    setGrade(mappedGrade);
    refetchSaveLectureList();
  }

  // 현재 grade(1-6)를 GradeSelect용 값(7-12)으로 변환
  const getGradeSelectValue = () => {
    const reverseMapping: { [key: number]: number } = {
      1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 12
    };
    return reverseMapping[grade] || 9; // 기본값 중3
  }
  
  // 테이블 행 선택 처리
  const handleRowSelection = (rowId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedRows)
    if (isSelected) {
      newSelection.add(rowId)
    } else {
      newSelection.delete(rowId)
    }
    setSelectedRows(newSelection)
    
    const dataSource = viewMode === 'provided' ? providedPapers : saveLecturePapers
    if (dataSource) {
      const selectedPaperIds = Array.from(newSelection)
      setPaperIds(selectedPaperIds)
    }
  }
  
  // 전체 선택 처리
  const handleSelectAll = (isSelected: boolean) => {
    const dataSource = viewMode === 'provided' ? providedPapers : saveLecturePapers
    if (dataSource) {
      if (isSelected) {
        const allIds = dataSource.map((item: any) => 
          'lecturePaperId' in item ? item.lecturePaperId : String(item.paperId)
        )
        setSelectedRows(new Set(allIds))
        setPaperIds(allIds)
      } else {
        setSelectedRows(new Set())
        setPaperIds([])
      }
    }
  }
  
  // 리사이즈 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const startX = e.clientX
    const startWidth = leftWidth

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX)
      if (newWidth < minLeftWidth) {
        setLeftWidth(minLeftWidth)
      } else if (newWidth > maxLeftWidth) {
        setLeftWidth(maxLeftWidth)
      } else {
        setLeftWidth(newWidth)
      }
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  // Effects
  useEffect(() => {
    debouncedSearch(debouncedKeyword)
  }, [debouncedKeyword, debouncedSearch])
  
  useEffect(() => {
    if (page) {
      setPagination({ ...pagination, total: page.totalElements })
      setPaginationSkeleton(false)
    }
  }, [page])
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMaxLeftWidth(window.innerWidth * 0.8)
    }
  }, [])
  
  // 유틸리티 함수들
  const getGradeTitle = (grade: number) => {
    const gradeMap: { [key: number]: { title: string } } = {
      1: { title: "중1" },
      2: { title: "중2" },
      3: { title: "중3" },
      4: { title: "고1" },
      5: { title: "고2" },
      6: { title: "고3" },
    }
    return gradeMap[grade] || { title: "기타" }
  }

  // 데이터 계산
  const dataSource = viewMode === 'provided' ? providedPapers : saveLecturePapers
  const isAllSelected = dataSource && dataSource.length > 0 && selectedRows.size === dataSource.length
  const isLoading = viewMode === 'provided' ? isLoadingProvidedPapers : isLoadingSaveLecturePapers

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">학원 자료</h1>
            <p className="text-gray-600 dark:text-gray-300">학원에서 사용하는 교재와 자료를 관리하세요</p>
          </div>
          {lecturesLoading ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
          ) : (
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">강좌</Label>
              <Select value={selectedLectureId} onValueChange={setSelectedLectureId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="강좌를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {lectures?.map((lecture) => (
                    <SelectItem key={lecture.lectureId} value={lecture.lectureId}>
                      {lecture.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={applySaveLecture} 
            disabled={!(paperIds?.length > 0)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            강좌에 추가
          </Button>
          <Button variant="outline" className="">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex w-full h-full">
        {/* 왼쪽 패널 */}
        <div
          className="flex h-full flex-col bg-white overflow-hidden border-r border-gray-300 shadow-sm"
          style={{ width: leftWidth }}
        >
          {/* 상단 탭 */}
          <div className="border-b border-gray-200">
            <div className="flex bg-white">
              <button
                onClick={() => {
                  setMode('save')
                  setViewMode('save')
                  setSelectedFolderId(undefined)
                }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  mode === 'save'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                재테스트
              </button>
              <button
                onClick={() => {
                  setMode('provided')
                  setViewMode('provided')
                  setSaveLectureId("")
                }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  mode === 'provided'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                교재시TWI
              </button>
              <button
                onClick={() => {
                  setMode('teacher')
                  setViewMode('provided')
                  setSaveLectureId("")
                }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  mode === 'teacher'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                교사용TWI
              </button>
            </div>
          </div>

          {/* 필터 영역 */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-3">
                <GradeSelectWithLabel
                  label="학년"
                  value={getGradeSelectValue()}
                  onChange={handleGradeChange}
                  width={120}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700">검색</Label>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    autoComplete="off"
                    placeholder="Save 강좌 검색"
                    className="pl-10 text-sm border-gray-300 focus:border-blue-500"
                    onChange={handleKeywordChange}
                    value={debouncedKeyword}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 제공된 폴더들 - 좌우 정렬 */}
          {mode === 'provided' && (
            <div className="border-b border-gray-200 p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "folder1", name: "레벨테스트", count: 2 },
                  { id: "folder2", name: "진단평가", count: 2 },
                  { id: "folder3", name: "교과서TWI", count: 10 },
                  { id: "folder4", name: "교사용TWI", count: 0 },
                ].map((folder) => (
                  <div
                    key={folder.id}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md border cursor-pointer transition-all ${
                      selectedFolderId === folder.id 
                        ? "bg-blue-100 border-blue-300 text-blue-700" 
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    <FolderOpen className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">{folder.name}</span>
                    <Badge variant={selectedFolderId === folder.id ? "default" : "secondary"} className="text-xs ml-1">
                      {folder.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 강좌 리스트 */}
          <div className="flex-1 overflow-hidden">
            {mode === 'save' ? (
              <ul className="divide-y divide-gray-200 overflow-auto h-full">
                {isLoadingSaveLectureList ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  page?.content?.map((vo: SaveLectureVO) => {
                    const { title } = getGradeTitle(vo.grade!);
                    const isSelected = vo.lectureId === saveLectureId;
                    return (
                      <li
                        key={vo.lectureId}
                        className={`py-3 sm:py-2 px-3 cursor-pointer transition-colors duration-200 ${
                          isSelected ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-blue-50"
                        }`}
                        onClick={() => showSaveLecture(vo.lectureId)}
                      >
                        <div className="flex items-center space-x-4 py-1">
                          <p className="text-sm text-gray-600 px-2 font-medium min-w-0 flex-shrink-0">{title}</p>
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-bold text-gray-900 truncate">{vo.name}</p>
                          </div>
                          <div className="inline-flex items-center font-semibold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-full">
                            {vo.paperCount}
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                폴더를 선택하세요
              </div>
            )}
          </div>
          
          {/* 페이지네이션 - Save 모드일 때만 표시 */}
          {mode === 'save' && (
            <div className="border-t border-gray-200 bg-white">
              <div className="flex items-center justify-center p-3">
                <div className="flex items-center gap-1 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pagination.current === 1}
                    onClick={() => paginationChange(Math.max(1, pagination.current - 1), pagination.pageSize)}
                    className="h-8 w-8 p-0"
                  >
                    ‹
                  </Button>
                  <span className="mx-2 text-sm text-gray-600">
                    {pagination.current}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!page || pagination.current >= Math.ceil(page.totalElements / pagination.pageSize)}
                    onClick={() => paginationChange(pagination.current + 1, pagination.pageSize)}
                    className="h-8 w-8 p-0"
                  >
                    ›
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 수직 드래그 바 */}
        <div
          className="h-full cursor-ew-resize hover:bg-gray-400 hover:shadow-md transition-all duration-200 z-10"
          style={{ width: "8px", backgroundColor: "#e5e7eb" }}
          onMouseDown={handleMouseDown}
        ></div>

        {/* 오른쪽 LecturePaper 리스트 패널 */}
        <div 
          className="h-full flex justify-center items-center bg-white rounded-md overflow-hidden border shadow-lg"
          style={{ width: `calc(100% - ${leftWidth}px - 8px)` }}
        >
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : !dataSource ? (
            <div className="w-full h-40 flex justify-center items-center flex-col text-center">
              <div className="text-gray-500">시험지를 선택하면 시험지를 볼 수 있습니다.</div>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </TableHead>
                    <TableHead className="w-[120px] text-center">과목</TableHead>
                    <TableHead>범위/문제명</TableHead>
                    <TableHead className="w-[300px] text-center">문항수 (주관식/객관식)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSource?.map((record: LecturePaperRO | ProvidedPaper) => {
                    const rowId = 'lecturePaperId' in record ? record.lecturePaperId : String(record.paperId)
                    const isSelected = selectedRows.has(rowId)
                    
                    return (
                      <TableRow key={rowId}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleRowSelection(rowId, e.target.checked)}
                            className="w-4 h-4"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <Badge className="bg-purple-100 text-purple-800 text-xs">중등</Badge>
                            <div className="text-xs text-gray-500">중3</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="space-y-1 cursor-pointer hover:text-blue-600"
                            onClick={() => showPaper(String(record.paperId))}
                          >
                            <div className="font-medium text-gray-900 leading-tight text-sm line-clamp-2">
                              {record.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">{record.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-xs text-gray-600">
                            총 {record.totalQuestions || 0}개 ({record.multipleChoice || 0}/{record.shortAnswer || 0})
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* 시험지 미리보기 모달 - TODO: 실제 모달 컴포넌트로 교체 */}
        {paperViewVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">시험지 미리보기</h3>
              <p>Paper ID: {selectedPaperId}</p>
              <div className="mt-4">
                <Button onClick={deselectPaper}>닫기</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}