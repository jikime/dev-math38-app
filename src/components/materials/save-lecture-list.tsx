"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from "lucide-react"
import { 
  SaveLecture, 
  SaveLectureListParams, 
  useSaveLectures 
} from "@/hooks/use-folders"

interface SaveLectureListProps {
  grade: number | undefined
  keyword: string
  onKeywordChange: (keyword: string) => void
  onLectureSelect?: (lecture: SaveLecture) => void
}

export function SaveLectureList({ 
  grade, 
  keyword, 
  onKeywordChange, 
  onLectureSelect 
}: SaveLectureListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null)
  
  const saveLecturesMutation = useSaveLectures(null)

  // 데이터 로드
  const loadSaveLectures = (pageNum: number = 1) => {
    if (grade !== undefined) {
      const params: SaveLectureListParams = {
        grade,
        keyword,
        pageNum,
        size: 30
      }
      saveLecturesMutation.mutate(params)
      setCurrentPage(pageNum)
    }
  }

  // grade 변경 시 데이터 로드
  useEffect(() => {
    if (grade !== undefined) {
      loadSaveLectures(1)
    }
  }, [grade])

  // keyword 변경 시 검색
  const handleSearch = () => {
    loadSaveLectures(1)
  }

  // 강의 선택 핸들러
  const handleLectureClick = (lecture: SaveLecture) => {
    setSelectedLectureId(lecture.lectureId)
    onLectureSelect?.(lecture)
  }

  const { data: response, isPending, error } = saveLecturesMutation

  if (!grade) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">학년을 선택해주세요</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 검색 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Save 강좌 검색"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            className="pr-10"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full px-3"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 강의 목록 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2">
        {isPending ? (
          <div className="text-center py-8">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        ) : response && response.content.length > 0 ? (
          <>
            {response.content.map((lecture) => (
              <div
                key={lecture.lectureId}
                onClick={() => handleLectureClick(lecture)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLectureId === lecture.lectureId
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <BookOpen className={`w-4 h-4 flex-shrink-0 ${
                      selectedLectureId === lecture.lectureId ? "text-blue-600" : "text-gray-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        selectedLectureId === lecture.lectureId ? "text-blue-800" : "text-gray-900"
                      }`}>
                        {lecture.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(lecture.created).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        selectedLectureId === lecture.lectureId 
                          ? "border-blue-300 text-blue-700" 
                          : ""
                      }`}
                    >
                      {lecture.paperCount}개 시험지
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">검색 결과가 없습니다.</p>
            {keyword && (
              <p className="text-sm text-gray-400 mt-1">
                '{keyword}'로 검색한 결과입니다.
              </p>
            )}
          </div>
        )}
        </div>
      </div>

      {/* 페이지네이션 - 고정 Footer */}
      {response && response.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t mt-4 bg-white">
          <div className="text-sm text-gray-500">
            총 {response.totalElements}개 강좌 (페이지 {response.number + 1} / {response.totalPages})
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={response.first}
              onClick={() => loadSaveLectures(currentPage - 1)}
            >
              이전
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={response.last}
              onClick={() => loadSaveLectures(currentPage + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}