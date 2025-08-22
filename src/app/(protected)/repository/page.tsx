import { ProblemRepository } from "@/components/repository/problem-repository"

export default function RepositoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <ProblemRepository />
      </div>
    </div>
  )
}
