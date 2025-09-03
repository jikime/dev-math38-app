"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PaperTemplate, type PaperProblem } from "./paper-template"
import type { Problem } from "@/types/problem"
import type { PaperLayoutSettings } from "@/types/paper-view"

// 39math-ui-prime과 동일한 타입 정의
type CacheProblem = {
  index: number
  problemId: string
  problem: Problem
}

type PaperPage = {
  leftSet: PaperProblem[]
  rightSet?: PaperProblem[]
  pageNumber: number
  solutions: boolean
}

interface PaperViewSheetProps {
  problems: Problem[]
  settings: PaperLayoutSettings
  title?: string
  subjectName?: string
  teacherName?: string
  academyName?: string
  editMode?: boolean
  editProblem?: (problem: Problem) => void
  removeProblem?: (problemId: string) => void
  changeProblem?: (paperProblem: PaperProblem, skillId: string | undefined) => void
  onHeightChange?: (totalPages: number) => void
  onPrintEnd?: () => void
  printMeta?: boolean
}

/**
 * 39math-ui-prime과 동일한 시험지 생성 컴포넌트
 * 문제의 실제 높이를 측정하여 정확한 페이지 분할 수행
 */
export function PaperViewSheet({ 
  problems, 
  settings, 
  title = "수학 시험지",
  subjectName = "수학",
  teacherName,
  academyName = "수학생각",
  editMode = false,
  editProblem,
  removeProblem,
  changeProblem,
  onHeightChange,
  onPrintEnd,
  printMeta = false
}: PaperViewSheetProps) {
  
  // 39math-ui-prime과 동일한 상태 관리
  const [cachingProblem, setCachingProblem] = useState<CacheProblem>()
  const [caching, setCaching] = useState(true)
  const [heights, setHeights] = useState<number[]>([])
  const [pages, setPages] = useState<PaperPage[]>([])
  
  const isMounted = useRef(false)

  // 39math-ui-prime과 동일한 높이 측정 로직
  useEffect(() => {
    if (!problems) return
    if (problems && problems.length > 0) {
      // heights 값이 이미 측정된 높이를 가지고 있는지 확인
      const hasAllHeights = problems.every(
        (p) => p.printHeight && p.printHeight > 0
      )

      if (hasAllHeights) {
        // heights를 printHeight 값으로 설정
        setHeights(problems.map((p) => p.printHeight || 0))
        setCaching(false)
        startPrint()
      } else {
        // 높이가 없는 경우에만 캐싱 시작
        setHeights(problems.map(() => 0))
        setCaching(true)
        cachingHeight(0)
      }
    } else {
      startPrint()
      onPrintEnd && onPrintEnd()
    }
  }, [problems])

  useEffect(() => {
    if (!caching) {
      startPrint()
    }
  }, [caching, settings.columns, settings.minMargin])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    if (!caching && pages && pages.length > 0) {
      // 페이지 렌더링이 완료된 후 onPrintEnd 호출
      onPrintEnd && onPrintEnd()
    }
  }, [pages, caching])

  const cachingHeight = (index: number) => {
    setCachingProblem({
      index: index + 1,
      problemId: problems[index].problemId!,
      problem: problems[index],
    })
  }

  const setHeight = (index: number | undefined, height: number) => {
    if (!index) { index = 1 }
    heights[index - 1] = height;
    setHeights([...heights]); // 배열 복사하여 상태 업데이트
    if (index < problems.length) {
      setTimeout(() => cachingHeight(index), 20);
    } else {
      setCaching(false);
      // 모든 문제의 높이가 새로 측정된 경우에만 서버에 업데이트
      const needUpdate = problems.some((p, i) => p.printHeight !== heights[i]);
      if (needUpdate) {
        updateProblemHeights();
      }
    }
  }

  // 39math-ui-prime과 동일한 서버 업데이트 함수
  const updateProblemHeights = async () => {
    // 업데이트가 필요한 문제만 필터링
    const problemHeightList = problems
      .map((p, i) => {
        if (p.printHeight !== heights[i]) {
          p.printHeight = heights[i]; // 새로운 높이로 업데이트
          return {
            problemId: p.problemId,
            height: heights[i],
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    if (problemHeightList.length > 0) {
      try {
        // dev-math38의 API 구조에 맞게 조정 (실제 구현시 적절한 엔드포인트로 변경)
        console.log("문제 높이 업데이트:", problemHeightList);
        // TODO: 실제 API 호출 구현
        // const response = await fetch('/api/problems/update-heights', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(problemHeightList)
        // });
        // if (response.ok) {
        //   console.log("문제 높이 업데이트 성공");
        // } else {
        //   console.error("문제 높이 업데이트 실패");
        // }
      } catch (error) {
        console.error("문제 높이 업데이트 오류:", error);
      }
    }
  }

  const columnHeight = 940 // colheight
  const minMargin = settings.minMargin || 30

  // 39math-ui-prime의 rearrange 함수와 동일한 로직
  const rearrange = (set: PaperProblem[]) => {
    if (!set || set.length === 0) return
    const totalProblemHeight = set.reduce((a, v) => a + (v.height || 30), 0)
    let margin = (columnHeight - totalProblemHeight) / set.length
    console.log(`Rearrange: columnHeight=${columnHeight}, totalHeight=${totalProblemHeight}, problems=${set.length}, calculatedMargin=${margin}`)
    set.map((v) => {
      v.margin = margin
      console.log(`Problem ${v.problemNumber}: height=${v.height}, margin=${v.margin}`)
    })
  }

  // 39math-ui-prime startPrint 함수와 동일한 로직
  const startPrint = () => {

    let _columns: PaperProblem[][] = []
    let sum = 0
    let set: PaperProblem[] = []
    _columns.push(set)

    for (let i = 0; i < heights.length; i++) {
      sum += heights[i] + minMargin
      if (sum > columnHeight) {
        // set 을 정리하고 새로운 set을 만든다
        rearrange(set)
        set = []
        if (!problems[i]) continue
        set.push({
          problem: problems[i],
          problemId: problems[i].problemId!,
          height: heights[i],
          problemNumber: (i + 1).toString(),
          margin: minMargin,
          ltype: problems[i].ltype,
          index: i
        })
        _columns.push(set)
        sum = heights[i]
      } else {
        if (!problems[i]) continue
        set.push({
          problem: problems[i],
          problemId: problems[i].problemId!,
          height: heights[i],
          problemNumber: (i + 1).toString(),
          margin: minMargin,
          ltype: problems[i].ltype,
          index: i
        })
      }
    }

    // 마지막 set도 rearrange 호출
    if (set.length > 0) {
      rearrange(set)
    }

    let _pages: PaperPage[] = []
    for (let i = 0; i < _columns.length; i++) {
      if (settings.columns === 1) {
        _pages.push({
          leftSet: _columns[i],
          pageNumber: i + 1,
          solutions: false,
        })
      } else if (settings.columns === 2) {
        _pages.push({
          leftSet: _columns[i],
          rightSet: i + 1 < _columns.length ? _columns[i + 1] : [],
          pageNumber: (i + 2) / 2,
          solutions: false,
        })
        i++
      }
    }
    setPages(_pages)
  }

  // 페이지 수 변경 알림
  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(pages.length)
    }
  }, [pages.length, onHeightChange])

  if (!problems.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">표시할 문제가 없습니다</div>
          <div className="text-sm">필터를 조정해보세요</div>
        </div>
      </div>
    )
  }

  return (
    <div id="paperprint" className="overflow-scroll">
      {caching && (
        <>
          <div style={{ position: "absolute", left: -400 }}>
            {cachingProblem && (
              <div
                key={cachingProblem.problemId}
                style={{
                  width: settings.columns === 1 ? 740 : 360,
                  visibility: "hidden"
                }}
              >
                <div
                  className="problem"
                  ref={(el) => {
                    if (el) {
                      // 높이 측정 후 setHeight 호출
                      setTimeout(() => {
                        const height = el.offsetHeight || 150
                        setHeight(cachingProblem.index, height)
                      }, 100)
                    }
                  }}
                >
                  <div className="content">
                    <div className="problem-number">
                      {cachingProblem.index}
                    </div>
                    <div
                      className="problem-content"
                      dangerouslySetInnerHTML={{
                        __html: cachingProblem.problem.content.value || "문제 내용이 없습니다."
                      }}
                    />
                  </div>
                  {cachingProblem.problem.content.answerType === "choice" && (
                    <div className="choice-list">
                      {cachingProblem.problem.content.choice?.values?.map((choiceValue, index) => (
                        <div key={index} className="choice">
                          <span className="choice-num">{"①②③④⑤"[index]}</span>
                          <span
                            className="choice-value"
                            dangerouslySetInnerHTML={{ __html: choiceValue }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center w-full h-[80vh]">
            <div>프린트를 준비중입니다....</div>
            <div>
              {heights.filter((h) => h > 0).length} / {problems.length}
            </div>
          </div>
        </>
      )}
      {!caching && pages && (
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="py-4">
            {pages.map((page, pageIndex) => (
              <PaperTemplate
                key={pageIndex}
                title={title || "수학 시험지"}
                subjectName={subjectName}
                teacherName={teacherName}
                academyName={academyName}
                pageNumber={page.pageNumber}
                leftSet={page.leftSet}
                rightSet={page.rightSet}
                settings={settings}
                editMode={editMode}
                editProblem={editProblem}
                removeProblem={removeProblem}
                changeProblem={changeProblem}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}