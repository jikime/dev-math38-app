import { Button } from "@/components/ui/button"
import { FlexibleSelect } from "@/components/ui/flexible-select"
import type { SelectOption } from "@/components/ui/flexible-select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { FolderPlus } from "lucide-react"
import type { CloudBookGroup } from "@/types/cloud"
import { FolderTreeNode } from "../folder-tree"
import { CreateFolderModal } from "../modals/create-folder-modal"
import { Separator } from "@/components/ui/separator"

interface FolderStructureProps {
  subjectOptions: SelectOption[]
  selectedSubject: string
  subjectsLoading: boolean
  bookGroups: CloudBookGroup[] | null
  bookGroupsLoading: boolean
  expandedFolders: Set<string>
  selectedFolder: string
  isCreateFolderOpen: boolean
  onSubjectChange: (value: string | string[]) => void
  onToggleExpand: (folderId: string) => void
  onSelectFolder: (folderId: string) => void
  onCreateFolderOpenChange: (open: boolean) => void
}

export function FolderStructure({
  subjectOptions,
  selectedSubject,
  subjectsLoading,
  bookGroups,
  bookGroupsLoading,
  expandedFolders,
  selectedFolder,
  isCreateFolderOpen,
  onSubjectChange,
  onToggleExpand,
  onSelectFolder,
  onCreateFolderOpenChange
}: FolderStructureProps) {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 h-full">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-3">
        <div className="flex items-center justify-between">
          <h3 className="leading-none font-semibold text-lg">과목</h3>
          <Dialog open={isCreateFolderOpen} onOpenChange={onCreateFolderOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="w-4 h-4 mr-1" />
                새 폴더
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
        <FlexibleSelect
          options={subjectOptions}
          value={selectedSubject}
          onValueChange={onSubjectChange}
          placeholder="과목을 선택하세요"
          disabled={subjectsLoading}
          className="w-full"
          multiple={false}
        />
        
        {subjectsLoading && (
          <div className="text-sm text-muted-foreground mt-2">과목 목록 로딩중...</div>
        )}
        
        {!subjectsLoading && (!subjectOptions || subjectOptions.length === 0) && (
          <div className="text-sm text-red-500 mt-2">과목 목록을 불러올 수 없습니다</div>
        )}
      </div>
      <Separator />
      <div className="px-6 pt-0">
        <div className="space-y-1">
          {bookGroupsLoading ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              폴더 목록 로딩중...
            </div>
          ) : bookGroups && bookGroups.length > 0 ? (
            bookGroups.map((folder) => (
              <FolderTreeNode
                key={folder.key}
                folder={folder}
                level={0}
                expandedFolders={expandedFolders}
                selectedFolder={selectedFolder}
                onToggleExpand={onToggleExpand}
                onSelectFolder={onSelectFolder}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              폴더가 없습니다
            </div>
          )}
        </div>
      </div>
      
      <CreateFolderModal 
        isOpen={isCreateFolderOpen} 
        onOpenChange={onCreateFolderOpenChange} 
      />
    </div>
  )
}