import { ExternalLink } from "lucide-react"

export function DetailedTables() {
  const classData = [
    { name: "수학 심화반", percentage: 65.35, value: "65.35%", color: "bg-teal-400" },
    { name: "과학 실험반", percentage: 84.97, value: "84.97%", color: "bg-blue-400" },
    { name: "영어 회화반", percentage: 38.66, value: "38.66%", color: "bg-yellow-400" },
    { name: "물리 심화반", percentage: 16.11, value: "16.11%", color: "bg-pink-400" },
    { name: "화학 기초반", percentage: 59.34, value: "59.34%", color: "bg-teal-300" },
  ]

  const teacherData = [
    { name: "김수학 선생님", sessions: 13410, bounceRate: 40.95, conversionRate: 19.45, browser: "Chrome" },
    { name: "이과학 선생님", sessions: 1710, bounceRate: 47.58, conversionRate: 19.99, browser: "Firefox" },
    { name: "박영어 선생님", sessions: 1340, bounceRate: 56.5, conversionRate: 11.0, browser: "Safari" },
    { name: "최물리 선생님", sessions: 713, bounceRate: 59.62, conversionRate: 4.69, browser: "Edge" },
    { name: "정화학 선생님", sessions: 380, bounceRate: 52.5, conversionRate: 8.75, browser: "Opera" },
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Class Performance Table */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-center justify-between">
          <div>
            <h3 className="leading-none font-semibold text-lg text-gray-900">수업별 성과</h3>
            <p className="text-muted-foreground text-sm text-gray-500 mt-1">3월 01일 - 3월 20일, 2023</p>
          </div>
        </div>
        <div className="px-6">
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b">
              <div className="col-span-1">링크</div>
              <div className="col-span-5">수업명</div>
              <div className="col-span-3">비율 (%)</div>
              <div className="col-span-3">값</div>
            </div>

            {classData.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 py-3 text-sm hover:bg-gray-50 rounded">
                <div className="col-span-1 flex items-center">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>
                <div className="col-span-5 font-medium text-gray-900">{item.name}</div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 font-semibold text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Performance Table */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-center justify-between">
          <div>
            <h3 className="leading-none font-semibold text-lg text-gray-900">선생님별 성과</h3>
            <p className="text-muted-foreground text-sm text-gray-500 mt-1">3월 01일 - 3월 20일, 2023</p>
          </div>
        </div>
        <div className="px-6">
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b">
              <div className="col-span-4">선생님</div>
              <div className="col-span-2">세션</div>
              <div className="col-span-3">참여율</div>
              <div className="col-span-3">완료율</div>
            </div>

            {teacherData.map((teacher, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 py-3 text-sm hover:bg-gray-50 rounded">
                <div className="col-span-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">{teacher.browser.charAt(0)}</span>
                  </div>
                  <span className="font-medium text-gray-900">{teacher.name}</span>
                </div>
                <div className="col-span-2 text-gray-900">{teacher.sessions.toLocaleString()}</div>
                <div className="col-span-3 text-gray-900">{teacher.bounceRate}%</div>
                <div className="col-span-3 text-gray-900">{teacher.conversionRate}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
