"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  MoreVertical,
  Search,
  Download,
  Edit,
  Copy,
  Trash2,
  Eye,
  Upload,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  File,
  ImageIcon,
  BarChart3,
  Type,
  Archive,
  Cloud,
  HardDrive,
  Users,
  FileSpreadsheet,
} from "lucide-react"

interface CloudFile {
  id: string
  name: string
  type: "hwp" | "pdf" | "doc" | "xlsx" | "image"
  size: string
  problems?: number
  date: string
  folder: string
}

interface CloudFolder {
  id: string
  name: string
  subject: string
  expanded: boolean
  files: CloudFile[]
}

export function CloudStorage() {
  const [selectedFolder, setSelectedFolder] = useState("2025-1-final")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const [folders, setFolders] = useState<CloudFolder[]>([
    {
      id: "2024-1-final",
      name: "2024 1학기 기말",
      subject: "미적분학",
      expanded: false,
      files: [],
    },
    {
      id: "2025-1-mid",
      name: "2025 1학기 중간",
      subject: "미적분학",
      expanded: false,
      files: [],
    },
    {
      id: "2025-1-final",
      name: "2025 1학기 기말",
      subject: "미적분학",
      expanded: true,
      files: [
        {
          id: "1",
          name: "25년 1학기 기말 대금고 미적분.hwp",
          type: "hwp",
          size: "2.3MB",
          problems: 19,
          date: "2025-01-15",
          folder: "2025-1-final",
        },
        {
          id: "2",
          name: "25년 중앙고 미적분 1학기 기말.pdf",
          type: "pdf",
          size: "1.8MB",
          problems: 20,
          date: "2025-01-16",
          folder: "2025-1-final",
        },
        {
          id: "3",
          name: "2025년_1기말_서울고3_미적분.hwp",
          type: "hwp",
          size: "2.1MB",
          problems: 22,
          date: "2025-01-17",
          folder: "2025-1-final",
        },
        {
          id: "4",
          name: "2025 1학기 기말 대명고(미적분).pdf",
          type: "pdf",
          size: "1.9MB",
          problems: 20,
          date: "2025-01-18",
          folder: "2025-1-final",
        },
        {
          id: "5",
          name: "2025 1학기 기말 천성고(미적분).pdf",
          type: "pdf",
          size: "2.0MB",
          problems: 20,
          date: "2025-01-19",
          folder: "2025-1-final",
        },
        {
          id: "6",
          name: "2025 1학기 기말 수성고(미적분).pdf",
          type: "pdf",
          size: "1.7MB",
          problems: 21,
          date: "2025-01-20",
          folder: "2025-1-final",
        },
        {
          id: "7",
          name: "2025년_1기말_서문여고3_미적분.hwp",
          type: "hwp",
          size: "2.4MB",
          problems: 22,
          date: "2025-01-21",
          folder: "2025-1-final",
        },
        {
          id: "8",
          name: "2025 1학기 기말 영생고(미적분).pdf",
          type: "pdf",
          size: "1.6MB",
          problems: 23,
          date: "2025-01-22",
          folder: "2025-1-final",
        },
        {
          id: "9",
          name: "2025 1학기 기말 울전고(미적분).pdf",
          type: "pdf",
          size: "1.8MB",
          problems: 20,
          date: "2025-01-23",
          folder: "2025-1-final",
        },
        {
          id: "10",
          name: "2025 1학기 기말 숙지고(미적분).pdf",
          type: "pdf",
          size: "1.9MB",
          problems: 20,
          date: "2025-01-24",
          folder: "2025-1-final",
        },
      ],
    },
  ])

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map((folder) => (folder.id === folderId ? { ...folder, expanded: !folder.expanded } : folder)))
  }

  const selectedFolderData = folders.find((f) => f.id === selectedFolder)
  const filteredFiles =
    selectedFolderData?.files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">수작 클라우드</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">시험지 파일을 안전하게 저장하고 관리하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <HardDrive className="w-4 h-4" />
            <span>사용량: 2.3GB / 10GB</span>
          </div>
          <Button variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />새 폴더
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            파일 업로드
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
          <div className="px-6 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">총 파일</p>
                <p className="text-xl font-bold">247</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
          <div className="px-6 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FolderOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">폴더</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
          <div className="px-6 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">공유됨</p>
                <p className="text-xl font-bold">18</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
          <div className="px-6 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <HardDrive className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">저장공간</p>
                <p className="text-xl font-bold">23%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-300px)]">
        {/* Left Sidebar - Folder Structure */}
        <div className="col-span-3">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-full">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg">폴더 구조</h3>
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
                      <Badge variant="secondary" className="ml-auto">
                        {folder.files.length}
                      </Badge>
                    </Button>
                  </div>
                ))}
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
                  {selectedFolderData?.name || "파일 목록"}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-600" />
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <Archive className="w-4 h-4 text-orange-600" />
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="파일 검색..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 flex-1 overflow-auto pt-0">
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-500 border-b">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6">파일명</div>
                  <div className="col-span-2">문제수</div>
                  <div className="col-span-2">작업</div>
                  <div className="col-span-1"></div>
                </div>
                {filteredFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 p-3 rounded-lg border hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-600 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                    </div>
                    <div className="col-span-6 flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getFileTypeColor(file.type)}>{file.type.toUpperCase()}</Badge>
                          <span className="text-xs text-gray-500">{file.size}</span>
                          <span className="text-xs text-gray-500">{file.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm font-medium">{file.problems}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-gray-500">작업</span>
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
      </div>
    </div>
  )
}
