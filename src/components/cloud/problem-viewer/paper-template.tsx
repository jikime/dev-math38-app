"use client"

import { Button } from "@/components/ui/button"
import { Edit, X, RotateCw } from "lucide-react"
import type { Problem } from "@/types/problem"
import type { PaperLayoutSettings } from "@/types/paper-view"
import { cn } from "@/lib/utils"
import { useRef, useEffect } from "react"

// 39math-ui-prime constants
const NUM = ["①", "②", "③", "④", "⑤"]

// 39math-ui-prime util functions
const getProblemLtypeName = (ltype: string) => {
  switch (ltype) {
    case "calc":
      return "계산";
    case "unds":
      return "이해";
    case "resn":
      return "추론";
    case "soln":
      return "해결";
    default:
      return "미지정";
  }
}

const getProblemLevelName = (difficulty: string) => {
  switch (difficulty) {
    case "1":
      return "최하";
    case "2":
      return "하";
    case "3":
      return "중";
    case "4":
      return "상";
    case "5":
      return "최상";
    default:
      return "-";
  }
}

// 시험지용 문제 타입 (39math-ui-prime과 동일한 구조)
export interface PaperProblem {
  problemNumber: string
  problemId: string
  problem: Problem
  index: number
  margin?: number
  height?: number
  level?: number
  ltype?: string
  answerType?: string
  skillId?: string
  skillName?: string
}

interface OverButtonsProps {
  paperProblem: PaperProblem
  editProblem?: (problem: Problem) => void
  removeProblem?: (problemId: string) => void
  changeProblem?: (paperProblem: PaperProblem, skillId: string | undefined) => void
}

