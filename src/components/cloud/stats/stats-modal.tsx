import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, X } from "lucide-react"
import type { BookGroupStats, SkillChapter } from "@/types/cloud"
import { StatsTable } from "./stats-table"
import { StatsCharts } from "./stats-charts"
import { calculateStats } from "@/lib/utils/stats-utils"

interface StatsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  bookGroupStats: BookGroupStats | null
  skillChapters: SkillChapter[] | null
  bookGroupStatsLoading: boolean
  skillChaptersLoading: boolean
}

export function StatsModal({
  isOpen,
  onOpenChange,
  bookGroupStats,
  skillChapters,
  bookGroupStatsLoading,
  skillChaptersLoading
}: StatsModalProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set())

  // 챕터 확장/축소 핸들러
  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  const statsData = calculateStats(bookGroupStats, skillChapters)
  const isLoading = bookGroupStatsLoading || skillChaptersLoading

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-7xl !max-h-[95vh] !w-full dark:bg-gray-900 dark:text-white overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>통계 정보</DialogTitle>
        </DialogHeader>
        <div className="bg-slate-700 dark:bg-slate-800 text-white p-6 -mx-6 -mt-6 mb-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {bookGroupStats?.title || "통계"}
              </h2>
              <p className="text-slate-300 dark:text-slate-400 mt-1">
                {bookGroupStats?.subjectName || ""}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-300 dark:text-slate-400">전체 문항</div>
                <div className="text-3xl font-bold">
                  {bookGroupStats?.problems.length || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-300 dark:text-slate-400">객관식/주관식</div>
                <div className="text-3xl font-bold">
                  {bookGroupStats?.problems.filter(p => p.choiceType === 'choice').length || 0}/
                  {bookGroupStats?.problems.filter(p => p.choiceType !== 'choice').length || 0}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600 dark:hover:bg-slate-700">
                  <Printer className="w-4 h-4 mr-2" />
                  인쇄
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-slate-600 dark:hover:bg-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[calc(95vh-200px)]">
          <Tabs defaultValue="stats" className="w-full flex flex-col flex-1">
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
              <TabsTrigger value="stats" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
                단원 및 유형별 문항 수
              </TabsTrigger>
              <TabsTrigger value="chart" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
                통계 데이터 뷰
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-6 flex-1">
              <StatsTable
                statsData={statsData}
                isLoading={isLoading}
                expandedChapters={expandedChapters}
                onToggleChapter={toggleChapter}
              />
            </TabsContent>

            <TabsContent value="chart" className="mt-6 flex-1 overflow-hidden">
              <StatsCharts
                bookGroupStats={bookGroupStats}
                skillChapters={skillChapters}
                statsData={statsData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}