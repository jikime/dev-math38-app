
export function StudentDistribution() {
  const data = [
    { name: "수학", value: 45, color: "bg-pink-400", percentage: "45%" },
    { name: "과학", value: 25, color: "bg-orange-400", percentage: "25%" },
    { name: "영어", value: 20, color: "bg-teal-400", percentage: "20%" },
    { name: "기타", value: 10, color: "bg-blue-400", percentage: "10%" },
  ]

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div className="leading-none font-semibold text-lg text-gray-900">과목별 학생 분포</div>
      </div>
      <div className="px-6">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
            {/* Math - 45% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#f472b6"
              strokeWidth="3"
              strokeDasharray="45 55"
              strokeDashoffset="0"
            />
            {/* Science - 25% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#fb923c"
              strokeWidth="3"
              strokeDasharray="25 75"
              strokeDashoffset="-45"
            />
            {/* English - 20% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#2dd4bf"
              strokeWidth="3"
              strokeDasharray="20 80"
              strokeDashoffset="-70"
            />
            {/* Others - 10% */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeDasharray="10 90"
              strokeDashoffset="-90"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-500">총 학생</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <span className="text-sm text-gray-500">{item.percentage}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{item.value}명</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
