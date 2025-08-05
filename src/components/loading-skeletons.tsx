// Loading skeleton components for better UX during code splitting
export function MetricsSkeleton() {
  return (
    <div className="academy-card bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-4">
        <div className="skeleton h-6 w-32 mb-2"></div>
        <div className="skeleton h-4 w-48"></div>
      </div>
      <div className="grid grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-4 w-16"></div>
            <div className="skeleton h-8 w-20"></div>
            <div className="skeleton h-4 w-24"></div>
          </div>
        ))}
      </div>
      <div className="skeleton h-64 w-full"></div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="academy-card bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-4">
        <div className="skeleton h-6 w-24 mb-2"></div>
      </div>
      <div className="flex items-center justify-center">
        <div className="skeleton h-48 w-48 rounded-full"></div>
      </div>
      <div className="mt-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="skeleton h-3 w-3 rounded-full"></div>
              <div className="skeleton h-4 w-12"></div>
              <div className="skeleton h-4 w-8"></div>
            </div>
            <div className="skeleton h-4 w-8"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {[...Array(2)].map((_, tableIndex) => (
        <div key={tableIndex} className="academy-card bg-card rounded-xl border p-6 shadow-sm">
          <div className="mb-4">
            <div className="skeleton h-6 w-32 mb-2"></div>
            <div className="skeleton h-4 w-24"></div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 pb-2 border-b">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`col-span-${i === 0 ? '1' : i === 1 ? '5' : '3'}`}>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className={`col-span-${j === 0 ? '1' : j === 1 ? '5' : '3'}`}>
                    <div className="skeleton h-4 w-full"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="academy-card bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-4">
        <div className="skeleton h-5 w-24 mb-2"></div>
        <div className="skeleton h-4 w-32"></div>
      </div>
      <div className="skeleton h-32 w-full mb-4"></div>
      <div className="flex justify-between">
        <div className="skeleton h-4 w-16"></div>
        <div className="skeleton h-4 w-12"></div>
      </div>
    </div>
  )
}