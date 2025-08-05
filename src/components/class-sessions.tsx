
export function ClassSessions() {
  const deviceData = [
    { name: "수학", sessions: 1298, color: "#3b82f6" },
    { name: "과학", sessions: 892, color: "#2dd4bf" },
    { name: "영어", sessions: 765, color: "#8b5cf6" },
  ]

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <h3 className="leading-none font-semibold text-lg text-gray-900">과목별 세션</h3>
      </div>
      <div className="px-6">
        <div className="space-y-4 mb-6">
          {deviceData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <span className="text-lg font-bold" style={{ color: item.color }}>
                  {item.sessions.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mini chart area */}
        <div className="h-24 bg-gray-50 rounded relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
            {/* Math line */}
            <path d="M0,45 Q25,40 50,35 T100,30" stroke="#3b82f6" strokeWidth="2" fill="none" />
            {/* Science line */}
            <path d="M0,50 Q25,45 50,42 T100,38" stroke="#2dd4bf" strokeWidth="2" fill="none" />
            {/* English line */}
            <path d="M0,55 Q25,52 50,48 T100,45" stroke="#8b5cf6" strokeWidth="2" fill="none" />
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            <span>40</span>
            <span>45</span>
            <span>50</span>
            <span>55</span>
            <span>60</span>
            <span>65</span>
            <span>70</span>
            <span>75</span>
            <span>80</span>
          </div>
        </div>
      </div>
    </div>
  )
}
