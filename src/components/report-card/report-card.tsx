"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Medal,
  Users,
  FileText,
  Download,
  Printer,
  Search,
  Award,
  BookOpen,
} from "lucide-react"

interface Student {
  id: string
  name: string
  score: number
  rank: number
  previousScore?: number
  weakAreas: string[]
  strongAreas: string[]
  testCount: number
  averageScore: number
  improvement: number
}

interface ExamResult {
  id: string
  name: string
  date: string
  totalQuestions: number
  participants: number
  averageScore: number
  highestScore: number
  lowestScore: number
  difficulty: "상" | "중" | "하"
}

export function ReportCard() {
  const [activeTab, setActiveTab] = useState("exam-based")
  const [selectedExam, setSelectedExam] = useState<string>("exam-1")
  const [selectedStudent, setSelectedStudent] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1month")
  const [searchTerm, setSearchTerm] = useState("")

  const exams: ExamResult[] = [
    {
      id: "exam-1",
      name: "2025 1학기 중간고사 - 미적분",
      date: "2025-01-15",
      totalQuestions: 20,
      participants: 45,
      averageScore: 78.5,
      highestScore: 98,
      lowestScore: 42,
      difficulty: "중",
    },
    {
      id: "exam-2",
      name: "2025 1학기 모의고사 - 미적분",
      date: "2025-01-08",
      totalQuestions: 25,
      participants: 43,
      averageScore: 72.3,
      highestScore: 95,
      lowestScore: 38,
      difficulty: "상",
    },
  ]

  const students: Student[] = [
    {
      id: "1",
      name: "김수학",
      score: 98,
      rank: 1,
      previousScore: 85,
      weakAreas: ["삼각함수", "로그함수"],
      strongAreas: ["미분", "적분"],
      testCount: 8,
      averageScore: 89.5,
      improvement: 13,
    },
    {
      id: "2",
      name: "이공식",
      score: 95,
      rank: 2,
      previousScore: 92,
      weakAreas: ["극한"],
      strongAreas: ["미분", "함수"],
      testCount: 8,
      averageScore: 91.2,
      improvement: 3,
    },
    {
      id: "3",
      name: "박함수",
      score: 92,
      rank: 3,
      previousScore: 88,
      weakAreas: ["적분", "함수의 극한"],
      strongAreas: ["미분계수"],
      testCount: 7,
      averageScore: 87.8,
      improvement: 4,
    },
    {
      id: "4",
      name: "정미분",
      score: 89,
      rank: 4,
      previousScore: 91,
      weakAreas: ["함수의 연속성"],
      strongAreas: ["도함수", "적분"],
      testCount: 8,
      averageScore: 88.9,
      improvement: -2,
    },
    {
      id: "5",
      name: "최적분",
      score: 87,
      rank: 5,
      previousScore: 82,
      weakAreas: ["삼각함수", "지수함수"],
      strongAreas: ["미분", "함수"],
      testCount: 6,
      averageScore: 84.3,
      improvement: 5,
    },
  ]

  const selectedExamData = exams.find((exam) => exam.id === selectedExam)
  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{rank}</span>
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return "text-green-600"
    if (improvement < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4" />
    if (improvement < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 dark:bg-green-900/20"
    if (score >= 80) return "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
    if (score >= 70) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
    return "text-red-600 bg-red-50 dark:bg-red-900/20"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">성적표</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">시험 결과를 분석하고 학생별 성취도를 확인하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            인쇄
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exam-based" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            시험지별 성적표
          </TabsTrigger>
          <TabsTrigger value="student-based" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            학생별 성적표
          </TabsTrigger>
        </TabsList>

        {/* 시험지별 성적표 */}
        <TabsContent value="exam-based" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="시험 선택" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedExamData && (
            <>
              {/* 시험 정보 카드 */}
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                  <h3 className="leading-none font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    시험 정보
                  </h3>
                </div>
                <div className="px-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedExamData.totalQuestions}</div>
                      <div className="text-sm text-gray-600">총 문항수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedExamData.participants}</div>
                      <div className="text-sm text-gray-600">응시자 수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedExamData.averageScore}</div>
                      <div className="text-sm text-gray-600">평균 점수</div>
                    </div>
                    <div className="text-center">
                      <Badge className="text-sm px-3 py-1">난이도: {selectedExamData.difficulty}</Badge>
                      <div className="text-sm text-gray-600 mt-1">{selectedExamData.date}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 성적 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                  <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
                    <h3 className="leading-none font-semibold text-lg">점수 분포</h3>
                  </div>
                  <div className="px-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">90점 이상</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-3/5 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">12명</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">80-89점</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">18명</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">70-79점</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-2/5 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">10명</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">60점 미만</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div className="w-1/5 h-2 bg-red-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">5명</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                  <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
                    <h3 className="leading-none font-semibold text-lg">난이도별 정답률</h3>
                  </div>
                  <div className="px-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>상 (5문제)</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div className="w-[45%] h-2 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>중 (10문제)</span>
                          <span>72%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div className="w-[72%] h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>하 (5문제)</span>
                          <span>89%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div className="w-[89%] h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                  <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
                    <h3 className="leading-none font-semibold text-lg">성적 요약</h3>
                  </div>
                  <div className="px-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">최고점</span>
                        <span className="font-medium text-green-600">{selectedExamData.highestScore}점</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">평균점</span>
                        <span className="font-medium text-blue-600">{selectedExamData.averageScore}점</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">최저점</span>
                        <span className="font-medium text-red-600">{selectedExamData.lowestScore}점</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">표준편차</span>
                        <span className="font-medium">12.4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 학생별 순위 */}
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="leading-none font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      학생별 순위
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="학생 검색..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-6">
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {getRankIcon(student.rank)}
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>취약: {student.weakAreas.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold px-3 py-1 rounded ${getScoreColor(student.score)}`}>
                              {student.score}점
                            </div>
                            {student.previousScore && (
                              <div
                                className={`text-sm flex items-center gap-1 ${getImprovementColor(student.improvement)}`}
                              >
                                {getImprovementIcon(student.improvement)}
                                {student.improvement > 0 ? "+" : ""}
                                {student.improvement}점
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* 학생별 성적표 */}
        <TabsContent value="student-based" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="학생 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 학생</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">최근 1주일</SelectItem>
                <SelectItem value="1month">최근 1개월</SelectItem>
                <SelectItem value="3months">최근 3개월</SelectItem>
                <SelectItem value="6months">최근 6개월</SelectItem>
                <SelectItem value="custom">사용자 지정</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStudent === "all" ? (
            <>
              {/* 전체 학생 성적 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <div key={student.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="leading-none font-semibold text-lg">{student.name}</h3>
                        {getRankIcon(student.rank)}
                      </div>
                    </div>
                    <div className="px-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{student.testCount}</div>
                            <div className="text-xs text-gray-600">응시 횟수</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{student.averageScore}</div>
                            <div className="text-xs text-gray-600">평균 점수</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>점수 추이</span>
                            <span className={getImprovementColor(student.improvement)}>
                              {student.improvement > 0 ? "+" : ""}
                              {student.improvement}점
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${(student.averageScore / 100) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-2">강점 영역</div>
                          <div className="flex flex-wrap gap-1">
                            {student.strongAreas.map((area, index) => (
                              <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium mb-2">약점 영역</div>
                          <div className="flex flex-wrap gap-1">
                            {student.weakAreas.map((area, index) => (
                              <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="text-center pt-2">
                          <div className={`text-lg font-bold px-3 py-1 rounded ${getScoreColor(student.score)}`}>
                            최근 점수: {student.score}점
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 전체 비교 테이블 */}
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                  <h3 className="leading-none font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    전체 학생 성적 비교
                  </h3>
                </div>
                <div className="px-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">순위</th>
                          <th className="text-left p-3">이름</th>
                          <th className="text-center p-3">응시 횟수</th>
                          <th className="text-center p-3">평균 점수</th>
                          <th className="text-center p-3">최근 점수</th>
                          <th className="text-center p-3">향상도</th>
                          <th className="text-left p-3">약점 영역</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {getRankIcon(student.rank)}
                                <span className="font-medium">{student.rank}위</span>
                              </div>
                            </td>
                            <td className="p-3 font-medium">{student.name}</td>
                            <td className="p-3 text-center">{student.testCount}회</td>
                            <td className="p-3 text-center font-medium">{student.averageScore}점</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(student.score)}`}>
                                {student.score}점
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div
                                className={`flex items-center justify-center gap-1 ${getImprovementColor(student.improvement)}`}
                              >
                                {getImprovementIcon(student.improvement)}
                                <span className="font-medium">
                                  {student.improvement > 0 ? "+" : ""}
                                  {student.improvement}점
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {student.weakAreas.slice(0, 2).map((area, index) => (
                                  <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                                    {area}
                                  </Badge>
                                ))}
                                {student.weakAreas.length > 2 && (
                                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                                    +{student.weakAreas.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // 개별 학생 상세 분석
            <div className="space-y-6">
              {/* 개별 학생 분석 내용 */}
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                  <h3 className="leading-none font-semibold">개별 학생 상세 분석</h3>
                </div>
                <div className="px-6">
                  <div className="text-center text-gray-500 py-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>개별 학생 분석 기능은 곧 추가될 예정입니다.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
