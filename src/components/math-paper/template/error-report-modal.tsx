"use client";

import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, X } from "lucide-react";
import { PaperEditContext } from "./paper-edit-context";
import { M38UserStudyPaper } from "../typings";
import { api } from "../net";
import { useApiSWR } from "../net/hooks/useApiSWR";
import { toast } from "sonner";
import { API_REGISTRY } from "../net/registry/ApiRegistry";

interface ProblemInfo {
  skillId: string;
  problemId: string;
}

interface ErrorType {
  id: number;
  name: string;
  description: string;
}

interface ErrorReportModalProps {
  visible: boolean;
  onCancel: () => void;
  problemInfo: ProblemInfo;
}

interface UploadFile {
  uid: string;
  name: string;
  status?: string;
  size?: number;
  type?: string;
  originFileObj?: File;
}

interface FormData {
  lectureId?: string;
  lectureTitle?: string;
  paperId?: string;
  paperTitle?: string;
  problemId?: string;
  skillId?: string;
  problemNumber?: string;
  errorType?: string;
  errorDescription?: string;
}

const ErrorReportModal = ({
  visible,
  onCancel,
  problemInfo,
}: ErrorReportModalProps) => {
  const [formData, setFormData] = useState<FormData>({});
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [disabled, setDisabled] = useState(true);
  const { paper } = useContext(PaperEditContext);

  const { data: errorTypes } = useApiSWR<ErrorType[]>(
    'main',
    API_REGISTRY.main.errorReport.errorTypes
  );

  useEffect(() => {
    if (paper) {
      const lecturePaper = paper as M38UserStudyPaper;
      const index = paper.pages
        .flatMap((page) => [...(page.leftSet || []), ...(page.rightSet || [])])
        .findIndex((problem) => problem.problemId === problemInfo.problemId);

      setFormData({
        lectureId: lecturePaper.lectureId,
        lectureTitle: lecturePaper.lectureTitle,
        paperId: lecturePaper.paperId,
        paperTitle: lecturePaper.title,
        problemId: problemInfo.problemId,
        skillId: problemInfo.skillId,
        problemNumber: index + 1 + " 번 문항",
      });
    }
  }, [paper, problemInfo]);

  useEffect(() => {
    setDisabled(!formData.errorType || !formData.errorDescription);
  }, [formData]);

  const handleSubmit = async () => {
    try {
      const errorReportObj = {
        lectureId: formData.lectureId,
        lectureTitle: formData.lectureTitle,
        paperId: formData.paperId,
        paperTitle: formData.paperTitle,
        problemId: formData.problemId,
        skillId: formData.skillId,
        problemNumber: formData.problemNumber?.replace(" 번 문항", ""),
        errorType: formData.errorType,
        errorContent: formData.errorDescription,
      };

      let response;
      if (fileList.length > 0) {
        // 파일이 있는 경우: FormData로 전송
        const formDataToSend = new FormData();
        formDataToSend.append("errorReport", JSON.stringify(errorReportObj));
        fileList.forEach((file) => {
          if (file.originFileObj) {
            formDataToSend.append("files", file.originFileObj);
          }
        });
        response = await api.main.post(API_REGISTRY.main.errorReport.insertWithFiles, formDataToSend);
      } else {
        // 파일이 없는 경우: JSON으로 전송
        response = await api.main.post(API_REGISTRY.main.errorReport.insert, errorReportObj);
      }

      toast.success("문제에 대한 오류가 통보되었습니다. 빠른 시일 내에 조치하도록 하겠습니다.");
      onCancel();
      setFormData({});
      setFileList([]);
    } catch (error) {
      console.error("오류 보고 제출 중 에러 발생:", error);
      toast.error("오류 신고 중 문제가 발생했습니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const uploadFiles: UploadFile[] = files.map((file, index) => ({
      uid: `-${Date.now()}-${index}`,
      name: file.name,
      status: 'done',
      size: file.size,
      type: file.type,
      originFileObj: file,
    }));
    setFileList([...fileList, ...uploadFiles]);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    const newFileList = [...fileList];

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const uploadFile: UploadFile = {
            uid: `-${Date.now()}-${i}`,
            name: `pasted-image-${Date.now()}.png`,
            status: "done",
            size: file.size,
            type: file.type,
            originFileObj: file,
          };
          newFileList.push(uploadFile);
        }
      }
    }

    setFileList(newFileList);
  };

  const removeFile = (index: number) => {
    setFileList(fileList.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={visible} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>오류 신고</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lectureTitle">강좌명</Label>
              <Input
                id="lectureTitle"
                value={formData.lectureTitle || ""}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="paperTitle">시험지명</Label>
              <Input
                id="paperTitle"
                value={formData.paperTitle || ""}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="problemNumber">문항 번호</Label>
              <Input
                id="problemNumber"
                value={formData.problemNumber || ""}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="skillId">스킬 ID</Label>
              <Input
                id="skillId"
                value={formData.skillId || ""}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="problemId">문제 ID</Label>
              <Input
                id="problemId"
                value={formData.problemId || ""}
                disabled
              />
            </div>
          </div>

          <div>
            <Label htmlFor="errorType">오류 유형 *</Label>
            <Select
              value={formData.errorType}
              onValueChange={(value) => setFormData({ ...formData, errorType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="오류 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {errorTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="errorDescription">오류 설명 *</Label>
            <Textarea
              id="errorDescription"
              value={formData.errorDescription || ""}
              onChange={(e) => setFormData({ ...formData, errorDescription: e.target.value })}
              onPaste={handlePaste}
              placeholder="오류 내용을 자세히 설명해주세요 (이미지 붙여넣기 가능)"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="files">첨부 파일 (이미지 붙여넣기 가능)</Label>
            <div className="mt-2">
              <Input
                id="files"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={fileList.length >= 8}
              />
              {fileList.length < 8 && (
                <label
                  htmlFor="files"
                  className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  <div className="text-center">
                    <PlusIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    <div className="mt-2 text-sm text-gray-500">Upload</div>
                  </div>
                </label>
              )}
              <div className="mt-2 space-y-2">
                {fileList.map((file, index) => (
                  <div key={file.uid} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={disabled}>
            신고하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorReportModal;