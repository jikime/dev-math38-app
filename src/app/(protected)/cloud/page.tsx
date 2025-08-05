import { Header } from "@/components/header"
import { CloudStorage } from "@/components/cloud-storage"

export default function CloudPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <CloudStorage />
      </main>
    </div>
  )
}
