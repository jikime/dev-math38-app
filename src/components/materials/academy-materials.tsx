"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { useMyLectures } from "@/hooks/use-lecture"
import { FolderView } from "./folder-view"
import { SaveLectureList } from "./save-lecture-list"
import { SaveLecturePapers } from "./save-lecture-papers"
import { SaveLecture } from "@/hooks/use-folders"

export function AcademyMaterials() {
  const [selectedGrade, setSelectedGrade] = useState(9)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLectureId, setSelectedLectureId] = useState<string>("")
  const [selectedFolderId, setSelectedFolderId] = useState<string>("")
  const [saveLectureKeyword, setSaveLectureKeyword] = useState<string>("")
  const [selectedSaveLecture, setSelectedSaveLecture] = useState<SaveLecture | null>(null)

  // API 훅들
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()

  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])

  // 폴더 클릭 핸들러 - 메모이제이션
  const handleFolderClick = useCallback((folderId: string) => {
    setSelectedFolderId(folderId)
    console.log('Selected folder:', folderId)
  }, [])

  // Save Lecture 선택 핸들러 - 메모이제이션
  const handleSaveLectureSelect = useCallback((lecture: SaveLecture) => {
    setSelectedSaveLecture(lecture)
    console.log('Selected save lecture:', lecture)
  }, [])

  // 학년 변경 핸들러 - 메모이제이션
  const handleGradeChange = useCallback((val: string) => {
    const num = val === "0" ? 0 : Number(val);
    setSelectedGrade(num);
  }, [])

  // 검색어 변경 핸들러 - 메모이제이션
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [])

  // Save Lecture 키워드 변경 핸들러 - 메모이제이션
  const handleSaveLectureKeywordChange = useCallback((keyword: string) => {
    setSaveLectureKeyword(keyword);
  }, [])

  // 메모이제이션된 컴포넌트 props
  const folderViewProps = useMemo(() => ({
    grade: selectedGrade,
    onFolderClick: handleFolderClick,
    selectedFolderId: selectedFolderId
  }), [selectedGrade, handleFolderClick, selectedFolderId])

  const saveLectureListProps = useMemo(() => ({
    grade: selectedGrade,
    keyword: saveLectureKeyword,
    onKeywordChange: handleSaveLectureKeywordChange,
    onLectureSelect: handleSaveLectureSelect
  }), [selectedGrade, saveLectureKeyword, handleSaveLectureKeywordChange, handleSaveLectureSelect])

  const saveLecturePapersProps = useMemo(() => ({
    lectureId: selectedSaveLecture?.lectureId,
    lectureName: selectedSaveLecture?.name
  }), [selectedSaveLecture?.lectureId, selectedSaveLecture?.name])

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        {/* 강좌명 선택 */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">강좌명:</label>
          {lecturesLoading ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
          ) : (
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
          )}
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          강좌에 추가
        </Button>
      </div>

      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        {/* 왼쪽 사이드바 */}
        <div className="w-80 flex flex-col space-y-4">
          {/* 학년과 검색을 좌우 정렬 */}
          <div className="flex items-end justify-between gap-4">
            {/* 학년 선택 */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">학년:</label>
              <Select
                value={selectedGrade?.toString()}
                onValueChange={handleGradeChange}
              >
                <SelectTrigger 
                  className="bg-white font-pretendard font-bold"
                  style={{ width: "100%" }}
                >
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">전체</SelectItem>
                  <SelectGroup>
                    <SelectLabel>고등학교</SelectLabel>
                    <SelectItem value="12">고 3학년</SelectItem>
                    <SelectItem value="11">고 2학년</SelectItem>
                    <SelectItem value="10">고 1학년</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>중학교</SelectLabel>
                    <SelectItem value="9">중 3학년</SelectItem>
                    <SelectItem value="8">중 2학년</SelectItem>
                    <SelectItem value="7">중 1학년</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>초등학교</SelectLabel>
                    <SelectItem value="6">초 6학년</SelectItem>
                    <SelectItem value="5">초 5학년</SelectItem>
                    <SelectItem value="4">초 4학년</SelectItem>
                    <SelectItem value="3">초 3학년</SelectItem>
                    <SelectItem value="2">초 2학년</SelectItem>
                    <SelectItem value="1">초 1학년</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* 검색 */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">검색:</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="자료 검색"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* 폴더 및 Save 강좌 목록 */}
          <div className="bg-card text-card-foreground flex flex-col rounded-xl border flex-1 min-h-0">
            {/* 폴더 구조 */}
            <div className="px-6 py-4 border-b">
              <FolderView {...folderViewProps} />
            </div>

            {/* Save 강좌 목록 */}
            <div className="px-6 py-4 flex-1 min-h-0">
              <SaveLectureList {...saveLectureListProps} />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 - Save Lecture Papers */}
        <div className="flex-1 min-w-0">
          <div className="bg-card text-card-foreground h-full rounded-xl border overflow-hidden">
            <SaveLecturePapers {...saveLecturePapersProps} />
          </div>
        </div>
      </div>
    </main>
  )
}
