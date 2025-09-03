import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight } from "lucide-react"

interface StatsTableProps {
  statsData: any[] | null
  isLoading: boolean
  expandedChapters: Set<number>
  onToggleChapter: (chapterId: number) => void
}

export function StatsTable({ 
  statsData, 
  isLoading, 
  expandedChapters, 
  onToggleChapter 
}: StatsTableProps) {
  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm font-medium dark:text-gray-200">
          <div className="col-span-5">단원 및 유형</div>
          <div className="col-span-1 text-center">총 문항 수</div>
          <div className="col-span-1 text-center">최하</div>
          <div className="col-span-1 text-center">하</div>
          <div className="col-span-1 text-center">중</div>
          <div className="col-span-1 text-center">상</div>
          <div className="col-span-2 text-center">최상</div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
            통계 로딩중...
          </div>
        ) : statsData && statsData.length > 0 ? (
          statsData.map((chapter) => (
            <div key={chapter.chapterId}>
              {/* 챕터 헤더 */}
              <div
                className="grid grid-cols-12 gap-2 p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onToggleChapter(chapter.chapterId)}
              >
                <div className="col-span-5 flex items-center gap-2">
                  {expandedChapters.has(chapter.chapterId) ? (
                    <ChevronDown className="w-4 h-4 dark:text-gray-300" />
                  ) : (
                    <ChevronRight className="w-4 h-4 dark:text-gray-300" />
                  )}
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {chapter.title}
                  </span>
                </div>
                <div className="col-span-1 text-center font-bold dark:text-gray-200">
                  {chapter.total}
                </div>
                <div className="col-span-1 text-center font-bold dark:text-gray-200">
                  {chapter.최하}
                </div>
                <div className="col-span-1 text-center font-bold dark:text-gray-200">
                  {chapter.하}
                </div>
                <div className="col-span-1 text-center font-bold dark:text-gray-200">
                  {chapter.중}
                </div>
                <div className="col-span-1 text-center font-bold dark:text-gray-200">
                  {chapter.상}
                </div>
                <div className="col-span-2 text-center font-bold dark:text-gray-200">
                  {chapter.최상}
                </div>
              </div>

              {/* 스킬 목록 (확장된 경우만 표시) */}
              {expandedChapters.has(chapter.chapterId) && chapter.skills.map((skill: any) => (
                <div
                  key={skill.skillId}
                  className="grid grid-cols-12 gap-2 p-3 border-l-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 ml-4"
                >
                  <div className="col-span-5 flex items-center pl-6">
                    <span className={`text-sm ${
                      skill.total > 0 
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded border border-green-200 dark:border-green-700 font-medium" 
                        : "text-blue-600 dark:text-blue-400"
                    }`}>
                      {skill.title}
                    </span>
                  </div>
                  <div className="col-span-1 text-center dark:text-gray-200">
                    {skill.total}
                  </div>
                  <div className="col-span-1 text-center dark:text-gray-200">
                    {skill.최하}
                  </div>
                  <div className="col-span-1 text-center dark:text-gray-200">
                    {skill.하}
                  </div>
                  <div className="col-span-1 text-center dark:text-gray-200">
                    {skill.중}
                  </div>
                  <div className="col-span-1 text-center dark:text-gray-200">
                    {skill.상}
                  </div>
                  <div className="col-span-2 text-center dark:text-gray-200">
                    {skill.최상}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
            통계 데이터가 없습니다
          </div>
        )}
      </div>
    </ScrollArea>
  )
}