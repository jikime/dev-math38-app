import { Badge } from "@/components/ui/badge"

export function UpcomingExams() {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <h3 className="leading-none font-semibold text-sm font-medium text-gray-600">다가오는 시험</h3>
        <p className="text-xs text-gray-500">이번 달</p>
        <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-100">활성</Badge>
      </div>
      <div className="px-6">
        <div className="space-y-4">
          <div className="h-20 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          <div>
            <p className="font-medium">중간고사</p>
            <p className="text-sm text-gray-500">예정일</p>
            <p className="text-lg font-bold">7월 15, 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
