"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, BookOpen, Grid3X3, List } from "lucide-react"
import { SaveLecturePaper, useSaveLecturePapers } from "@/hooks/use-folders"
import { getSubjectTitle } from "@/lib/tag-utils"

interface SaveLecturePapersProps {
  lectureId: string | undefined
  lectureName?: string
}

export function SaveLecturePapers({ lectureId, lectureName }: SaveLecturePapersProps) {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const { data: papers, isLoading, error } = useSaveLecturePapers(lectureId)

  // 체크박스 관련 함수들
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
      setSelectAll(false)
    } else {
      const allIds = papers?.map(paper => paper.lecturePaperId) || []
      setSelectedItems(allIds)
      setSelectAll(true)
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSelected = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
      
      // 전체 선택 상태 업데이트
      setSelectAll(newSelected.length === (papers?.length || 0) && (papers?.length || 0) > 0)
      
      return newSelected
    })
  }

  // 과목 정보 가져오기
  const getSubject = (subjectId: number) => {
    const { title, color, tag } = getSubjectTitle(subjectId);
    return (
      <div className={`text-center ${color}`}>
        {tag}
      </div>
    );
  }


  // 난이도 그래프 렌더링 (problem-repository 스타일)
  const renderDifficultyGraph = (paper: SaveLecturePaper) => {
    // 5단계를 3단계로 변환: 1,2레벨=쉬움, 3레벨=보통, 4,5레벨=어려움
    const easyQuestions = (paper.counts.level1 || 0) + (paper.counts.level2 || 0)
    const mediumQuestions = paper.counts.level3 || 0
    const hardQuestions = (paper.counts.level4 || 0) + (paper.counts.level5 || 0)
    const totalQuestions = paper.counts.count
    
    const easyPercent = totalQuestions > 0 ? Math.round((easyQuestions / totalQuestions) * 100) : 0
    const mediumPercent = totalQuestions > 0 ? Math.round((mediumQuestions / totalQuestions) * 100) : 0
    const hardPercent = totalQuestions > 0 ? Math.round((hardQuestions / totalQuestions) * 100) : 0
    
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
                  쉬움: {easyQuestions}개 ({easyPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  보통: {mediumQuestions}개 ({mediumPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  어려움: {hardQuestions}개 ({hardPercent}%)
                </span>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </div>
      </div>
    )
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">시험지 목록을 불러오는 중...</div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">시험지 목록을 불러오는 중 오류가 발생했습니다.</div>
      </div>
    )
  }

  // 선택된 강의가 없는 경우
  if (!lectureId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">왼쪽에서 강의를 선택해주세요</p>
        </div>
      </div>
    )
  }

  // 시험지가 없는 경우
  if (!papers || papers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">해당 강의에 시험지가 없습니다.</p>
          {lectureName && (
            <p className="text-sm text-gray-400 mt-1">강의: {lectureName}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* 헤더 */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">시험지 목록</h3>
            {lectureName && (
              <p className="text-sm text-gray-600 mt-1">강의: {lectureName}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>총 {papers.length}개 시험지</span>
            </div>
          </div>
          
          {/* 뷰 전환 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card')}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              카드
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4 mr-2" />
              테이블
            </Button>
          </div>
        </div>
      </div>

      {/* 시험지 목록 */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {viewMode === 'card' ? (
          // 카드 뷰
          <div className="space-y-3">
            {papers.map((paper) => (
              <Card key={paper.lecturePaperId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* 제목 및 기본 정보 */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {paper.paperIndex}. {paper.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{paper.range}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(paper.created).toLocaleDateString('ko-KR')} 생성
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {paper.type}
                      </Badge>
                    </div>

                    {/* 문항 정보 */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">총 문항:</span>
                        <Badge variant="secondary">{paper.counts.count}개</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">객관식:</span>
                        <Badge variant="outline">{paper.counts.countChoice}개</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">주관식:</span>
                        <Badge variant="outline">{paper.counts.countEssay}개</Badge>
                      </div>
                    </div>

                    {/* 난이도 분포 */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">난이도 분포</div>
                      <div className="space-y-2">
                        {renderDifficultyGraph(paper)}
                      </div>
                    </div>

                    {/* 성과 정보 (있는 경우) */}
                    {(paper.paperCount > 0 || paper.finishedCount > 0 || paper.average > 0) && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {paper.paperCount > 0 && (
                            <span>응시: {paper.paperCount}명</span>
                          )}
                          {paper.finishedCount > 0 && (
                            <span>완료: {paper.finishedCount}명</span>
                          )}
                          {paper.average > 0 && (
                            <span>평균: {paper.average.toFixed(1)}점</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // 테이블 뷰
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
                  <TableHead style={{ width: "180px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">문항수 (주관식/객관식)</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {papers.map((paper) => (
                  <TableRow key={paper.lecturePaperId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedItems.includes(paper.lecturePaperId)}
                        onCheckedChange={() => handleSelectItem(paper.lecturePaperId)}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        {getSubject(paper.subjectId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {paper.range && <div className="text-sm text-gray-600 dark:text-gray-400 break-words whitespace-normal">{paper.range}</div>}
                        <div className="font-medium text-lg text-gray-800 dark:text-gray-200 break-words whitespace-normal">
                          {paper.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="space-y-2 w-full">
                        {renderDifficultyGraph(paper)}
                        <div className="flex justify-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <span>총 {paper.counts.count}문항 ({paper.counts.countEssay}/{paper.counts.countChoice})</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}