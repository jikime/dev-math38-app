"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { useRepositoryProblems } from "@/hooks/use-repository"
import { useMyLectures } from "@/hooks/use-lecture"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import PaperModal from "@/components/math-paper/paper-modal"
import PaperCopyModal from "@/components/repository/paper-copy-modal"
import PaperPrintModal from "@/components/repository/paper-print-modal"
import PaperAnswerInputModal from "@/components/repository/paper-answer-input-modal"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  Search,
  Edit,
  CalendarIcon,
  ChevronDown,
  Grid3X3,
  List,
  Copy,
  FileText,
  Printer,
  Trash2,
  BookOpen,
  MoreVertical,
  CheckCircle,
} from "lucide-react"
import { getSubjectTitle } from "@/lib/tag-utils"
import { clinicName, PaperType } from "../math-paper/domains/paper"
import { ProgressState } from "../math-paper/domains/lecture"
import router from "next/router"
import { toast } from "sonner"


function ProblemRepositoryComponent() {
  const [selectedSubject, setSelectedSubject] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showPaperModal, setShowPaperModal] = useState(false)
  const [selectedLectureId, setSelectedLectureId] = useState<string | undefined>(undefined)

    // 시험지 모달 상태
    const [selectedPaperId, setSelectedPaperId] = useState<string | undefined>();
    const [isAcademyPaper, setIsAcademyPaper] = useState(false);
    const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
    const [isSaveLectureOpen, setIsSaveLectureOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [paperToDelete, setPaperToDelete] = useState<{name: string, id: string} | null>(null);
    
    // 사본 만들기 모달 상태
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    const [copyPaperId, setCopyPaperId] = useState<string>("");
    const [copyPaperName, setCopyPaperName] = useState<string>("");
    const [copyLectureId, setCopyLectureId] = useState<string>("");
    
    // 출력 모달 상태
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [printPaperId, setPrintPaperId] = useState<string>("");
    const [printPaperType, setPrintPaperType] = useState<PaperType>(PaperType.manual);
    const [printSubjectId, setPrintSubjectId] = useState<number | undefined>();
    
    // 답안입력 모달 상태
    const [isAnswerInputOpen, setIsAnswerInputOpen] = useState(false);
    const [answerInputPaperId, setAnswerInputPaperId] = useState<string>("");
    const [answerInputPaperType, setAnswerInputPaperType] = useState<PaperType>(PaperType.manual);

    // 드롭다운 상태 관리
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // 강좌 목록 가져오기
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()

  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])

  // 필터가 변경되면 열린 드롭다운 닫기
  useEffect(() => {
    setOpenDropdownId(null)
  }, [selectedLectureId, searchTerm, selectedSubject, dateFrom, dateTo])

  // 선택된 강좌에 대한 문제 목록 가져오기
  const { data: lecturePapers, isLoading, error } = useRepositoryProblems({
    lectureId: selectedLectureId,
    from: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
    to: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined,
  })

  // 현재 선택된 강좌 정보
  const currentLecture = lectures?.find(l => l.lectureId === selectedLectureId)


  // 메모이제이션된 함수들
  const getSubject = useCallback((subjectId: number) => {
    const { title, color, tag } = getSubjectTitle(subjectId);
    return (
      <div className={`text-center ${color}`}>
        {tag}
      </div>
    );
  }, [])

  // API 데이터를 기존 UI 형식으로 변환 (메모이제이션)
  const transformedProblems = useMemo(() => 
    lecturePapers?.map((paper) => ({
      id: paper.lecturePaperId,
      paperRefId: paper.paperRefId,
      paperIndex: paper.paperIndex, // 번호로 사용할 paperIndex 추가
      date: format(new Date(paper.created), "M월 d일", { locale: ko }),
      fullDate: new Date(paper.created),
      subject: getSubject(paper.subjectId),
      subjectId: paper.subjectId,
      bookTitle: paper.bookTitle,
      name: paper.name,
      range: `${paper.rangeFrom}${paper.rangeTo !== paper.rangeFrom ? ` ~ ${paper.rangeTo}` : ""}`,
      type_label: clinicName(paper.type as PaperType),
      type: paper.type,
      state: paper.state,
      color: paper.state === ProgressState.finished ? "green" : paper.state === ProgressState.ready ? "blue" : "orange",
      finishedCount: paper.finishedCount,
      paperCount: paper.paperCount,
      totalQuestions: paper.count,
      easyQuestions: paper.level1 + paper.level2,
      mediumQuestions: paper.level3,
      hardQuestions: paper.level4 + paper.level5,
      grade: paper.grade,
      difficulty: paper.difficulty,
      average: paper.average,
      countEasy: paper.countEssay,
      countChoice: paper.countChoice,
    })) || [], [lecturePapers, getSubject])


  const getStatusColor = useCallback((state: ProgressState) => {
    switch (state) {
      case ProgressState.finished:
        return "text-green-600 dark:text-green-400"
      case ProgressState.ready:
        return "text-blue-600 dark:text-blue-400"
      case ProgressState.cliniced:
        return "text-yellow-600 dark:text-yellow-400"
      case ProgressState.published:
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }, [])

  // type별 뱃지 색상
  const getTypeBadgeColor = useCallback((type: PaperType) => {
    switch (type) {
      case PaperType.manual:
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
      case PaperType.workbook_addon:
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
      default:
        return "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
    }
  }, [])


  const PaperStateView = useCallback((state: ProgressState, finishedCount: number, paperCount: number) => {
    switch (state) {
      case ProgressState.finished:
        return <span className="text-sm font-medium">완료</span>;
      case ProgressState.published:
        if (finishedCount === 0) {
          return <span className="text-sm font-medium">발행됨</span>;
        } else {
          return (
            <span className="text-sm font-medium">
              {finishedCount} / {paperCount}
            </span>
          );
        }
      case ProgressState.ready:
        if (paperCount > 0) {
          return (
            <span className="text-sm font-medium">
              {finishedCount} / {paperCount}
            </span>
          );
        } else {
          return <span className="text-sm font-medium">준비</span>;
        }
    }
    return <></>;
  }, []);

  const filteredProblems = useMemo(() => transformedProblems.filter((problem) => {
    const matchesSearch =
      problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.range.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = selectedSubject === "전체" || problem.bookTitle === selectedSubject

    const matchesDateFrom = !dateFrom || problem.fullDate >= dateFrom
    const matchesDateTo = !dateTo || problem.fullDate <= dateTo

    return (
      matchesSearch &&
      matchesSubject &&
      matchesDateFrom &&
      matchesDateTo 
    )
  }), [transformedProblems, searchTerm, selectedSubject, dateFrom, dateTo])

  // 제목 클릭 핸들러 - paperRefId 사용
  const handleTitleClick = useCallback((paperRefId: string) => {
    setSelectedPaperId(paperRefId)
    setShowPaperModal(true)
  }, [])

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setShowPaperModal(false)
    setSelectedPaperId(undefined)
  }, [])

  // 체크박스 관련 함수들
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedItems([])
      setSelectAll(false)
    } else {
      const allIds = filteredProblems.map(problem => problem.id)
      setSelectedItems(allIds)
      setSelectAll(true)
    }
  }, [selectAll, filteredProblems])

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSelected = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
      
      // 전체 선택 상태 업데이트
      setSelectAll(newSelected.length === filteredProblems.length && filteredProblems.length > 0)
      
      return newSelected
    })
  }, [filteredProblems.length])

    // 시험지 액션 핸들러들
    const handleCopyPaper = useCallback((lecturePaperId: string) => {
      const paper = transformedProblems.find(p => p.id === lecturePaperId);
      if (paper && selectedLectureId) {
        setCopyPaperId(lecturePaperId);
        setCopyPaperName(paper.name);
        setCopyLectureId(selectedLectureId);
        setIsCopyModalOpen(true);
        // 드롭다운 닫기
        setOpenDropdownId(null);
      } else {
        toast.error("문제지를 찾을 수 없습니다.");
      }
    }, [transformedProblems, selectedLectureId]);
    
    const handleCopyModalClose = useCallback((targetLectureId?: string) => {
      setIsCopyModalOpen(false);
      setCopyPaperId("");
      setCopyPaperName("");
      setCopyLectureId("");
      
      // 복사 완료 후 목록 새로고침 (필요시)
      if (targetLectureId === selectedLectureId) {
        // 필요시 refetch 로직 추가
        toast.success("시험지가 성공적으로 복사되었습니다.");
      }
    }, [selectedLectureId]);
  
    const handleEditPaper = (paperRefId: string) => {
      router.push(`/tutor/problemmng/paperedit/${selectedLectureId}/${paperRefId}`);
      // 드롭다운 닫기
      setOpenDropdownId(null);
    };
  
    const handlePrintPaper = (paper: {lecturePaperId: string, type: PaperType, subjectId: number}) => {
      setPrintPaperId(paper.lecturePaperId);
      setPrintPaperType(paper.type as PaperType);
      setPrintSubjectId(paper.subjectId || undefined);
      setIsPrintModalOpen(true);
      // 드롭다운 닫기
      setOpenDropdownId(null);
    };
  
    const handleOpenAnswerSheet = (paper: {lecturePaperId: string, type: PaperType}) => {
      setAnswerInputPaperId(paper.lecturePaperId);
      setAnswerInputPaperType(paper.type as PaperType);
      setIsAnswerInputOpen(true);
      // 드롭다운 닫기
      setOpenDropdownId(null);
    };
  
    const showPaper = (paperId: string) => {
      setSelectedPaperId(paperId);
      setIsAcademyPaper(false);
      setIsPaperModalOpen(true);
    };
  
    const showAcademyPaper = (paperId: string) => {
      setSelectedPaperId(paperId);
      setIsAcademyPaper(true);
      setIsPaperModalOpen(true);
    };
    
    const closePaperModal = () => {
      setIsPaperModalOpen(false);
      setSelectedPaperId(undefined);
    };
  
    const handleRemovePaper = async (paper: {name: string, lecturePaperId: string}): Promise<void> => {
      if (!selectedLectureId) return;
      
      try {
        // await api.main.deleteLecturePaper(selectedLectureId, paper.lecturePaperId);
        toast.success(`"${paper.name}"이(가) 삭제되었습니다.`);
        
        // 목록에서 제거
        // setPaperList(prev => prev.filter(p => p.lecturePaperId !== paper.lecturePaperId));
      } catch (error) {
        console.error('시험지 삭제 실패:', error);
        toast.error('시험지 삭제에 실패했습니다.');
      }
    };

  const handleDeleteClick = (paper: {name: string, id: string}) => {
    // 드롭다운 닫기
    setOpenDropdownId(null);
    
    // AlertDialog로 확인 요청
    setPaperToDelete(paper);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = () => {
    if (paperToDelete) {
      handleRemovePaper({name: paperToDelete.name, lecturePaperId: paperToDelete.id});
      setPaperToDelete(null);
    }
    setIsDeleteAlertOpen(false);
  };
  
  const cancelDelete = () => {
    setPaperToDelete(null);
    setIsDeleteAlertOpen(false);
  };

  const renderDifficultyGraph = useCallback((problem: {
    easyQuestions: number;
    mediumQuestions: number; 
    hardQuestions: number;
    totalQuestions: number;
  }) => {
    const easyPercent = Math.round((problem.easyQuestions / problem.totalQuestions) * 100)
    const mediumPercent = Math.round((problem.mediumQuestions / problem.totalQuestions) * 100)
    const hardPercent = Math.round((problem.hardQuestions / problem.totalQuestions) * 100)
    
    return (
      <div className="relative group w-full">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div className="flex h-full">
            {easyPercent > 0 && (
              <div
                className="bg-green-500 transition-all duration-200"
                style={{ width: `${easyPercent}%` }}
              />
            )}
            {mediumPercent > 0 && (
              <div
                className="bg-blue-500 transition-all duration-200"
                style={{ width: `${mediumPercent}%` }}
              />
            )}
            {hardPercent > 0 && (
              <div
                className="bg-purple-500 transition-all duration-200"
                style={{ width: `${hardPercent}%` }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {easyPercent}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {mediumPercent}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {hardPercent}%
            </span>
          </div>
        </div>

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  쉬움: {problem.easyQuestions}개 ({easyPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  보통: {problem.mediumQuestions}개 ({mediumPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  어려움: {problem.hardQuestions}개 ({hardPercent}%)
                </span>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </div>
      </div>
    )
  }, [])

  // 스켈레톤 컴포넌트 (메모이제이션)
  const TableSkeleton = memo(() => (
    <div className="px-6 p-0">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
            <TableRow className="border-b-0">
              <TableHead style={{ width: "48px" }} className="text-center py-2">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "64px" }} className="text-center py-2">
                <Skeleton className="h-4 w-8 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "96px" }} className="text-center py-2">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "140px" }} className="text-center py-2">
                <Skeleton className="h-4 w-16 mx-auto" />
              </TableHead>
              <TableHead className="py-2">
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead style={{ width: "100px" }} className="text-center py-2">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "90px" }} className="text-center py-2">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "180px" }} className="text-center py-2">
                <Skeleton className="h-4 w-24 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "64px" }}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index} className="border-b border-gray-100 dark:border-gray-800">
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-4 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                <TableCell className="px-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-8 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ))
  TableSkeleton.displayName = 'TableSkeleton'

  const GridSkeleton = memo(() => (
    <div className="px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-3">
              {/* Header skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
              
              {/* Title and description skeleton */}
              <div className="space-y-1">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              {/* Badge and status skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              
              {/* Stats skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))
  GridSkeleton.displayName = 'GridSkeleton'

  const FilterSkeleton = memo(() => (
    <div className="mb-2">
      <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          {/* Left side skeleton */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-9 w-44" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
          
          {/* Right side skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-64" />
            <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
              <Skeleton className="h-8 w-8 mx-1" />
              <Skeleton className="h-8 w-8 mx-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
  FilterSkeleton.displayName = 'FilterSkeleton'

  // 로딩 상태
  if (lecturesLoading || (isLoading && selectedLectureId)) {
    return (
      <>
        <FilterSkeleton />
        <div className="flex flex-col gap-6">
          {viewMode === "table" ? <TableSkeleton /> : <GridSkeleton />}
        </div>
      </>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Filter Section */}
      <div className="mb-2">
        {/* Main Filter Bar */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            {/* Left side - Main filters */}
            <div className="flex items-center gap-4">
              {/* Course Name */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">강좌</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 px-3 min-w-[180px] justify-between font-normal">
                      {lecturesLoading ? (
                        <span className="text-sm">강좌 로딩중...</span>
                      ) : (
                        <span className="text-sm truncate">
                          {currentLecture ? currentLecture.name : '강좌를 선택하세요'}
                        </span>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[280px] max-h-[400px] overflow-y-auto">
                    {lectures && lectures.length > 0 ? (
                      lectures.map((lecture) => (
                        <DropdownMenuItem
                          key={lecture.lectureId}
                          onClick={() => setSelectedLectureId(lecture.lectureId)}
                          className={selectedLectureId === lecture.lectureId ? 'bg-gray-100 dark:bg-gray-800' : ''}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{lecture.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {lecture.teacherName} | 학생 {lecture.studentCount}명 | 시험지 {lecture.paperCount}개
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        강좌가 없습니다
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">기간</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 px-3 font-normal justify-start text-left min-w-[140px]"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">
                        {dateRange.from && dateRange.to ? (
                          `${format(dateRange.from, "MM/dd", { locale: ko })} ~ ${format(dateRange.to, "MM/dd", { locale: ko })}`
                        ) : dateRange.from ? (
                          `${format(dateRange.from, "MM/dd", { locale: ko })} ~`
                        ) : (
                          "전체"
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{from: dateRange.from, to: dateRange.to}}
                      onSelect={(range) => {
                        if (range) {
                          setDateRange({from: range.from, to: range.to})
                          setDateFrom(range.from)
                          setDateTo(range.to)
                        } else {
                          setDateRange({from: undefined, to: undefined})
                          setDateFrom(undefined)
                          setDateTo(undefined)
                        }
                      }}
                      locale={ko}
                      className="rounded-md border"
                    />
                    <div className="p-3 border-t flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setDateRange({from: undefined, to: undefined})
                          setDateFrom(undefined)
                          setDateTo(undefined)
                        }}
                        className="h-8"
                      >
                        전체
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                            setDateRange({from: weekAgo, to: today})
                            setDateFrom(weekAgo)
                            setDateTo(today)
                          }}
                          className="h-8 text-xs"
                        >
                          최근 7일
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                            setDateRange({from: monthAgo, to: today})
                            setDateFrom(monthAgo)
                            setDateTo(today)
                          }}
                          className="h-8 text-xs"
                        >
                          최근 30일
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Right side - Search and View toggle */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <Input
                  placeholder="검색어를 입력하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-9 pr-4 w-64 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 rounded-md transition-all duration-200"
                />
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`h-8 px-3 rounded-md transition-all duration-200 ${
                    viewMode === "table" 
                      ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 px-3 rounded-md transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Content Area */}
      {viewMode === "table" ? (
        /* Table View */
        <div className="flex flex-col gap-6">
          <div className="px-6 p-0">
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
                <TableRow className="border-b-0">
                  <TableHead style={{ width: "48px" }} className="text-center py-2">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="mx-auto"
                    />
                  </TableHead>
                  <TableHead style={{ width: "64px" }} className="text-center py-2">
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">번호</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "96px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">출제일</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "140px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">출제</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">범위/문제명</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "100px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">문제 종류</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "90px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">상태</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "180px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">문항수 (주관식/객관식)</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "64px" }}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProblems.map((problem) => (
                  <TableRow key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedItems.includes(problem.id)}
                        onCheckedChange={() => handleSelectItem(problem.id)}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium">{problem.paperIndex}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{problem.date}</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        {problem.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {problem.range != 'null' && <div className="text-sm text-gray-600 dark:text-gray-400 break-words whitespace-normal">{problem.range}</div>}
                        <div 
                          className={`font-medium text-lg ${problem.paperRefId ? "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline" : "text-gray-800 dark:text-gray-200"} break-words whitespace-normal`}
                          onClick={problem.paperRefId ? () => handleTitleClick(problem.paperRefId) : undefined}
                        >
                          <span className="text-lg text-gray-600 dark:text-gray-400 break-words whitespace-normal">{problem.bookTitle}</span> {problem.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {(problem.type === PaperType.workbook_addon ||
                          problem.type === PaperType.workbook_paper) && (
                          <BookOpen className="w-4 h-4" />
                        )}
                        {problem.type === PaperType.academy_contents && (
                          <BookOpen className="w-4 h-4 text-orange-500" />
                        )}
                        <Badge className={`text-xs ${getTypeBadgeColor(problem.type)}`}>
                          {problem.type_label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center gap-1 ${getStatusColor(problem.state)}`}>
                        {PaperStateView(problem.state, problem.finishedCount, problem.paperCount)}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="space-y-2 w-full">
                        {(problem.type === PaperType.manual ||
                          problem.type === PaperType.workbook_paper ||
                          problem.type === PaperType.workbook_addon ||
                          problem.type === PaperType.personal_addon || 
                          problem.type === PaperType.academy_contents)  ? (
                          <>
                            {renderDifficultyGraph(problem)}
                            <div className="flex justify-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                              <span>총 {problem.totalQuestions}문항 ({problem.countEasy}/{problem.countChoice})</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-sm font-medium text-blue-600 dark:text-blue-400">개별시험지</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu 
                        open={openDropdownId === problem.id} 
                        onOpenChange={(open) => setOpenDropdownId(open ? problem.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(problem.type === PaperType.manual || problem.type === PaperType.workbook_addon) && (
                            <>
                              <DropdownMenuItem onClick={() => handleCopyPaper(problem.id)}>
                                <Copy className="mr-2 h-4 w-4" />
                                사본 만들기
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleEditPaper(problem.id)}
                                disabled={problem.paperCount > 0}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                시험지 수정
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handlePrintPaper({lecturePaperId: problem.id, type: problem.type, subjectId: problem.subjectId})}>
                            <Printer className="mr-2 h-4 w-4" />
                            출력
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenAnswerSheet({lecturePaperId: problem.id, type: problem.type})}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            답안입력
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick({name: problem.name, id: problem.id})}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View - 테이블과 일치하는 스타일 */
        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  {/* 헤더: 학교급, 번호, 날짜, 더보기 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {problem.subject}
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">#{problem.paperIndex}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{problem.date}</span>
                      <DropdownMenu 
                        open={openDropdownId === problem.id} 
                        onOpenChange={(open) => setOpenDropdownId(open ? problem.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(problem.type === PaperType.manual || problem.type === PaperType.workbook_addon) && (
                            <>
                              <DropdownMenuItem onClick={() => handleCopyPaper(problem.id)}>
                                <Copy className="mr-2 h-4 w-4" />
                                사본 만들기
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleEditPaper(problem.id)}
                                disabled={problem.paperCount > 0}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                시험지 수정
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handlePrintPaper({lecturePaperId: problem.id, type: problem.type, subjectId: problem.subjectId})}>
                            <Printer className="mr-2 h-4 w-4" />
                            출력
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenAnswerSheet({lecturePaperId: problem.id, type: problem.type})}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            답안입력
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick({name: problem.name, id: problem.id})}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* 제목과 설명 */}
                  <div className="space-y-1">
                    <h3 
                      className="font-medium text-lg line-clamp-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline"
                      onClick={() => handleTitleClick(problem.id)}
                    >
                      <span className="text-lg text-gray-600 dark:text-gray-400 break-words whitespace-normal">{problem.bookTitle}</span> {problem.name}
                    </h3>
                    {problem.range !== 'null' && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{problem.range}</p>
                    )}
                  </div>

                  {/* 타입과 상태 */}
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getTypeBadgeColor(problem.type)}`}>
                      {problem.type_label}
                    </Badge>
                    <div className={`flex items-center gap-1 ${getStatusColor(problem.state)}`}>
                      <span className="text-xs font-medium">{PaperStateView(problem.state, problem.finishedCount, problem.paperCount)}</span>
                    </div>
                  </div>

                  {/* 문제 수 또는 개별시험지 표시 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    {problem.type === "addon_ps" ? (
                      <span className="font-medium text-blue-600 dark:text-blue-400">개별시험지</span>
                    ) : (
                      <>
                        <span>총 {problem.totalQuestions}문항 ({problem.countEasy}/{problem.countChoice})</span>
                        <span>난이도 {problem.difficulty}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {filteredProblems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            저장된 문제가 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            새로운 문제를 생성하거나 필터를 조정해 보세요.
          </p>
        </div>
      )}


      {/* 시험지 보기 모달 */}
      <PaperModal
        isOpen={showPaperModal}
        onClose={handleCloseModal}
        paperId={selectedPaperId}
        useAcademyContents={false}
      />

      {/* 사본 만들기 모달 */}
      <PaperCopyModal
        open={isCopyModalOpen}
        setOpen={setIsCopyModalOpen}
        lectureId={copyLectureId}
        paperId={copyPaperId}
        paperName={copyPaperName}
        onSuccess={handleCopyModalClose}
      />

      {/* 출력 모달 */}
      <PaperPrintModal
        open={isPrintModalOpen}
        setOpen={setIsPrintModalOpen}
        lectureId={selectedLectureId || ""}
        subjectId={printSubjectId}
        lecturePaperId={printPaperId}
        type={printPaperType}
      />

      {/* 답안입력 모달 */}
      <PaperAnswerInputModal
        open={isAnswerInputOpen}
        setOpen={setIsAnswerInputOpen}
        lecturePaperId={answerInputPaperId}
        type={answerInputPaperType}
      />
      
      {/* 삭제 확인 AlertDialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>시험지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{paperToDelete?.name}" 시험지를 삭제하시겠습니까?
              <br /><br />
              삭제된 시험지는 휴지통으로 이동합니다.
              휴지통의 시험지는 일주일 후에 완전히 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// 메모이제이션된 컴포넌트 내보내기
export const ProblemRepository = memo(ProblemRepositoryComponent)
ProblemRepository.displayName = 'ProblemRepository'