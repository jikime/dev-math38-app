import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, BookOpen } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="space-y-4">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
          <h3 className="leading-none font-semibold text-sm font-medium text-gray-600">학원 순위</h3>
          <p className="text-xs text-gray-500">지역 50개 학원 대비</p>
        </div>
        <div className="px-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">#3</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+2</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 w-32">
                <span>1위</span>
                <span className="font-medium">3위</span>
                <span>1위</span>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <div className="w-20 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
          <div className="px-6 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">재원생</span>
            </div>
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-gray-500">명</div>
          </div>
        </div>

        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
          <div className="px-6 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">진행 수업</span>
            </div>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-gray-500">개</div>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="px-6 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-sm font-medium">대기 평가</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">8</div>
            <span className="text-xs text-gray-500">/24</span>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="px-6 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-sm font-medium">완료 시험</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">12</div>
            <span className="text-xs text-gray-500">/20</span>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="px-6 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">신규 문의</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">7</div>
            <span className="text-xs text-gray-500">/1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
