"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  MoreVertical,
  Plus,
  Search,
  Printer,
  Download,
  Edit,
  Copy,
  Trash2,
  Eye,
  Save,
  Sparkles,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Calendar,
} from "lucide-react"

interface ExamPaper {
  id: string
  name: string
  school: string
  problems: number
  date: string
  status: "active" | "draft" | "archived"
  subject: string
  grade: string
}

interface ExamFolder {
  id: string
  name: string
  subject: string
  expanded: boolean
  papers: ExamPaper[]
}

export function ExamManagement() {
  const [selectedFolder, setSelectedFolder] = useState("2025-1-mid")
  const [selectedPaper, setSelectedPaper] = useState<ExamPaper | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("exam")

  const [folders, setFolders] = useState<ExamFolder[]>([
    {
      id: "2024-1-final",
      name: "2024 1학기 기말",
      subject: "미적분학",
      expanded: false,
      papers: [],
    },
    {
      id: "2025-1-mid",
      name: "2025 1학기 중간",
      subject: "미적분학",
      expanded: true,
      papers: [
        {
          id: "1",
          name: "2025 1학기 중간 영생고(미적분)",
          school: "영생고",
          problems: 23,
          date: "2025-01-15",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "2",
          name: "2025 1학기 중간 청천고(미적분)",
          school: "청천고",
          problems: 20,
          date: "2025-01-16",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "3",
          name: "2025 1학기 중간 대명고(미적분)",
          school: "대명고",
          problems: 21,
          date: "2025-01-17",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "4",
          name: "2025 1학기 중간 숙지고(미적분)",
          school: "숙지고",
          problems: 21,
          date: "2025-01-18",
          status: "draft",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "5",
          name: "2025 1학기 중간 수원고(미적분)",
          school: "수원고",
          problems: 19,
          date: "2025-01-19",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "6",
          name: "2025 1학기 중간 수성고(미적분)",
          school: "수성고",
          problems: 21,
          date: "2025-01-20",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "7",
          name: "2025 1학기 중간 영북여고(미적분)",
          school: "영북여고",
          problems: 22,
          date: "2025-01-21",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "8",
          name: "2025 1학기 중간 조원고(미적분)",
          school: "조원고",
          problems: 20,
          date: "2025-01-22",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "9",
          name: "2025 1학기 중간 창성고(미적분)",
          school: "창성고",
          problems: 20,
          date: "2025-01-23",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
        {
          id: "10",
          name: "2025 1학기 중간 창원고(미적분)",
          school: "창원고",
          problems: 20,
          date: "2025-01-24",
          status: "active",
          subject: "미적분",
          grade: "고3",
        },
      ],
    },
    {
      id: "2025-1-final",
      name: "2025 1학기 기말",
      subject: "미적분학",
      expanded: false,
      papers: [],
    },
  ])

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map((folder) => (folder.id === folderId ? { ...folder, expanded: !folder.expanded } : folder)))
  }

  const selectedFolderData = folders.find((f) => f.id === selectedFolder)
  const filteredPapers =
    selectedFolderData?.papers.filter(
      (paper) =>
        paper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.school.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "활성"
      case "draft":
        return "임시저장"
      case "archived":
        return "보관"
      default:
        return status
    }
  }

  // 첫 번째 시험지를 기본 선택
  const defaultPaper = filteredPapers[0] || null
  const currentPaper = selectedPaper || defaultPaper

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">시험지 관리</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">시험지를 생성하고 관리하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="2025-1-mid">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="시험지명" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-1-mid">2025 1학기 중간</SelectItem>
              <SelectItem value="2025-1-final">2025 1학기 기말</SelectItem>
              <SelectItem value="2024-1-final">2024 1학기 기말</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="2025-mid-a">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="2025 1학기(A)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-mid-a">2025 1학기(A)</SelectItem>
              <SelectItem value="2025-mid-b">2025 1학기(B)</SelectItem>
              <SelectItem value="2025-final-a">2025 기말(A)</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
            <Sparkles className="w-4 h-4 mr-2" />
            유사 시험지 제작
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Left Sidebar - Folder Structure */}
        <div className="col-span-3">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg">과목 선택</h3>
              </div>
              <Select defaultValue="미적분학">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="미적분학">미적분학</SelectItem>
                  <SelectItem value="확률과통계">확률과통계</SelectItem>
                  <SelectItem value="기하">기하</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="px-6 pt-0">
              <div className="space-y-2">
                {folders.map((folder) => (
                  <div key={folder.id}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-2 h-auto ${
                        selectedFolder === folder.id
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setSelectedFolder(folder.id)
                        toggleFolder(folder.id)
                      }}
                    >
                      {folder.expanded ? (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      )}
                      <FolderOpen className="w-4 h-4 mr-2" />
                      <span className="text-sm">{folder.name}</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Exam List */}
        <div className="col-span-4">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full flex flex-col">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  시험지 목록
                </h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="시험지 검색..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 flex-1 overflow-auto pt-0">
              <div className="space-y-2">
                {filteredPapers.map((paper, index) => (
                  <div
                    key={paper.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      currentPaper?.id === paper.id
                        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <Badge className={getStatusColor(paper.status)}>{getStatusText(paper.status)}</Badge>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight mb-2">
                          {paper.name}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {paper.problems}문제
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {paper.date}
                          </span>
                        </div>
                      </div>
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
                            <Edit className="w-4 h-4 mr-2" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            복사
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            다운로드
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Exam Preview */}
        <div className="col-span-5">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full flex flex-col">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Input placeholder="시험지" className="w-32 h-8 text-sm" defaultValue="시험지" />
                  <Input placeholder="정답지" className="w-32 h-8 text-sm" defaultValue="정답지" />
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Printer className="w-4 h-4 mr-2" />
                  프린트
                </Button>
              </div>
            </div>
            <div className="px-6 flex-1 pt-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="exam">시험지</TabsTrigger>
                  <TabsTrigger value="answer">정답지</TabsTrigger>
                </TabsList>

                <TabsContent value="exam" className="flex-1 mt-4">
                  <div className="h-full bg-white dark:bg-gray-800 rounded-lg border p-6 overflow-auto">
                    {currentPaper ? (
                      <div className="space-y-6">
                        {/* Exam Header */}
                        <div className="text-center border-b pb-4">
                          <h2 className="text-xl font-bold mb-2">2025 1학기(A)</h2>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>시험지명: {currentPaper.name}</span>
                            <span>시험대비: 학평</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>성명: ___________</span>
                            <span>학번: ___________</span>
                          </div>
                        </div>

                        {/* Sample Problems */}
                        <div className="space-y-6">
                          <div className="problem-item">
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="mt-1">
                                01
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm mb-2">
                                  <span className="text-blue-600 font-medium">D103. 속도와 가속도</span>
                                </p>
                                <p className="text-sm leading-relaxed mb-3">
                                  수직선 위를 움직이는 점 P의 시각 t (t ≥ 0)에서의 위치 x가
                                  <br />x = t³ - 3t² + 2t
                                </p>
                                <p className="text-sm mb-3">일 때, t = 1에서 점 P의 속도와 가속도는? [3점]</p>
                                <div className="grid grid-cols-5 gap-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ①
                                    </span>
                                    <span>-1, -1</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ②
                                    </span>
                                    <span>-1, 0</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ③
                                    </span>
                                    <span>0, 0</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ④
                                    </span>
                                    <span>0, 1</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ⑤
                                    </span>
                                    <span>1, 1</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-blue-100 text-blue-800">개념</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="problem-item">
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="mt-1">
                                03
                              </Badge>
                              <div className="flex-1">
                                <p className="text-sm mb-2">
                                  <span className="text-blue-600 font-medium">D076. 다항함수의 극대와 극소</span>
                                </p>
                                <p className="text-sm leading-relaxed mb-3">
                                  함수 f(x) = 2x³ - 3x² + 2의 극값은? [3.5점]
                                </p>
                                <div className="grid grid-cols-5 gap-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ①
                                    </span>
                                    <span>1</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ②
                                    </span>
                                    <span>2</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ③
                                    </span>
                                    <span>3</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ④
                                    </span>
                                    <span>4</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                      ⑤
                                    </span>
                                    <span>5</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800">개념</Badge>
                              </div>
                            </div>
                          </div>

                          {/* More problems would be rendered here */}
                          <div className="text-center text-gray-500 text-sm py-8">
                            ... 총 {currentPaper.problems}문제 중 2문제 미리보기 ...
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>시험지를 선택하세요</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="answer" className="flex-1 mt-4">
                  <div className="h-full bg-white dark:bg-gray-800 rounded-lg border p-6 overflow-auto">
                    {currentPaper ? (
                      <div className="space-y-6">
                        <div className="text-center border-b pb-4">
                          <h2 className="text-xl font-bold mb-2">정답지</h2>
                          <p className="text-sm text-gray-600">{currentPaper.name}</p>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                          {Array.from({ length: Math.min(currentPaper.problems, 20) }, (_, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                            >
                              <span className="font-medium">{i + 1}번</span>
                              <span className="text-blue-600 font-bold">{Math.floor(Math.random() * 5) + 1}</span>
                            </div>
                          ))}
                        </div>

                        {currentPaper.problems > 20 && (
                          <div className="text-center text-gray-500 text-sm">
                            ... 총 {currentPaper.problems}문제 정답 ...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>시험지를 선택하세요</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
