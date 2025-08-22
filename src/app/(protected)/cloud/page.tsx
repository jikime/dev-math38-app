import { CloudStorage } from "@/components/cloud/cloud-storage"

export default function CloudPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <CloudStorage />
      </div>
    </div>
  )
}
