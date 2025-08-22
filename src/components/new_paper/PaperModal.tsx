"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";  
import PaperViewer from "./viewer/PaperViewer";

interface PaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: string | undefined;
  useAcademyContents?: boolean;
  title?: string;
}

/**
 * 시험지 모달 컴포넌트
 * 시험지를 팝업 형태로 보여주는 모달
 * 
 * @param isOpen - 모달 표시 여부
 * @param onClose - 모달 닫기 핸들러
 * @param paperId - 표시할 시험지 ID
 * @param useAcademyContents - 아카데미 콘텐츠 사용 여부
 * @param title - 모달 제목 (기본값: "시험지 보기")
 */
const PaperModal: React.FC<PaperModalProps> = ({
  isOpen,
  onClose,
  paperId,
  useAcademyContents = false,
  title = "시험지 보기",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl h-[calc(100vh-80px)] p-0 gap-0">
        <DialogHeader className="px-8 py-3 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
        </DialogHeader>
        
        <div 
          className="flex-1 overflow-auto bg-gray-50 p-0"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <PaperViewer
            paperId={paperId}
            useAcademyContents={useAcademyContents}
            className="m-0 p-0"
          />
        </div>
        
        <DialogFooter className="px-6 py-4 border-t bg-white">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaperModal;