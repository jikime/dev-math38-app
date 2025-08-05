import { Header } from "@/components/header"
import { TextbookSimilar } from "@/components/textbook-similar"

export default function TextbooksPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <TextbookSimilar />
    </div>
  )
}
