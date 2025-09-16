"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

/**
 * NextAuth SessionProvider 래퍼
 * - 클라이언트 컴포넌트에서 세션 관리
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}