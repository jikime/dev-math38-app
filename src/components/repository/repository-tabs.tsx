"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProblemRepository } from "@/components/repository/problem-repository"
import { PrescriptionRepository } from "@/components/repository/prescription-repository"
import { FileText, Clipboard } from "lucide-react"

export function RepositoryTabs() {
  const [activeTab, setActiveTab] = useState("problems")

  const tabs = [
    { id: "problems", label: "문제저장소", icon: FileText, component: ProblemRepository },
    { id: "prescriptions", label: "처방저장소", icon: Clipboard, component: PrescriptionRepository },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || ProblemRepository

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Tab Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Tab Navigation - API Documentation Style */}
          <div className="relative w-full">
            {/* Long horizontal line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Tab buttons positioned on the line */}
            <div className="flex items-end gap-2 pb-px">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-all duration-200 flex items-center gap-2 relative
                    ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}

                  {/* Bottom border to hide the line for active tab */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white dark:bg-gray-900"></div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <ActiveComponent />
      </div>
    </div>
  )
}