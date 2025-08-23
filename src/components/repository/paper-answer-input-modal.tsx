"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  User, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Download,
  AlertTriangle,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useStudyPaperList,
  useAnswerSheet,
  useGradePaper,
  useResetPaper,
} from "@/hooks/use-repository";
import { 
  M38UserStudyPaperVO,
  PaperAnswerSheet,
  ProblemAnswer,
  PaperState,
  Answer
} from "@/types/repository";
import { PaperType } from "@/components/math-paper/domains/paper";
import { apiRequest } from "@/lib/api/axios-client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  lecturePaperId: string;
  type: PaperType;
}

const renderKatex = (value: string): string => {
  try {
    // KaTeX 처리를 위해 간단한 수학 표현 렌더링
    // 실제 구현에서는 katex 라이브러리 필요
    return `<span class="math-expression">${value}</span>`;
  } catch (e) {
    return `<div style="color: red; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${value}"> 표기 에러 </div>`;
  }
};

const PaperAnswerInputModal = ({ 
  open, 
  setOpen, 
  lecturePaperId, 
  type 
}: Props) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string | undefined>();
  const [answerSheet, setAnswerSheet] = useState<PaperAnswerSheet | undefined>();
  const [loadingAnswerSheet, setLoadingAnswerSheet] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // 학생 시험지 목록 조회
  const { data: userPaperList, isLoading: loadingPaper, refetch: refetchPaperList } = useStudyPaperList(lecturePaperId, type);

  // lecturePaperId 변경 시 상태 초기화
  useEffect(() => {
    if (open) {
      setSelectedPaperId(undefined);
      setAnswerSheet(undefined);
      setLoadingAnswerSheet(false);
    }
  }, [lecturePaperId, open]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setSelectedPaperId(undefined);
      setAnswerSheet(undefined);
      setLoadingAnswerSheet(false);
      setShowResetDialog(false);
    }
  }, [open]);

  // 채점 mutation
  const gradeMutation = useGradePaper();

  // 초기화 mutation  
  const resetMutation = useResetPaper();

  // 답안지 가져오기
  const getAnswerSheet = async (paperId: string) => {
    setLoadingAnswerSheet(true);
    try {
      const response = await apiRequest.get<PaperAnswerSheet>(
        API_ENDPOINTS.REPOSITORY.ANSWER_SHEET(paperId)
      );
      setAnswerSheet(response.data);
      setSelectedPaperId(paperId);
    } catch (error) {
      console.error("답안지 로드 오류:", error);
      toast.error("답안지 로드에 실패했습니다.");
    } finally {
      setLoadingAnswerSheet(false);
    }
  };

  // 학생 시험지 선택
  const onSelectUserPaper = (item: M38UserStudyPaperVO) => {
    getAnswerSheet(item.userStudyPaperId);
  };

  // 다음 학생 선택
  const selectNext = () => {
    if (!userPaperList) return;

    const index = userPaperList.findIndex(
      (p) => p.userStudyPaperId === selectedPaperId
    );
    
    if (index < userPaperList.length - 1) {
      const nextPaper = userPaperList[index + 1];
      onSelectUserPaper(nextPaper);
      toast.info("다음 시험지를 선택합니다. " + nextPaper.studentName);
    } else {
      toast.success("리스트의 마지막입니다.");
      setSelectedPaperId(undefined);
      setAnswerSheet(undefined);
    }
  };

  // 답안지 작업 헬퍼
  const onAnswerSheetWork = (fnc: (a: PaperAnswerSheet) => void) => {
    if (answerSheet) {
      fnc(answerSheet);
    } else {
      toast.error("학생의 시험지를 선택해 주세요.");
    }
  };

  // 일괄 정답 처리
  const allOk = () =>
    onAnswerSheetWork((a: PaperAnswerSheet) => {
      a.answerList.map((p) => (p.correct = 2));
      setAnswerSheet({ ...a });
    });

  // 일괄 오답 처리
  const allWrong = () =>
    onAnswerSheetWork((a: PaperAnswerSheet) => {
      a.answerList.map((p) => (p.correct = -2));
      setAnswerSheet({ ...a });
    });

  // 답안지 제출/채점
  const submitAnswerSheet = () => {
    if (!answerSheet) {
      toast.error("학생의 시험지를 선택해 주세요.");
      return;
    }

    gradeMutation.mutate(answerSheet, {
      onSuccess: (result) => {
        toast.success("채점을 했습니다. : " + result.score.toFixed(1));
        refetchPaperList();
        if (selectedPaperId) {
          selectNext();
        }
      },
      onError: () => {
        toast.error("채점에 실패했습니다.");
      },
    });
  };

  // 시험지 초기화
  const paperAnswerReset = async () => {
    if (!selectedPaperId) return;
    
    try {
      const response = await apiRequest.post<{ result: boolean }>(
        API_ENDPOINTS.REPOSITORY.RESET_PAPER(selectedPaperId)
      );
      
      if (response.data.result) {
        toast.success("시험지를 초기화 했습니다.");
        refetchPaperList();
        if (selectedPaperId) {
          await getAnswerSheet(selectedPaperId);
        }
      }
    } catch (error) {
      console.error("초기화 오류:", error);
      toast.error("초기화에 실패했습니다.");
    }
  };

  // 정답 체크 변경
  const onCorrect = (problemId: string, correct: number) => {
    if (answerSheet) {
      answerSheet.answerList.map((a) => {
        if (a.problemId === problemId) a.correct = correct;
      });
      setAnswerSheet({
        ...answerSheet,
      });
    }
  };

  // 정답/오답 버튼 컴포넌트
  const CorrectButtons = ({ record }: { record: ProblemAnswer }) => (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onCorrect(record.problemId, 2)}
        className={cn(
          "p-1 rounded transition-colors",
          record.correct === 2 
            ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" 
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        )}
        title="정답"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="5" fill="currentColor" />
        </svg>
      </button>
      <button
        onClick={() => onCorrect(record.problemId, 1)}
        className={cn(
          "p-1 rounded transition-colors",
          record.correct === 1
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        )}
        title="부분정답"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>
      <button
        onClick={() => onCorrect(record.problemId, -1)}
        className={cn(
          "p-1 rounded transition-colors",
          record.correct === -1
            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        )}
        title="부분오답"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M 6 6 L 18 18 M 18 6 L 6 18" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <button
        onClick={() => onCorrect(record.problemId, -2)}
        className={cn(
          "p-1 rounded transition-colors",
          record.correct === -2
            ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        )}
        title="오답"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M 6 6 L 18 18 M 18 6 L 6 18" stroke="currentColor" strokeWidth="3" />
        </svg>
      </button>
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
      {/* 헤더 */}
      <div className="h-12 bg-white dark:bg-gray-900 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="px-8 py-4 font-bold text-base text-gray-900 dark:text-gray-100">답안지 처리</div>
        <button
          className="w-12 h-12 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
          onClick={() => setOpen(false)}
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      
      {/* 메인 컨텐츠 */}
      <main className="h-[calc(100vh-48px)] w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="flex h-full flex-col p-4 md:flex-row gap-4">
          {/* 왼쪽: 학생 리스트 */}
          <div className="w-1/4 h-full flex flex-col min-h-0">
            <div className="flex justify-between items-center px-2 pt-2 pb-5">
              <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">학생리스트</h2>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 min-h-0 flex flex-col">
              {loadingPaper ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">학생</th>
                          <th className="text-center w-20 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">점수</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full">
                      <tbody>
                        {userPaperList?.map((record) => (
                          <tr
                            key={record.userStudyPaperId}
                            className={cn(
                              "cursor-pointer border-b border-gray-200 dark:border-gray-700",
                              record.userStudyPaperId === selectedPaperId
                                ? "bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            )}
                            onClick={() => onSelectUserPaper(record)}
                          >
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                              {record.studentName} ({record.userLoginId})
                            </td>
                            <td className="text-center w-20 py-3">
                              {record.state === PaperState.finished ? (
                                isNaN(record.score) ? (
                                  <span className="text-primary font-bold">-</span>
                                ) : (
                                  <span className="text-primary font-bold">
                                    {record.score.toFixed(1)}
                                  </span>
                                )
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 오른쪽: 정답 처리 */}
          <div className="h-full flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center pl-2 pb-4">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">정답처리하기</p>
              <Button onClick={selectNext} size="default">
                <User className="w-4 h-4 mr-2" />
                다음 학생
              </Button>
            </div>
          
            {answerSheet ? (
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                {/* 학생 정보 및 액션 버튼 */}
                <div className="flex p-4 rounded-md items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex-1 flex gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">학생</div>
                      <div className="bg-primary text-white px-3 py-1 rounded-md whitespace-nowrap">
                        {answerSheet.studentName}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">반명</div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {answerSheet.lectureName}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">시험지명</div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {answerSheet.paperName}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowResetDialog(true)}
                      disabled={resetMutation.isPending}
                    >
                      {resetMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4 mr-2" />
                      )}
                      초기화
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-950/70 text-primary border-primary"
                      onClick={allOk}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      일괄정답
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-950/70 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800"
                      onClick={allWrong}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      일괄오답
                    </Button>
                    <Button
                      variant="default"
                      onClick={submitAnswerSheet}
                      disabled={gradeMutation.isPending}
                    >
                      {gradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      제출
                    </Button>
                  </div>
                </div>

                {/* 답안 테이블 */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden min-h-0 flex flex-col">
                  {loadingAnswerSheet ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <>
                      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="w-24 text-center py-3 text-sm font-medium text-gray-700 dark:text-gray-300">번호</th>
                              <th className="text-center py-3 text-sm font-medium text-gray-700 dark:text-gray-300">답안</th>
                              <th className="w-48 text-center py-3 text-sm font-medium text-gray-700 dark:text-gray-300">정답체크</th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <table className="w-full">
                          <tbody>
                          {answerSheet?.answerList.map((record) => (
                            <tr key={record.problemId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="w-24 text-center py-3">
                                <button
                                  className="font-bold hover:text-primary transition-colors text-gray-900 dark:text-gray-100"
                                  title="문제 미리보기는 추후 구현 예정"
                                >
                                  {record.problemNumber}번
                                </button>
                              </td>
                              <td className="text-center py-3">
                                {record.value && record.value.answers ? (
                                  <div className="flex justify-center">
                                    {record.value.answers.length === 1
                                      ? record.value.answers.map((a: Answer, index: number) =>
                                          a.dataType === "mathTex" || a.dataType === "math" ? (
                                            <div
                                              key={index}
                                              className="math-answer text-gray-900 dark:text-gray-100"
                                              dangerouslySetInnerHTML={{ __html: a.value }}
                                            />
                                          ) : a.dataType === "choice" ? (
                                            <span
                                              className="text-xl font-light text-gray-900 dark:text-gray-100"
                                              key={index}
                                            >
                                              {a.value}
                                            </span>
                                          ) : a.dataType === "katex" ? (
                                            <div
                                              key={index}
                                              className="math-answer text-gray-900 dark:text-gray-100"
                                              dangerouslySetInnerHTML={{
                                                __html: renderKatex(a.value),
                                              }}
                                            />
                                          ) : (
                                            <span
                                              className="font-light text-gray-900 dark:text-gray-100"
                                              key={index}
                                              dangerouslySetInnerHTML={{ __html: a.value }}
                                            />
                                          )
                                        )
                                      : record.value.answers.map((a: Answer, index: number) => (
                                          <div key={index} className="flex items-center gap-2">
                                            <span className="text-gray-700 dark:text-gray-300">({index + 1})</span>
                                            {a.dataType === "katex" ? (
                                              <div
                                                className="math-answer text-gray-900 dark:text-gray-100"
                                                dangerouslySetInnerHTML={{
                                                  __html: renderKatex(a.value),
                                                }}
                                              />
                                            ) : (
                                              <span 
                                                className="text-gray-900 dark:text-gray-100"
                                                dangerouslySetInnerHTML={{ __html: a.value }} 
                                              />
                                            )}
                                          </div>
                                        ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="w-48 py-3">
                                <CorrectButtons record={record} />
                              </td>
                            </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>학생을 선택해주세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 초기화 확인 다이얼로그 */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              정답 체크를 초기화 하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              초기화 후 복구 할 수 없습니다. 그래도 초기화 하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                paperAnswerReset();
                setShowResetDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              초기화
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaperAnswerInputModal;