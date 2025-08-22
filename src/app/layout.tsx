import type React from "react"
import type { Metadata } from "next"
import localFont from 'next/font/local';

import { Inter } from "next/font/google"
import "./globals.css"
import "katex/dist/katex.min.css";
import '@/styles/main.css';
import '@/styles/bogi.scss';
import '@/styles/pagemap.scss';
import '@/styles/paper.scss';
import '@/styles/problem.scss';
import '@/styles/print.css';
import '@/styles/spacingToPx.scss';

import { ThemeProvider } from "@/components/common/theme-provider"
import { QueryProvider } from "@/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "수학생각 학원 관리 시스템",
  description: "학원 운영을 위한 통합 관리 대시보드",
}

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif'
  ]
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${pretendard.variable} ${inter.className}`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
