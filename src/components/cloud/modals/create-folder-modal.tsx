import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FolderPlus } from "lucide-react"

interface CreateFolderModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFolderModal({ isOpen, onOpenChange }: CreateFolderModalProps) {
  const [folderType, setFolderType] = useState("교과서")
  const [folderName, setFolderName] = useState("")

  const handleCreateFolder = () => {
    if (!folderName.trim()) return
    
    // TODO: API 호출로 폴더 생성
    console.log('폴더 생성:', { type: folderType, name: folderName })
    
    // 모달 닫기 및 상태 초기화
    onOpenChange(false)
    setFolderName("")
    setFolderType("교과서")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>폴더 생성</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label htmlFor="folder-type" className="text-sm font-medium">
              <span className="text-red-500">*</span> 폴더 정보 :
            </Label>
            <RadioGroup value={folderType} onValueChange={setFolderType} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="교과서" id="textbook" />
                <Label htmlFor="textbook">교과서</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="문제집" id="workbook" />
                <Label htmlFor="workbook">문제집</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="시험지" id="exam" />
                <Label htmlFor="exam">시험지</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="모의고사" id="mock" />
                <Label htmlFor="mock">모의고사</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-sm font-medium">
              <span className="text-red-500">*</span> 폴더명 :
            </Label>
            <Input
              id="folder-name"
              placeholder="폴더명"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleCreateFolder}
              className="bg-blue-600 hover:bg-blue-700 px-8"
              disabled={!folderName.trim()}
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}