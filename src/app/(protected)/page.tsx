"use client"

import { useState } from "react"
import { PeriodSelector } from "@/components/dashboard/period-selector"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ExamPapersChart } from "@/components/dashboard/exam-papers-chart"
import { ProblemUsageChart } from "@/components/dashboard/problem-usage-chart"
import { DBProblemsTable } from "@/components/dashboard/db-problems-table"
import { SettlementAmount } from "@/components/dashboard/settlement-amount"

export default function Dashboard() {
  const currentDate = new Date()
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)

  // 샘플 데이터 - 실제로는 API에서 가져와야 함
  const examPapersData = [
    { date: "2025-07-01", count: 12 },
    { date: "2025-07-02", count: 15 },
    { date: "2025-07-03", count: 10 },
    { date: "2025-07-04", count: 18 },
    { date: "2025-07-05", count: 14 },
    { date: "2025-07-06", count: 16 },
    { date: "2025-07-07", count: 19 },
    { date: "2025-07-08", count: 13 },
    { date: "2025-07-09", count: 17 },
    { date: "2025-07-10", count: 15 },
    { date: "2025-07-11", count: 14 },
    { date: "2025-07-12", count: 11 },
    { date: "2025-07-13", count: 16 },
    { date: "2025-07-14", count: 12 },
    { date: "2025-07-15", count: 18 },
    { date: "2025-07-16", count: 15 },
    { date: "2025-07-17", count: 14 },
    { date: "2025-07-18", count: 10 },
    { date: "2025-07-19", count: 16 },
    { date: "2025-07-20", count: 20 },
    { date: "2025-07-21", count: 18 },
    { date: "2025-07-22", count: 17 },
    { date: "2025-07-23", count: 15 },
    { date: "2025-07-24", count: 13 },
    { date: "2025-07-25", count: 21 },
    { date: "2025-07-26", count: 9 },
    { date: "2025-07-27", count: 15 },
    { date: "2025-07-28", count: 17 },
    { date: "2025-07-29", count: 16 },
    { date: "2025-07-30", count: 19 },
    { date: "2025-07-31", count: 18 },
  ]

  const problemUsageData = [
    { date: "2025-06-30", count: 2500, secondary: 3000 },
    { date: "2025-07-01", count: 2600, secondary: 3200 },
    { date: "2025-07-02", count: 2400, secondary: 3100 },
    { date: "2025-07-03", count: 2300, secondary: 3300 },
    { date: "2025-07-04", count: 2500, secondary: 3400 },
    { date: "2025-07-05", count: 2700, secondary: 3500 },
    { date: "2025-07-06", count: 2800, secondary: 3200 },
    { date: "2025-07-07", count: 3000, secondary: 3600 },
    { date: "2025-07-08", count: 2900, secondary: 3400 },
    { date: "2025-07-09", count: 2600, secondary: 3100 },
    { date: "2025-07-10", count: 2800, secondary: 3300 },
    { date: "2025-07-11", count: 2700, secondary: 3200 },
    { date: "2025-07-12", count: 2500, secondary: 3000 },
    { date: "2025-07-13", count: 2400, secondary: 2900 },
    { date: "2025-07-14", count: 2300, secondary: 2800 },
    { date: "2025-07-15", count: 1800, secondary: 2500 },
    { date: "2025-07-16", count: 2000, secondary: 2700 },
    { date: "2025-07-17", count: 2200, secondary: 2900 },
    { date: "2025-07-18", count: 2500, secondary: 3100 },
    { date: "2025-07-19", count: 3200, secondary: 3800 },
    { date: "2025-07-20", count: 3500, secondary: 4000 },
    { date: "2025-07-21", count: 3800, secondary: 4500 },
    { date: "2025-07-22", count: 4000, secondary: 5000 },
    { date: "2025-07-23", count: 8000, secondary: 10000 },
    { date: "2025-07-24", count: 9500, secondary: 10000 },
    { date: "2025-07-25", count: 9000, secondary: 9500 },
    { date: "2025-07-26", count: 3500, secondary: 4000 },
    { date: "2025-07-27", count: 2500, secondary: 3000 },
    { date: "2025-07-28", count: 2800, secondary: 3200 },
    { date: "2025-07-29", count: 7500, secondary: 8500 },
    { date: "2025-07-30", count: 8000, secondary: 9000 },
  ]

  const dbProblemsData = [
    { date: "07월 01일", dbProblems: 25, usage: 25, amount: "5000원" },
    { date: "07월 02일", dbProblems: 50, usage: 50, amount: "10000원" },
    { date: "07월 03일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 04일", dbProblems: 25, usage: 25, amount: "5000원" },
    { date: "07월 05일", dbProblems: 34, usage: 34, amount: "6800원" },
    { date: "07월 06일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 07일", dbProblems: 125, usage: 125, amount: "25000원" },
    { date: "07월 08일", dbProblems: 33, usage: 33, amount: "6600원" },
    { date: "07월 09일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 10일", dbProblems: 25, usage: 25, amount: "5000원" },
    { date: "07월 11일", dbProblems: 25, usage: 25, amount: "5000원" },
    { date: "07월 12일", dbProblems: 25, usage: 25, amount: "5000원" },
    { date: "07월 13일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 14일", dbProblems: 75, usage: 75, amount: "15000원" },
    { date: "07월 15일", dbProblems: 60, usage: 60, amount: "12000원" },
    { date: "07월 16일", dbProblems: 25, usage: 25, amount: "5000원" },
    { date: "07월 17일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 18일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 19일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 20일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 21일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 22일", dbProblems: 0, usage: 0, amount: "0원" },
    { date: "07월 23일", dbProblems: 55, usage: 55, amount: "11000원" },
  ]

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          학원 관리 대시보드
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          학원 운영 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* 년도/월 선택 */}
      <div className="mb-8">
        <PeriodSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="등록 강사 수"
          value={2}
          maxValue={3}
          subtitle="명"
        />
        <StatsCard
          title="등록 강좌 수"
          value={16}
          subtitle="개 강좌"
        />
        <StatsCard
          title="등록 학생 수"
          value={19}
          maxValue={20}
          subtitle="명"
        />
        <StatsCard
          title="TOTAL DB 문제 수"
          value={3869}
          subtitle="문제"
        />
      </div>

      {/* 차트 및 테이블 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 시험지 출제수 차트 */}
        <ExamPapersChart data={examPapersData} />
        
        {/* 사용 문제수 차트 */}
        <ProblemUsageChart data={problemUsageData} />
      </div>

      {/* DB 문제수 테이블 및 결산 금액 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DB 문제수 테이블 */}
        <DBProblemsTable data={dbProblemsData} />
        
        {/* 결산 금액 */}
        <SettlementAmount
          receivables={100000}
          usageFee={289500}
          dbProblemsFee={0}
        />
      </div>
    </main>
  )
}
