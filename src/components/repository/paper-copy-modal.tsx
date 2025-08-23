"use client";

import React, { useState, useEffect } from "react";
import { useMyLectures } from "@/hooks/use-lecture";
import { useCopyPaper } from "@/hooks/use-repository";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaperCopyVO = {
  lectureId: string;
  paperId: string;
  paperName: string;
  similar?: boolean;
};

interface Props {
  open?: boolean;
  setOpen: (open: boolean) => void;
  lectureId: string;
  paperId: string;
  paperName: string;
  onSuccess?: (lectureId: string) => void;
}


const PaperCopyModal = ({
  open = false,
  setOpen,
  lectureId,
  paperId,
  paperName: _originalName,
  onSuccess,
}: Props) => {
  const [targetLectureId, setTargetLectureId] = useState(lectureId);
  const [paperName, setPaperName] = useState(_originalName);
  const [similar, setSimilar] = useState(false);

  // 강좌 목록 가져오기
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures();

  // 시험지 복사 mutation
  const copyMutation = useCopyPaper();

  // 모달이 열릴 때마다 초기값 설정
  useEffect(() => {
    if (open) {
      setTargetLectureId(lectureId);
      setPaperName(_originalName);
      setSimilar(false);
    }
  }, [open, lectureId, _originalName]);

  const onCancel = () => {
    setOpen(false);
  };

  const onOk = async () => {
    if (!paperName.trim()) {
      toast.error("시험지명을 입력해주세요.");
      return;
    }
    
    if (!targetLectureId) {
      toast.error("대상 강좌를 선택해주세요.");
      return;
    }

    copyMutation.mutate(
      {
        lectureId: targetLectureId,
        paperId,
        paperName,
        similar,
      },
      {
        onSuccess: () => {
          toast.success(
            "시험지가 복사되었습니다. 해당 강좌로 이동하여 확인해 주십시오."
          );
          setOpen(false);
          onSuccess?.(targetLectureId);
        },
        onError: (error) => {
          console.error("시험지 복사 에러:", error);
          toast.error("시험지 복사에 문제가 발생했습니다.");
        },
      }
    );
  };

  const isLoading = copyMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[650px] p-0">
        <DialogHeader className="px-8 pt-6 pb-2">
          <DialogTitle className="text-lg flex items-center gap-2">
            <Copy className="w-5 h-5 text-primary" />
            시험지 복사하기
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-gray-50 dark:bg-gray-900/20 px-8 py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-gray-600 dark:text-gray-400">시험지를 복사하고 있습니다...</p>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                <p className="text-base text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-primary flex items-center gap-2 inline-flex mb-2">
                    <FileText className="w-4 h-4" />
                    [ {_originalName} ]
                  </span>
                  <br />
                  시험지를 복사해 넣을 강좌와 시험지명을 입력해주세요.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-base font-medium min-w-[80px] text-gray-700 dark:text-gray-300">
                    강좌
                  </label>
                  <div className="flex-1">
                    <Select value={targetLectureId} onValueChange={setTargetLectureId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="강좌를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {lecturesLoading ? (
                          <SelectItem value="" disabled>
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>로딩 중...</span>
                            </div>
                          </SelectItem>
                        ) : lectures && lectures.length > 0 ? (
                          lectures.map((lecture) => (
                            <SelectItem key={lecture.lectureId} value={lecture.lectureId}>
                              <div className="flex flex-col">
                                <span className="font-medium">{lecture.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            강좌가 없습니다
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-base font-medium min-w-[80px] text-gray-700 dark:text-gray-300">
                    시험지명
                  </label>
                  <Input
                    value={paperName}
                    onChange={(e) => setPaperName(e.target.value)}
                    className="flex-1 h-10"
                    placeholder="시험지 이름을 입력하세요"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                  <div className="flex gap-4 items-center">
                    <div className="flex gap-2 flex-1">
                      <Button
                        type="button"
                        className={cn(
                          "flex-1 py-3 px-4 border rounded-lg font-bold transition-all",
                          !similar 
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        )}
                        onClick={() => setSimilar(false)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Copy className="w-4 h-4" />
                          <span>동일문제로 복사</span>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        className={cn(
                          "flex-1 py-3 px-4 border rounded-lg font-bold transition-all",
                          similar 
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        )}
                        onClick={() => setSimilar(true)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Copy className="w-4 h-4" />
                          <span>유사문제로 복사</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mt-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      유사문제로 복사하면 동일한 유형의 다른 문제로 출제됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800/50 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            disabled={isLoading}
            className="px-8"
          >
            취소
          </Button>
          <Button 
            onClick={onOk} 
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                복사 중...
              </>
            ) : (
              "복사"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaperCopyModal;