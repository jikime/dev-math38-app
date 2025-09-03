import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Upload, 
  List, 
  ArrowUpDown, 
  FolderOpen,
  FileText,
  File,
  BarChart3
} from "lucide-react"

interface FileListHeaderProps {
  title: string
  isLoading: boolean
  selectedFolder?: string
  onOpenStats: () => void
  onOpenHwpModal: () => void
  onOpenPdfModal: () => void
  onOpenCreateFileModal: () => void
}

export function FileListHeader({
  title,
  isLoading,
  selectedFolder,
  onOpenStats,
  onOpenHwpModal,
  onOpenPdfModal,
  onOpenCreateFileModal
}: FileListHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleOpenHwpModal = () => {
    onOpenHwpModal()
    setIsDropdownOpen(false)
  }

  const handleOpenPdfModal = () => {
    onOpenPdfModal()
    setIsDropdownOpen(false)
  }

  const handleOpenCreateFileModal = () => {
    onOpenCreateFileModal()
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex items-center justify-between">
      <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
        {isLoading ? "로딩중..." : title || "파일 목록"}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 ml-2"
          onClick={onOpenStats}
          disabled={!selectedFolder}
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      </h3>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="리스트 보기">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="파일 순서 바꾸기">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="북그룹 이동하기">
            <FolderOpen className="w-4 h-4" />
          </Button>
        </div>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              파일 업로드
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOpenHwpModal}>
              <FileText className="w-4 h-4 mr-2" />
              HWP 파일 업로드
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenPdfModal}>
              <FileText className="w-4 h-4 mr-2 text-red-600" />
              PDF 파일 업로드
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenCreateFileModal}>
              <File className="w-4 h-4 mr-2" />
              빈 파일 만들기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}