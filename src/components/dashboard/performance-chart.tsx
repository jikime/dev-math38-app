import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp } from "lucide-react"

export function PerformanceChart() {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="leading-none font-semibold text-lg font-semibold">성과 분석</h3>
            <p className="text-sm text-gray-500">업데이트: 07/29/25 오후 6:15</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              이번 달
            </Button>
            <Button variant="ghost" size="icon">
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">₩2.4M</div>
            <div className="text-sm text-gray-500">월 수익</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-gray-500">평균 성취도</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">₩180K</div>
            <div className="text-sm text-gray-500">평균 수강료</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span className="text-sm">성취도 향상</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span className="text-sm">성과 분석</span>
          </div>
          <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">실시간 데이터</Badge>
        </div>

        {/* Chart Area */}
        <div className="h-48 bg-gradient-to-t from-yellow-50 to-transparent rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
            {["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월"].map((month, index) => (
              <div key={month} className="flex flex-col items-center">
                <div className="w-8 bg-yellow-400 rounded-t" style={{ height: `${Math.random() * 120 + 20}px` }}></div>
                <span className="text-xs text-gray-500 mt-2">{month}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-4 left-4 text-sm text-gray-600">
            <div>25 총계</div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">5 시작됨</span>
            <span className="text-sm text-gray-600">12 확장됨</span>
          </div>
        </div>
      </div>
    </div>
  )
}
