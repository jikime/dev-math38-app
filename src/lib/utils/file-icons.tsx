import { File, FileText, FileSpreadsheet, ImageIcon } from "lucide-react"

export const getFileIcon = (type: string) => {
  switch (type) {
    case "hwp":
      return <File className="w-5 h-5 text-blue-600" />
    case "pdf":
      return <FileText className="w-5 h-5 text-red-600" />
    case "doc":
      return <FileText className="w-5 h-5 text-blue-600" />
    case "xlsx":
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    case "image":
      return <ImageIcon className="w-5 h-5 text-purple-600" />
    default:
      return <File className="w-5 h-5 text-gray-600" />
  }
}