const OverButtons = ({
  paperProblem,
  editProblem,
  removeProblem,
  changeProblem
}: OverButtonsProps) => {
  const skillId = paperProblem?.problem.tags?.find((t) => t.type === "skill")?.skillId

  return (
    <div className="over-buttons absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {skillId && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          title="같은 유형의 문제로 교체합니다"
          onClick={() => changeProblem?.(paperProblem, skillId)}
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        title="문제를 수정합니다"
        onClick={() => editProblem?.(paperProblem.problem)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        title="시험지에서 문제를 삭제합니다"
        onClick={() => removeProblem?.(paperProblem.problemId)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

// 39math-ui-prime 스타일의 ProblemView 컴포넌트
interface ProblemViewProps {
  problem: Problem
  problemNumber?: number
  width?: number
  maxWidth?: number
  resolveHeight?: (num: number | undefined, height: number) => void
  solution?: boolean
  margin?: number
  editProblem?: (p: Problem) => void
  print?: boolean
  printMeta?: boolean
}

function ProblemView({ 
  problem,
  width = 360,
  maxWidth = 480,
  problemNumber,
  resolveHeight,
  solution,
  margin,
  editProblem,
  print = false,
  printMeta = false,
}: ProblemViewProps) {
  const problemEle = useRef<HTMLDivElement>(null)

  // 문제의 높이를 계산하여 부모 컴포넌트에 전달
  useEffect(() => {
    const fn = () => {
      if (problemEle.current) {
        resolveHeight &&
          resolveHeight(problemNumber, problemEle.current.offsetHeight || 30)
      }
    }

    if (resolveHeight) {
      if (problem.printHeight && problem.printHeight !== 0) {
        // 이미 측정된 높이가 있는 경우 즉시 호출
        fn()
      } else {
        const timerId = setTimeout(fn, 100)
        return () => clearTimeout(timerId) // 컴포넌트 언마운트 시 타이머 정리
      }
    }
  }, [problem])

  // 문제 데이터가 없는 경우 처리
  if (!problem || !problem.content) {
    return (
      <div
        className="problem"
        style={{ minWidth: width, maxWidth: maxWidth, marginBottom: margin }}
        ref={problemEle}
      >
        {"문제가 삭제됨"}
      </div>
    )
  }

  let { value, answerType, choice } = problem.content

  return (
    <div
      className="problem py-2"
      style={print ? { width } : { minWidth: width, maxWidth: maxWidth, marginBottom: margin }}
      ref={problemEle}
      id={problem.problemId}
    >
      <div className="content">
        {problemNumber && (
          <div
            className="problem-number hover:text-red-600 cursor-pointer"
            onClick={() => editProblem && editProblem(problem)}
          >
            {problemNumber}
          </div>
        )}
        <div
          className="problem-content"
          dangerouslySetInnerHTML={{ __html: value }}
        ></div>
      </div>
      {answerType === "choice" && (
        <div className="choice-list">
          {choice &&
            NUM.map((n, index) => (
              <div
                key={index}
                className={
                  "choice " +
                  choice?.alignType +
                  (choice?.alignNumTop ? "" : " num-center")
                }
              >
                <span className="choice-num">{n}</span>
                <span
                  className="choice-value"
                  dangerouslySetInnerHTML={{
                    __html: choice?.values[index] || "",
                  }}
                ></span>
              </div>
            ))}
        </div>
      )}
      {printMeta && (
        <div className="w-full flex space-x-2 justify-end">
          <div className="border border-slate-500 rounded-md text-xs px-1">
            {getProblemLtypeName(problem.ltype)}
          </div>
          <div className="border border-slate-500 rounded-md text-xs px-1">
            {getProblemLevelName(problem.difficulty)}
          </div>
        </div>
      )}
      {solution && (
        <div
          className="problem-solution"
          dangerouslySetInnerHTML={{ __html: problem.solution?.value }}
        ></div>
      )}
    </div>
  )
}

interface PaperTemplateProps {
  title: string
  subjectName?: string
  teacherName?: string
  academyName?: string
  pageNumber: number
  leftSet: PaperProblem[]
  rightSet?: PaperProblem[] | null
  settings: PaperLayoutSettings
  editMode?: boolean
  editProblem?: (problem: Problem) => void
  removeProblem?: (problemId: string) => void
  changeProblem?: (paperProblem: PaperProblem, skillId: string | undefined) => void
}

export function PaperTemplate({
  title,
  subjectName,
  teacherName,
  academyName = "수학생각",
  pageNumber,
  leftSet,
  rightSet,
  settings,
  editMode = false,
  editProblem,
  removeProblem,
  changeProblem
}: PaperTemplateProps) {
  const { columns } = settings

  return (
    <div className="page academy-paper">
      {/* 헤더 테이블 */}
      <div className="header">
        <table className="header-table">
          <tbody>
            <tr>
              <td width="130px"> 과목 </td>
              <td rowSpan={2}>{title}</td>
              <td width="100px"> 담당 </td>
            </tr>
            <tr>
              <td>{subjectName || " "}</td>
              <td>{teacherName || " "}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 본문 */}
      <div className="body">
        <div className="column-left">
          <div className="empty"></div>
          <div className="problem-column">
            {leftSet?.map((p) => (
              <div
                key={p.problemNumber}
                className={cn("problem-sect", { edit: editMode })}
              >
                <ProblemView
                  problem={p.problem}
                  problemNumber={parseInt(p.problemNumber)}
                  width={columns === 1 ? 740 : 360}
                />
                {editMode && (
                  <OverButtons
                    paperProblem={p}
                    editProblem={editProblem}
                    removeProblem={removeProblem}
                    changeProblem={changeProblem}
                  />
                )}
              </div>
            ))}
            <div className="empty-problem"></div>
          </div>
        </div>
        
        {/* 구분선 (2단 이상일 때) */}
        {columns > 1 && rightSet && rightSet.length > 0 && (
          <div className="divider"></div>
        )}

        {/* 오른쪽 컬럼 (2단 이상일 때) */}
        {columns > 1 && rightSet && rightSet.length > 0 && (
          <div className="column-right">
            <div className="empty"></div>
            <div className="problem-column">
              {rightSet.map((p) => (
                <div
                  key={p.problemNumber}
                  className={cn("problem-sect", { edit: editMode })}
                >
                  <ProblemView
                    problem={p.problem}
                    problemNumber={parseInt(p.problemNumber)}
                    width={370}
                  />
                  {editMode && (
                    <OverButtons
                      paperProblem={p}
                      editProblem={editProblem}
                      removeProblem={removeProblem}
                      changeProblem={changeProblem}
                    />
                  )}
                </div>
              ))}
              <div className="empty-problem"></div>
            </div>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="footer">
        <div className="page-info">
          <span>- {pageNumber} -</span>
        </div>
        <div className="academy-info">
          <span>{academyName}</span>
        </div>
      </div>
    </div>
  )
}