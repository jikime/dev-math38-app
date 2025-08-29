"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SettlementAmountProps {
  receivables: number // 미수금
  usageFee: number // 사용료
  dbProblemsFee: number // DB문제 수
}

export function SettlementAmount({
  receivables,
  usageFee,
  dbProblemsFee,
}: SettlementAmountProps) {
  const total = receivables + usageFee + dbProblemsFee

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">결산 금액</CardTitle>
        <p className="text-sm text-muted-foreground">
          미수금+사용료+ DB문제 수
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-4xl font-bold text-primary">
            {total.toLocaleString()}원
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">미수금</span>
              <span className="font-medium">{receivables.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">사용료</span>
              <span className="font-medium">{usageFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">DB문제 수</span>
              <span className="font-medium">{dbProblemsFee.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}