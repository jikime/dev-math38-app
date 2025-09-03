import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Archive, X } from "lucide-react"

interface HwpUploadModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function HwpUploadModal({ isOpen, onOpenChange }: HwpUploadModalProps) {
  const handleHwpUpload = () => {
    // TODO: HWP 파일 업로드 로직
    console.log('HWP 업로드')
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            수학 문제 한글 파일 업로드
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="ml-auto h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* 단계 표시 */}
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 font-medium text-blue-600">파일 선택</span>
              <div className="ml-4 text-sm text-gray-600">파일을 선택해 주세요.</div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <span className="ml-2 text-gray-500">문제 업로드</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-gray-500">완료</span>
            </div>
          </div>

          {/* 업로드 영역 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50/50 mb-8">
            <div className="flex flex-col items-center space-y-4">
              <Archive className="h-16 w-16 text-blue-500" />
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요.
                </p>
                <p className="text-sm text-gray-500">
                  .hwp 파일만 업로드 가능합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-between">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              샘플 파일 다운로드
            </Button>
            <Button onClick={handleHwpUpload} className="bg-gray-600 hover:bg-gray-700">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}