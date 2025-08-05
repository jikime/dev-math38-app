import { Header } from "@/components/header"
import { ProblemCreator } from "@/components/problem-creator"

export default function CreateProblemsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProblemCreator />
    </div>
  )
}
