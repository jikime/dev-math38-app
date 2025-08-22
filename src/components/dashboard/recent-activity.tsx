import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, TrendingUp } from "lucide-react"

export function RecentActivity() {
  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-yellow-50 border-yellow-200">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
          <h3 className="leading-none font-semibold text-lg font-semibold">학급 커뮤니티</h3>
          <p className="text-sm text-gray-500">업데이트: 07/29/25 오후 3:45</p>
        </div>
        <div className="px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm">채팅 참여자</span>
            <div className="flex -space-x-2">
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback>이</AvatarFallback>
              </Avatar>
              <Avatar className="w-6 h-6 border-2 border-white">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback>박</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">시장 분석 협업</h3>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">최근 활동</span>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
          <div className="flex items-center justify-between">
            <h3 className="leading-none font-semibold text-lg font-semibold">최근 활동</h3>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-sm text-gray-500">시장 활동 동향 리드</p>
        </div>
        <div className="px-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">오션뷰 아파트 리스팅 게시됨</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">2시간 전</span>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">완료</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">다운타운 로프트 부동산 평가</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">5시간 전</span>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">완료</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
