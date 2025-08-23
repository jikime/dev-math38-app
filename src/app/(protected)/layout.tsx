import type React from "react"

import { Header } from "@/components/common/header"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-6 pt-20">{children}</div>
    </div>
  )
}
