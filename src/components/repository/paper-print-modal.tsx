"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, User, Printer, X, Edit, Loader2 } from "lucide-react";
import {
  useLectureStudents,
  useStudentPaperIds,
} from "@/hooks/use-repository";
import { 
  SimpleStudentVO, 
  StudentStudyPaperId, 
  PrintType, 
  M38UserStudyPaper 
} from "@/types/repository";
import { PaperType } from "@/components/math-paper/domains/paper";
import { apiRequest } from "@/lib/api/axios-client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import Image from "next/image";
  
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  lectureId: string;
  subjectId?: number;
  lecturePaperId: string;
  type: PaperType;
}

const PaperPrintModal = ({
  open,
  setOpen,
  lectureId,
  subjectId,
  lecturePaperId,
  type,
}: Props) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  const [printType, setPrintType] = useState<PrintType>(PrintType.paper);
  const [data, setData] = useState<SimpleStudentVO[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [printPaperStudentIds, setPrintPaperStudentIds] = useState<string[]>([]);
  const [paperCount, setPaperCount] = useState<number>(0);
  const [studentImages, setStudentImages] = useState<Record<string, string>>({});
  const [printPaperVisible, setPrintPaperVisible] = useState(false);
  
  // 시험지 수정 상태
  const [modifyUserStudyPaperVisible, setModifyUserStudyPaperVisible] = useState(false);
  const [userStudyPaperId, setUserStudyPaperId] = useState<string | undefined>();

  // 학생 목록 가져오기
  const { data: studentList, isLoading: studentsLoading, refetch: refetchStudents } = useLectureStudents(lectureId);

  // 학생별 시험지 ID 가져오기
  const { data: studentPaperIds, isLoading: paperIdsLoading, refetch: refetchPaperIds } = useStudentPaperIds(lecturePaperId);

  // lecturePaperId 변경 시 상태 초기화
  useEffect(() => {
    if (open) {
      setSelectedStudentIds([]);
      setPrintPaperStudentIds([]);
      setPrintPaperVisible(false);
      setPaperCount(0);
      setModifyUserStudyPaperVisible(false);
      setUserStudyPaperId(undefined);
    }
  }, [lecturePaperId, open]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setSelectedStudentIds([]);
      setPrintPaperStudentIds([]);
      setPrintPaperVisible(false);
      setPaperCount(0);
      setModifyUserStudyPaperVisible(false);
      setUserStudyPaperId(undefined);
      setPublishingUserId(null);
    }
  }, [open]);

  // 시험지 배포 loading 상태
  const [publishingUserId, setPublishingUserId] = useState<string | null>(null);

  // 학생 이미지 로드
  const loadStudentImages = async (students: SimpleStudentVO[]) => {
    if (!students || students.length === 0) return;
    
    const studentsToLoad = students.filter(student => !studentImages[student.userId]);
    if (studentsToLoad.length === 0) return;
    
    studentsToLoad.forEach(async (student) => {
      try {
        const response = await apiRequest.get(API_ENDPOINTS.REPOSITORY.STUDENT_IMAGE(student.userId), {
          responseType: 'blob'
        });
        
        const blob = response instanceof Blob ? response : new Blob([response.data]);
        const imageUrl = URL.createObjectURL(blob);
        
        setStudentImages(prev => ({
          ...prev,
          [student.userId]: imageUrl
        }));
      } catch (error: any) {
        // 404 상태인 경우 무시
        if (error.response && error.response.status === 404) {
          return;
        }
        console.error(`학생 ${student.userId} 이미지 로드 오류:`, error);
      }
    });
  };

  // 학생 목록 업데이트
  useEffect(() => {
    if (studentList) {
      if (studentPaperIds) {
        const vos: SimpleStudentVO[] = studentList.map(student => {
          const paperId = studentPaperIds.find(p => p.userId === student.userId);
          return {
            ...student,
            userStudyPaperId: paperId?.userStudyPaperId
          };
        });
        setData(vos);
      } else {
        setData([...studentList]);
      }
    }
  }, [studentList, studentPaperIds]);

  // 학생 이미지 로드
  useEffect(() => {
    if (data && data.length > 0) {
      loadStudentImages(data);
    }
  }, [data]);

  // 컴포넌트 언마운트 시 Blob URL 정리
  useEffect(() => {
    return () => {
      Object.values(studentImages).forEach(url => {
        if (url?.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // 시험지 수정
  const modifyUserStudyPaper = (userStudyPaperId: string) => {
    setUserStudyPaperId(userStudyPaperId);
    setModifyUserStudyPaperVisible(true);
  };

  const onCloseModifyUserStudyPaper = () => {
    setUserStudyPaperId(undefined);
    setModifyUserStudyPaperVisible(false);
    refetchPaperIds(); // 수정 후 데이터 새로고침
  };

  // 시험지 배포
  const publishUserStudyPaper = async (userId: string) => {
    setPublishingUserId(userId);
    try {
      const isWorkbook = type === "workbook_paper";
      const endpoint = isWorkbook 
        ? API_ENDPOINTS.REPOSITORY.PUBLISH_WORKBOOK_PAPER
        : API_ENDPOINTS.REPOSITORY.PUBLISH_PAPER;
      
      const payload = isWorkbook
        ? { lectureId, lecturePaperId, userId }
        : { lectureId, lecturePaperId, userId, paperType: type };
      
      const response = await apiRequest.put(endpoint, payload);
      
      if (response.data) {
        toast.success(response.data.message || "시험지가 배포되었습니다.");
      }
      refetchPaperIds();
    } catch (error) {
      console.error("시험지 배포 에러:", error);
      toast.error("시험지 배포에 실패했습니다.");
    } finally {
      setPublishingUserId(null);
    }
  };

  // 학생 선택 처리
  const handleStudentSelection = (studentId: string, checked: boolean) => {
    setSelectedStudentIds(prev => {
      if (checked) {
        return [...prev, studentId];
      } else {
        return prev.filter(id => id !== studentId);
      }
    });
  };

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(data.map(s => s.userId));
    } else {
      setSelectedStudentIds([]);
    }
  };

  // DATA 생성
  const generatePaperData = () => {
    if (selectedStudentIds.length === 0) {
      toast.error("학생을 선택해주세요.");
      return;
    }
    setPrintPaperStudentIds(selectedStudentIds);
    setPrintPaperVisible(true);
  };

  // 시험지 출력
  const handlePrint = () => {
    if (!printPaperStudentIds || printPaperStudentIds.length === 0) {
      toast.error("프린트할 시험지를 먼저 선택해주세요.");
      return;
    }
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>시험지 출력</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .page-break { page-break-before: always; }
              </style>
            </head>
            <body>
              ${printContents}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.onafterprint = () => {
            printWindow.close();
          };
          printWindow.print();
        };
      }
    } else {
      toast.error("인쇄할 내용이 없습니다.");
    }
  };

  const onPrintPapers = (papers: M38UserStudyPaper[]) => {
    setPaperCount(papers.length);
    refetchPaperIds();
  };

  const isAllSelected = data.length > 0 && selectedStudentIds.length === data.length;
  const isLoading = studentsLoading || paperIdsLoading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed inset-0 w-screen h-screen !max-w-none !max-h-none translate-x-0 translate-y-0 rounded-none border-0 p-0 m-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0 w-screen w-full flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">시험지 출력하기</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-0 w-screen h-screen">
          <div className="flex h-full flex-col md:flex-row gap-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 min-h-0">
            {/* 왼쪽: 학생 목록 */}
            <div className="w-1/4 h-full flex flex-col min-h-0">
              <div className="flex justify-between items-center px-2 pt-2 pb-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  학생 리스트 ({studentList?.length || 0}명)
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-500 w-6 h-6 text-white font-bold flex justify-center items-center text-xs">
                      {selectedStudentIds.length}
                    </div>
                    <div className="rounded-full bg-primary w-6 h-6 text-white font-bold flex justify-center items-center text-xs">
                      {paperCount}
                    </div>
                  </div>
                  <Button
                    onClick={generatePaperData}
                    disabled={type === "academy_contents"}
                    size="sm"
                  >
                    DATA 생성
                  </Button>
                </div>
              </div>

              <div className="flex-1 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <ScrollArea className="h-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200 dark:border-gray-700">
                        <TableHead className="w-12 text-gray-700 dark:text-gray-300">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-12 text-gray-700 dark:text-gray-300">#</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">이름(학교)</TableHead>
                        <TableHead className="w-20 text-center text-gray-700 dark:text-gray-300">DATA</TableHead>
                        <TableHead className="w-24 text-center text-gray-700 dark:text-gray-300">시험지</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                          </TableCell>
                        </TableRow>
                      ) : data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            학생이 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((student, index) => (
                          <TableRow key={student.userId} className="border-gray-200 dark:border-gray-700">
                            <TableCell>
                              <Checkbox
                                checked={selectedStudentIds.includes(student.userId)}
                                onCheckedChange={(checked) => 
                                  handleStudentSelection(student.userId, checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center text-gray-900 dark:text-gray-100">{index + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                  {studentImages[student.userId] ? (
                                    <Image 
                                      src={studentImages[student.userId]} 
                                      alt={student.name} 
                                      className="w-full h-full object-cover"
                                      onError={() => {
                                        setStudentImages(prev => {
                                          const newState = { ...prev };
                                          delete newState[student.userId];
                                          return newState;
                                        });
                                      }}
                                    />
                                  ) : (
                                    <User className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {student.name} ({student.schoolName})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {student.userStudyPaperId ? (
                                <span className="text-primary font-medium">생성</span>
                              ) : (
                                <span className="text-muted-foreground">미생성</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {student.userStudyPaperId ? (
                                type === "academy_contents" ? (
                                  <span className="text-xs text-muted-foreground">생성됨</span>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => modifyUserStudyPaper(student.userStudyPaperId!)}
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    수정하기
                                  </Button>
                                )
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs text-pink-600 dark:text-pink-400 border-pink-600 dark:border-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                                  onClick={() => publishUserStudyPaper(student.userId)}
                                  disabled={type === "academy_contents" || (type !== "manual" && type !== "workbook_addon") || publishingUserId === student.userId}
                                >
                                  {publishingUserId === student.userId ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <FileText className="w-3 h-3 mr-1" />
                                  )}
                                  배포하기
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
          </div>

          {/* 오른쪽: 시험지 미리보기 */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex justify-end">
              <Button 
                onClick={handlePrint} 
                disabled={type === "academy_contents" || !printPaperVisible}
              >
                <Printer className="w-4 h-4 mr-2" />
                출력
              </Button>
            </div>

            <div className="flex-1 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
              {printPaperVisible ? (
                <>
                  {/* 탭 버튼들 */}
                  <div className="flex space-x-2 p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <Button
                      variant={printType === PrintType.paper ? "default" : "outline"}
                      onClick={() => setPrintType(PrintType.paper)}
                      disabled={type === "academy_contents"}
                      className="flex-1"
                    >
                      시험지
                    </Button>
                    <Button
                      variant={printType === PrintType.quickanswer ? "default" : "outline"}
                      onClick={() => setPrintType(PrintType.quickanswer)}
                      disabled={type === "academy_contents"}
                      className="flex-1"
                    >
                      빠른 답안
                    </Button>
                    <Button
                      variant={printType === PrintType.answers ? "default" : "outline"}
                      onClick={() => setPrintType(PrintType.answers)}
                      disabled={type === "academy_contents"}
                      className="flex-1"
                    >
                      정답지
                    </Button>
                  </div>
                  
                  {/* 콘텐츠 영역 - 스크롤 가능 */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div ref={printRef} className="p-4">
                      {type === "academy_contents" ? (
                        <div className="flex items-center justify-center h-full min-h-[400px]">
                          <div className="text-center p-8">
                            <div className="text-lg text-muted-foreground mb-2">
                              📄 시험지는 출력되지 않습니다
                            </div>
                            <div className="text-sm text-muted-foreground">
                              우리학원 시험지는 출력 기능을 지원하지 않습니다.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-8 text-muted-foreground">
                          시험지 미리보기가 여기에 표시됩니다.
                          <br />
                          실제 구현에서는 PaperPrintForm 컴포넌트가 필요합니다.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  학생을 선택하고 DATA를 생성해주세요.
                </div>
              )}
            </div>
          </div>
          
          {/* 시험지 수정 모달 - 실제 구현 필요 */}
          {modifyUserStudyPaperVisible && userStudyPaperId && (
            <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">시험지 수정</h3>
                <p className="text-muted-foreground mb-4">
                  시험지 수정 기능은 추후 구현 예정입니다.
                </p>
                <Button onClick={onCloseModifyUserStudyPaper}>
                  닫기
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaperPrintModal;