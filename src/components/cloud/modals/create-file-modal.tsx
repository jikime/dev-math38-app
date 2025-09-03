import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface CreateFileModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookGroupTitle?: string
  selectedFolder?: string
}

export function CreateFileModal({ 
  isOpen, 
  onOpenChange, 
  bookGroupTitle = "중 1 레벨테스트",
  selectedFolder 
}: CreateFileModalProps) {
  const [fileName, setFileName] = useState("")

  const handleCreateFile = () => {
    if (!fileName.trim()) return
    
    // TODO: 빈 파일 생성 API 호출
    console.log('빈 파일 생성:', fileName)
    
    // 모달 닫기 및 상태 초기화
    onOpenChange(false)
    setFileName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            새파일 등록
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* 북그룹 정보 */}
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium min-w-[80px]">북그룹 :</Label>
            <span className="text-sm text-gray-700">
              {bookGroupTitle || selectedFolder || "중 1 레벨테스트"}
            </span>
          </div>

          {/* 파일명 입력 */}
          <div className="flex items-center gap-3">
            <Label htmlFor="file-name" className="text-sm font-medium min-w-[80px]">
              <span className="text-red-500">*</span> 파일 명 :
            </Label>
            <Input
              id="file-name"
              placeholder="파일 이름"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleCreateFile}
              className="bg-blue-600 hover:bg-blue-700 px-8"
              disabled={!fileName.trim()}
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}