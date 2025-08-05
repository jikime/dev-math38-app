import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AcademyMetrics() {
  const timeButtons = ["DAY", "WEEK", "MONTH"]
  const selectedTime = "MONTH"

  // Sample data for the last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    newStudents: Math.floor(Math.random() * 8) + 2,
    classAttendance: Math.floor(Math.random() * 25) + 15,
    testScores: Math.floor(Math.random() * 20) + 10,
    assignments: Math.floor(Math.random() * 15) + 5,
  }))

  const maxValue = Math.max(
    ...chartData.flatMap((d) => [d.newStudents, d.classAttendance, d.testScores, d.assignments]),
  )

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="leading-none font-semibold text-lg text-gray-900">학원 운영 지표</div>
            <p className="text-sm text-gray-500 mt-1">현재 날짜 범위에서 학생들의 활동 현황입니다.</p>
          </div>
          <div className="flex gap-1 border rounded-lg p-1">
            {timeButtons.map((button) => (
              <Button
                key={button}
                variant={selectedTime === button ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1 text-xs ${
                  selectedTime === button ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {button}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">신규 학생</div>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-green-100 text-green-800 text-xs">65% 목표 달성</Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1">목표: 240명</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">수업 참여도</div>
            <div className="text-2xl font-bold text-gray-900">89.2%</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-blue-100 text-blue-800 text-xs">42% 목표 달성</Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1">목표: 95.0%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">시험 세션</div>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">78% 목표 달성</Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1">목표: 1,600</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">과제 완료율</div>
            <div className="text-2xl font-bold text-gray-900">76.8%</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-orange-100 text-orange-800 text-xs">85% 목표 달성</Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1">목표: 90.0%</div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-end justify-between px-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-1" style={{ width: "3%" }}>
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-2 bg-teal-400 rounded-t"
                    style={{ height: `${(data.newStudents / maxValue) * 120}px` }}
                  ></div>
                  <div
                    className="w-2 bg-blue-400 rounded-t"
                    style={{ height: `${(data.classAttendance / maxValue) * 120}px` }}
                  ></div>
                  <div
                    className="w-2 bg-purple-400 rounded-t"
                    style={{ height: `${(data.testScores / maxValue) * 120}px` }}
                  ></div>
                  <div
                    className="w-2 bg-orange-400 rounded-t"
                    style={{ height: `${(data.assignments / maxValue) * 120}px` }}
                  ></div>
                </div>
                {index % 5 === 0 && <span className="text-xs text-gray-500 mt-1">{data.day}</span>}
              </div>
            ))}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
            <span>{maxValue}</span>
            <span>{Math.floor(maxValue * 0.75)}</span>
            <span>{Math.floor(maxValue * 0.5)}</span>
            <span>{Math.floor(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-400 rounded"></div>
            <span className="text-gray-600">신규 학생</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-gray-600">수업 참여</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded"></div>
            <span className="text-gray-600">시험 점수</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span className="text-gray-600">과제 완료</span>
          </div>
        </div>
      </div>
    </div>
  )
}
