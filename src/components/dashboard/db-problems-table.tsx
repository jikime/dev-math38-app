"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DBProblemsTableProps {
  data: Array<{
    date: string
    dbProblems: number
    usage: number
    amount: string
  }>
}

export function DBProblemsTable({ data }: DBProblemsTableProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-medium">DB 문제 수</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">TOTAL</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-left">
            <div className="text-3xl font-bold">
              {data.reduce((sum, item) => sum + item.dbProblems, 0).toLocaleString()}문제
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              {data.reduce((sum, item) => sum + parseInt(item.amount.replace(/[^0-9]/g, '')), 0).toLocaleString()}원
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-350px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">날짜</TableHead>
                <TableHead className="text-xs text-right">DB 문제 수</TableHead>
                <TableHead className="text-xs text-right">사용 금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-xs">{item.date}</TableCell>
                  <TableCell className="text-xs text-right">{item.usage.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right">{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}