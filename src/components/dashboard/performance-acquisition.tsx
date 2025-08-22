import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export function PerformanceAcquisition() {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <h3 className="leading-none font-semibold text-lg text-gray-900">성과 분석</h3>
        <p className="text-muted-foreground text-sm text-gray-500">학생들의 성과 향상도와 학습 세션 현황을 보여줍니다.</p>
      </div>
      <div className="px-6 space-y-6">
        {/* Bounce Rate equivalent - Study Completion Rate */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">87.5%</span>
          </div>
          <div className="text-sm text-gray-600 mb-3">학습 완료율</div>

          {/* Trend line */}
          <div className="h-16 bg-gradient-to-t from-blue-50 to-transparent rounded relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
              <path d="M0,35 Q25,30 50,25 T100,20" stroke="#3b82f6" strokeWidth="2" fill="none" />
              <path d="M0,35 Q25,30 50,25 T100,20 L100,40 L0,40 Z" fill="url(#blueGradient)" opacity="0.3" />
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Page Sessions equivalent - Learning Sessions */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-2xl font-bold text-gray-900">2,847</span>
          </div>
          <div className="text-sm text-gray-600 mb-3">학습 세션</div>

          {/* Trend line */}
          <div className="h-16 bg-gradient-to-t from-gray-50 to-transparent rounded relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
              <path d="M0,30 Q25,25 50,28 T100,22" stroke="#6b7280" strokeWidth="2" fill="none" />
              <path d="M0,30 Q25,25 50,28 T100,22 L100,40 L0,40 Z" fill="url(#grayGradient)" opacity="0.3" />
              <defs>
                <linearGradient id="grayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6b7280" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6b7280" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
          자세히 보기
        </Button>
      </div>
    </div>
  )
}
