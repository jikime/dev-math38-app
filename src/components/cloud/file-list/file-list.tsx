import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Download, Edit, Trash2, GripVertical } from "lucide-react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import type { CloudResourceProblem } from "@/types/cloud"
import { getFileIcon } from "../../../lib/utils/file-icons"
import { getFileTypeFromPath, getFileTypeColor, getEstimatedFileSize } from "../../../lib/utils/file-utils"

interface FileListProps {
  problems: CloudResourceProblem[]
  isLoading: boolean
  selectedFolder?: string
  onReorder?: (reorderedProblems: CloudResourceProblem[]) => void
}

export function FileList({ problems, isLoading, selectedFolder, onReorder }: FileListProps) {
  const router = useRouter()
  const [items, setItems] = useState(problems)

  useEffect(() => {
    setItems(problems)
  }, [problems])

  const handleFileClick = (fileId: string) => {
    router.push(`/cloud/${fileId}`)
  }


  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        파일 목록 로딩중...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {selectedFolder ? "파일이 없습니다" : "폴더를 선택해주세요"}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-500 border-b">
        <div className="col-span-1">#</div>
        <div className="col-span-8">파일명</div>
        <div className="col-span-2">문제수</div>
        <div className="col-span-1"></div>
      </div>
      <ScrollArea className="h-[calc(100vh-500px)]">
        <Droppable droppableId="file-list">
          {(provided) => (
            <div 
              className="space-y-2 p-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((problem, index) => {
                const fileType = getFileTypeFromPath(problem.title)
                const createdDate = new Date(problem.created).toLocaleDateString('ko-KR')
                const fileSize = getEstimatedFileSize(problem.pageCount, problem.problemCount)
                
                return (
                  <Draggable key={problem.fileId} draggableId={problem.fileId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`grid grid-cols-12 gap-4 p-3 rounded-lg border hover:border-muted hover:bg-muted/50 transition-all duration-200 ${
                          snapshot.isDragging ? 'shadow-lg bg-background' : ''
                        }`}
                      >
                        <div className="col-span-1 flex items-center gap-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                        </div>
                <div 
                  className="col-span-8 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-2 -m-2"
                  onClick={() => handleFileClick(problem.fileId)}
                >
                  {getFileIcon(fileType)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{problem.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getFileTypeColor(fileType)}>{fileType.toUpperCase()}</Badge>
                      <span className="text-xs text-muted-foreground">{fileSize}</span>
                      <span className="text-xs text-muted-foreground">{createdDate}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm font-medium">{problem.problemCount}</span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        파일명 수정
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileClick(problem.fileId)}>
                        <Eye className="w-4 h-4 mr-2" />
                        문제 보기
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        파일 다운로드
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        파일 삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </Draggable>
              )})}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </>
  )
}