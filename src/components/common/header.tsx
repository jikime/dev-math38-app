"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/common/theme-toggle"
import {
  Bell,
  Mail,
  Settings,
  LayoutDashboard,
  Database,
  PenTool,
  FolderOpen,
  Book,
  Target,
  BarChart3,
  Cloud,
  Layers,
  FileCheck,
  User,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const menuItems = [
    { name: "대시보드", href: "/", icon: LayoutDashboard, color: "blue" },
    { name: "저장소", href: "/repository", icon: Database, color: "green" },
    { name: "문제출제", href: "/create-problems", icon: PenTool, color: "orange" },
    { name: "학원 자료", href: "/materials", icon: FolderOpen, color: "teal" },
    { name: "출판교제 유사", href: "/textbooks", icon: Book, color: "pink" },
    { name: "오답+유사", href: "/wrong-similar", icon: Target, color: "purple" },
    { name: "성적표", href: "/report-card", icon: BarChart3, color: "cyan" },
    { name: "수작 클라우드", href: "/cloud", icon: Cloud, color: "indigo" },
    { name: "유형/문제관리", href: "/problem-types", icon: Layers, color: "red" },
    { name: "시험지 관리", href: "/exams", icon: FileCheck, color: "emerald" },
  ]

  const getMenuColor = (color: string, isActive: boolean) => {
    if (!isActive) return "text-gray-600 dark:text-gray-300"

    const colorMap = {
      blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg",
      green: "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg",
      orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg",
      teal: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg",
      pink: "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg",
      cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg",
      indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg",
      red: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg",
      emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg",
    }

    return (
      colorMap[color as keyof typeof colorMap] || "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg"
    )
  }

  return (
    <header className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 p-1">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="수학생각 로고" className="h-10 w-auto object-contain" />
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-2 leading-5 py-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`flex flex-col items-center gap-1 h-auto py-3 px-4 rounded-xl transition-colors duration-200 ${getMenuColor(item.color, isActive)} ${!isActive ? "dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" : ""}`}
                  asChild
                >
                  <a href={item.href}>
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </a>
                </Button>
              )
            })}
          </nav>

          {/* Right Side - Avatar and Settings */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>

            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="선생님" />
                    <AvatarFallback>김</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="선생님" />
                    <AvatarFallback>김</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">김수학 선생님</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">math.teacher@academy.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>프로필</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>설정</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>알림 설정</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>보안</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>도움말</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
