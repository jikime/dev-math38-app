import { Header } from "@/components/header"
import { AcademyMetrics } from "@/components/academy-metrics"
import { StudentDistribution } from "@/components/student-distribution"
import { PerformanceAcquisition } from "@/components/performance-acquisition"
import { ClassSessions } from "@/components/class-sessions"
import { TopPerformingSubject } from "@/components/top-performing-subject"
import { ConversionMetrics } from "@/components/conversion-metrics"
import { DetailedTables } from "@/components/detailed-tables"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
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
    </div>
  )
}
