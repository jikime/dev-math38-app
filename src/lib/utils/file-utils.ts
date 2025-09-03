// 파일 타입을 파일 확장자에서 추출하는 함수
export const getFileTypeFromPath = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase() || ''
  switch (extension) {
    case 'hwp':
      return 'hwp'
    case 'pdf':
      return 'pdf'
    case 'doc':
    case 'docx':
      return 'doc'
    case 'xls':
    case 'xlsx':
      return 'xlsx'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'image'
    default:
      return 'file'
  }
}

// 파일 타입별 색상 클래스 반환
export const getFileTypeColor = (type: string) => {
  switch (type) {
    case "hwp":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "pdf":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "doc":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "xlsx":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "image":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-muted text-muted-foreground"
  }
}

// 파일 크기를 추정하는 함수 (실제 크기는 API에서 제공되지 않음)
export const getEstimatedFileSize = (pageCount: number, problemCount: number) => {
  // 대략적인 추정치
  const estimatedSizeMB = Math.max(0.5, (pageCount * 0.3) + (problemCount * 0.1))
  return `${estimatedSizeMB.toFixed(1)}MB`
}