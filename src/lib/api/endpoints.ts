// API 엔드포인트 상수 정의
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    REGISTER: '/auth/register',
  },

  // 학생 관련
  STUDENTS: {
    LIST: '/students',
    DETAIL: (id: string) => `/students/${id}`,
    CREATE: '/students',
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
    PERFORMANCE: (id: string) => `/students/${id}/performance`,
    ATTENDANCE: (id: string) => `/students/${id}/attendance`,
  },

  // 문제 관련
  PROBLEMS: {
    LIST: '/problems',
    DETAIL: (id: string) => `/problems/${id}`,
    CREATE: '/problems',
    UPDATE: (id: string) => `/problems/${id}`,
    DELETE: (id: string) => `/problems/${id}`,
    BY_TEXTBOOK: (textbookId: string) => `/problems/textbook/${textbookId}`,
    SIMILAR: (id: string) => `/problems/${id}/similar`,
    SOLUTION: (id: string) => `/problems/${id}/solution`,
  },

  // 교재 관련
  TEXTBOOKS: {
    LIST: '/textbooks',
    DETAIL: (id: string) => `/textbooks/${id}`,
    CREATE: '/textbooks',
    UPDATE: (id: string) => `/textbooks/${id}`,
    DELETE: (id: string) => `/textbooks/${id}`,
    CHAPTERS: (id: string) => `/textbooks/${id}/chapters`,
    PROBLEMS: (id: string) => `/textbooks/${id}/problems`,
  },

  // 시험 관련
  EXAMS: {
    LIST: '/exams',
    DETAIL: (id: string) => `/exams/${id}`,
    CREATE: '/exams',
    UPDATE: (id: string) => `/exams/${id}`,
    DELETE: (id: string) => `/exams/${id}`,
    SUBMIT: (id: string) => `/exams/${id}/submit`,
    RESULTS: (id: string) => `/exams/${id}/results`,
    STATISTICS: (id: string) => `/exams/${id}/statistics`,
  },

  // 성적표 관련
  REPORT_CARDS: {
    LIST: '/report-cards',
    DETAIL: (id: string) => `/report-cards/${id}`,
    CREATE: '/report-cards',
    UPDATE: (id: string) => `/report-cards/${id}`,
    DELETE: (id: string) => `/report-cards/${id}`,
    BY_STUDENT: (studentId: string) => `/report-cards/student/${studentId}`,
    GENERATE: '/report-cards/generate',
    DOWNLOAD: (id: string) => `/report-cards/${id}/download`,
  },

  // 처방 관련
  PRESCRIPTIONS: {
    LIST: '/prescriptions',
    DETAIL: (id: string) => `/prescriptions/${id}`,
    CREATE: '/prescriptions',
    UPDATE: (id: string) => `/prescriptions/${id}`,
    DELETE: (id: string) => `/prescriptions/${id}`,
    BY_STUDENT: (studentId: string) => `/prescriptions/student/${studentId}`,
    RECOMMEND: '/prescriptions/recommend',
  },

  // 클라우드 저장소 관련
  CLOUD: {
    LIST: '/cloud/files',
    UPLOAD: '/cloud/upload',
    DOWNLOAD: (id: string) => `/cloud/download/${id}`,
    DELETE: (id: string) => `/cloud/files/${id}`,
    SHARE: (id: string) => `/cloud/files/${id}/share`,
    FOLDERS: '/cloud/folders',
    CREATE_FOLDER: '/cloud/folders',
  },

  // 학원 관리 및 통계
  ACADEMY: {
    DASHBOARD: '/academy/dashboard',
    METRICS: '/academy/metrics',
    STATISTICS: '/academy/statistics',
    CLASSES: '/academy/classes',
    CLASS_DETAIL: (id: string) => `/academy/classes/${id}`,
    SCHEDULES: '/academy/schedules',
    ANNOUNCEMENTS: '/academy/announcements',
  },

  // 자료실 관련
  MATERIALS: {
    LIST: '/materials',
    DETAIL: (id: string) => `/materials/${id}`,
    CREATE: '/materials',
    UPDATE: (id: string) => `/materials/${id}`,
    DELETE: (id: string) => `/materials/${id}`,
    DOWNLOAD: (id: string) => `/materials/${id}/download`,
    CATEGORIES: '/materials/categories',
  },

  // 오답 및 유사 문제
  WRONG_ANSWERS: {
    LIST: '/wrong-answers',
    BY_STUDENT: (studentId: string) => `/wrong-answers/student/${studentId}`,
    BY_EXAM: (examId: string) => `/wrong-answers/exam/${examId}`,
    SIMILAR_PROBLEMS: (id: string) => `/wrong-answers/${id}/similar`,
    MARK_RESOLVED: (id: string) => `/wrong-answers/${id}/resolve`,
  },

  // 문제 저장소
  REPOSITORY: {
    PROBLEMS: '/repository/problems',
    PRESCRIPTIONS: '/repository/prescriptions',
    SEARCH: '/repository/search',
    TAGS: '/repository/tags',
    CATEGORIES: '/repository/categories',
    IMPORT: '/repository/import',
    EXPORT: '/repository/export',
    LECTURE_PAPERS: (lectureId: string) => `/api/m38/lecture/${lectureId}/paper/search`,
    MANUAL_PAPER: (paperId: string) => `/api/m38/paper/manual/${paperId}`,
  },
} as const;