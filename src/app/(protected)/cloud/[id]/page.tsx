import { ProblemViewer } from "@/components/cloud/problem-viewer/problem-viewer"
import { Suspense } from "react"

interface Props {
  params: {
    id: string
  }
}

// 로딩 컴포넌트
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">페이지를 불러오는 중...</p>
      </div>
    </div>
  )
}

export default function ProblemViewPage({ params: { id } }: Props) {
  // id는 fileId로 사용
  // 파일명은 ProblemViewer 컴포넌트에서 API를 통해 조회
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProblemViewer 
        fileId={id}
        title="수학 문제집" // 기본 제목, 실제로는 API에서 가져온 제목으로 업데이트됨
      />
    </Suspense>
  )
}

// 메타데이터 생성 (선택사항)
export async function generateMetadata({ params }: Props) {
  // TODO: API에서 파일 정보를 가져와서 메타데이터 생성
  return {
    title: `문제 뷰어 - ${params.id}`,
    description: '수학 문제를 보고 학습할 수 있는 페이지입니다.'
  }
}