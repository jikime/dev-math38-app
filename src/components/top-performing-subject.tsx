import { Button } from "@/components/ui/button"

export function TopPerformingSubject() {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <h3 className="leading-none font-semibold text-lg text-gray-900">최고 성과 과목</h3>
      </div>
      <div className="px-6 text-center">
        <div className="mb-4">
          <div className="text-4xl font-bold text-gray-900 mb-2">29,931</div>
          <div className="text-lg font-semibold text-gray-900 mb-1">수학 심화반</div>
          <div className="text-sm text-gray-500 mb-4">
            이번 달 학생들의 성과 지표를 통해 생성된 트래픽 측정값입니다.
          </div>
        </div>

        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
          자세히 보기
        </Button>
      </div>
    </div>
  )
}
