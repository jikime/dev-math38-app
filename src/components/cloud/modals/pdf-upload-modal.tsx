import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Archive, X } from "lucide-react"

interface PdfUploadModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function PdfUploadModal({ isOpen, onOpenChange }: PdfUploadModalProps) {
  const handlePdfUpload = () => {
    // TODO: PDF 파일 업로드 로직
    console.log('PDF 업로드')
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            PDF 이미지 파일 업로드
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
        <div className="py-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50/50">
            <div className="flex flex-col items-center space-y-4">
              <Archive className="h-16 w-16 text-blue-500" />
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요.
                </p>
                <p className="text-sm text-gray-500">
                  파일은 .pdf 파일만 업로드 가능합니다.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handlePdfUpload} className="bg-gray-600 hover:bg-gray-700">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}