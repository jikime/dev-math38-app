import { AcademyMetrics } from "@/components/dashboard/academy-metrics"
import { StudentDistribution } from "@/components/dashboard/student-distribution"
import { PerformanceAcquisition } from "@/components/dashboard/performance-acquisition"
import { ClassSessions } from "@/components/dashboard/class-sessions"
import { TopPerformingSubject } from "@/components/dashboard/top-performing-subject"
import { ConversionMetrics } from "@/components/dashboard/conversion-metrics"
import { DetailedTables } from "@/components/dashboard/detailed-tables"

export default function Dashboard() {
  return (
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">학원 관리 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-300">학원 운영 현황과 학생 성과를 한눈에 확인하세요</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Metrics Chart */}
          <div className="col-span-8">
            <AcademyMetrics />
          </div>

          {/* Student Distribution Pie Chart */}
          <div className="col-span-4">
            <StudentDistribution />
          </div>

          {/* Performance Acquisition */}
          <div className="col-span-4">
            <PerformanceAcquisition />
          </div>

          {/* Class Sessions */}
          <div className="col-span-4">
            <ClassSessions />
          </div>

          {/* Top Performing Subject */}
          <div className="col-span-4">
            <TopPerformingSubject />
          </div>

          {/* Conversion Metrics */}
          <div className="col-span-12">
            <ConversionMetrics />
          </div>

          {/* Detailed Tables */}
          <div className="col-span-12">
            <DetailedTables />
          </div>
        </div>
      </main>
  )
}
