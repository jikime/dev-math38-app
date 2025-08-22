export function StudentStatus() {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <h3 className="leading-none font-semibold text-lg font-semibold">학생 현황</h3>
        <p className="text-sm text-gray-500">50개 학급 대비</p>
      </div>
      <div className="px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="76, 100"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-green-600">+2.4%</span>
                <span className="text-2xl font-bold">76%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>완료</span>
              <span className="font-medium">18/25</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>진행중</span>
              <span className="font-medium">12/25</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
