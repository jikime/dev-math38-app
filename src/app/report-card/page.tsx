import { Header } from "@/components/header"
import { ReportCard } from "@/components/report-card"

export default function ReportCardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <ReportCard />
      </main>
    </div>
  )
}
