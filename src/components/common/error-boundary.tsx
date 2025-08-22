"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Academy Management Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div 
          className="academy-card bg-card rounded-xl border p-6 shadow-sm text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white korean-title">
                일시적인 오류가 발생했습니다
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 korean-text max-w-md">
                데이터를 불러오는 중 문제가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => this.setState({ hasError: false })}
                variant="outline"
                size="sm"
                className="korean-text focus-visible-ring"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                다시 시도
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                size="sm"
                className="korean-text focus-visible-ring"
              >
                페이지 새로고침
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-left text-xs">
                <summary className="cursor-pointer text-gray-700 dark:text-gray-300 mb-2">
                  개발자 정보 (개발 환경에서만 표시)
                </summary>
                <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Simplified error fallback for individual components
export function ComponentErrorFallback({ 
  title = "데이터를 불러올 수 없습니다",
  description = "잠시 후 다시 시도해주세요"
}: {
  title?: string
  description?: string
}) {
  return (
    <div 
      className="academy-card bg-card rounded-xl border p-6 shadow-sm text-center"
      role="alert"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-gray-500" aria-hidden="true" />
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white korean-text">
            {title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 korean-text">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}