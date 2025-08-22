
export function ConversionMetrics() {
  const metrics = [
    {
      value: "3,605",
      label: "시험 통과",
      description: "단일 시험에서 통과한 학생 수입니다.",
      color: "blue",
      chartData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 40) + 10),
    },
    {
      value: "3,266",
      label: "과제 완료",
      description: "일일 과제를 완료한 학생 수의 추정치입니다.",
      color: "teal",
      chartData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 35) + 15),
    },
    {
      value: "8,765",
      label: "총 학습 완료",
      description: "전체 학습 과정을 완료한 학생들의 추정 총계입니다.",
      color: "pink",
      chartData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 45) + 20),
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return { text: "text-blue-600", bg: "bg-blue-400" }
      case "teal":
        return { text: "text-teal-600", bg: "bg-teal-400" }
      case "pink":
        return { text: "text-pink-600", bg: "bg-pink-400" }
      default:
        return { text: "text-gray-600", bg: "bg-gray-400" }
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color)
        const maxValue = Math.max(...metric.chartData)

        return (
          <div key={index} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="px-6">
              <div className="mb-4">
                <div className={`text-3xl font-bold ${colors.text} mb-1`}>{metric.value}</div>
                <div className="text-sm font-semibold text-gray-900 mb-2">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </div>

              {/* Mini bar chart */}
              <div className="h-12 flex items-end justify-between gap-1">
                {metric.chartData.map((value, i) => (
                  <div
                    key={i}
                    className={`${colors.bg} rounded-t`}
                    style={{
                      height: `${(value / maxValue) * 100}%`,
                      width: "6%",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
