/**
 * Main API Registry
 * Main 서버 전용 API 엔드포인트 정의
 */

export const MAIN_API_REGISTRY = {
  // 통계 관련
  statistics: {
    lectureStat: (lectureId: string | null) => lectureId ?
      `/api/m38/statistics/study/lectureStat?lectureId=${lectureId}` : null,
    userStat: (paperId: string | null) => paperId ?
      `/api/m38/statistics/study/userStat?userStudyPaperId=${paperId}` : null,
    studyStat1: '/api/m38/statistics/study/stat1',
    paper: {
      problem: {
        info: '/api/m38/statistics/study/paper/problem/info',
      },
    },
  },

  // 강좌 관련
  lecture: {
    myLectures: '/api/m38/lecture/mylectures',
    get: (id: string) => `/api/m38/lecture/${id}`,
    create: '/api/m38/lecture',
    update: (id: string) => `/api/m38/lecture/${id}`,
    delete: (id: string) => `/api/m38/lecture/${id}`,
    userIdList: (lectureId: string) => `/api/m38/lecture/userIdList/${lectureId}`,
    students: (lectureId: string | null) => lectureId ?
      `/api/m38/lecture/students/${lectureId}` : null,
    stats: (studentId: string) =>
      `/api/v2/m38/lecture/stats/${studentId}`,
    papersByType: (lectureId: string, type: string) =>
      `/api/m38/lecture/${lectureId}/paper/bytype/${type}`,
    deletePaper: (lectureId: string, lecturePaperId: string) =>
      `/api/m38/lecture/${lectureId}/paper/remove/${lecturePaperId}`,
    addPapers: {
      fromSave: (lectureId: string, saveLectureId: string) =>
        `/api/m38/lecture/${lectureId}/papers/add/${saveLectureId}`,
      provided: (lectureId: string) =>
        `/api/m38/lecture/${lectureId}/papers/add/provided`,
    },
    workBook: {
      generatePaper: '/api/m38/lecture/workBook/paper/generate',
      generateInRangeSkills: '/api/m38/lecture/workBook/paper/inRangeSkills/generate',
    },
    restore: (lectureId: string, paperId: string) =>
      `/api/m38/lecture/${lectureId}/paper/restore/${paperId}`,
    paper: {
      trash: '/api/m38/lecture/paper/trash',
      permanentlyDelete: (paperId: string) =>
        `/api/m38/lecture/paper/permanently-delete/${paperId}`,
      emptyTrash: '/api/m38/lecture/paper/trash/empty',
      search: (lectureId: string) => `/api/v2/m38/lecture/${lectureId}/paper/search`,
    },
  },

  // 선생님 관련
  teacher: {
    list: '/api/m38/teacher/list',
    all: '/api/m38/teacher/all',
    create: '/api/m38/teacher/create',
    passwordReset: '/api/m38/teacher/passwordReset',
    myImage: (timestamp?: number) =>
      `/api/m38/teacher/profile/my-image${timestamp ? `?t=${timestamp}` : ''}`,
    profile: {
      account: '/api/account2',
      snsKakao: '/api/common/profile/users/sns/kakao',
      upload: '/api/common/profile/upload',
      changePassword: '/api/common/profile/change-password',
    },
  },

  // 학생 관련
  student: {
    list: '/api/m38/student/list',
    get: (studentId: string) => `/api/m38/student/${studentId}`,
    simpleInfo: (studentId: string) => `/api/m38/student/simpleInfo/${studentId}`,
  },

  // 학습 관련
  study: {
    lecture: {
      solveCounts: {
        skill: '/api/m38/study/lecture/solveCounts/skill',
        papers: '/api/m38/study/lecture/solveCounts/papers',
      },
      addon: '/api/m38/study/lecture/addon',
    },
    paper: {
      save: '/api/m38/study/paper/save',
      get: (paperId: string) => `/api/m38/study/paper/get/${paperId}`,
      volist: (lecturePaperId: string | null, type: string | null) =>
        lecturePaperId && type ?
          `/api/m38/study/paper/volist/${lecturePaperId}/${type}` : null,
      reset: (paperAnswerSheetId: string) =>
        `/api/m38/study/paper/reset/${paperAnswerSheetId}`,
    },
    student: {
      wrongs: (lectureId: string | null) => lectureId ?
        `/api/m38/study/student/wrongs/${lectureId}` : null,
    },
    skill: {
      wrongs: (lectureId: string, type: string) => `/api/m38/study/skill/wrongs/${lectureId}/${type}`,
    },
  },

  // 교재 관련
  workBook: {
    list: '/api/m38/workBook/list',
    papers: (workBookId: string | null) => workBookId ?
      `/api/m38/workBook/papers/${workBookId}` : null,
    paper: {
      problems: (paperId: string | null) => paperId ?
        `/api/m38/workBook/paper/problems/${paperId}` : null,
    },
  },

  // 오류 신고
  errorReport: {
    userReports: (page: number = 0, size: number = 20) =>
      `/api/m38/error-report/user-reports?page=${page}&size=${size}`,
    insert: '/api/m38/error-report/insert',
    insertWithFiles: '/api/m38/error-report/insertWithFiles',
    errorTypes: '/api/m38/error-report/error-types',
  },

  // 아카데미 분석
  academy: {
    analysis: {
      sessionGrades: {
        paperList: (lectureId: string) =>
          `/api/academy/analysis/session-grades/paperlist/${lectureId}`,
        paperGradeStudentCount: (lectureId: string) =>
          `/api/academy/analysis/session-grades/paper-grade-student-count/${lectureId}`,
        paperSchoolStudentCount: (lectureId: string) =>
          `/api/academy/analysis/session-grades/paper-school-student-count/${lectureId}`,
      },
      lectureTeacher: (lectureId: string) =>
        `/api/academy/analysis/lecture-teacher/${lectureId}`,
      analysis: '/api/academy/analysis',
    },
  },

  // 시험지 관련
  paper: {
    generate: '/api/m38/paper/generate',
    save: {
      study: '/api/m38/paper/save/study',
      manual: '/api/m38/paper/save/manual',
    },
    get: (paperId: string) => `/api/m38/paper/${paperId}`,
    study: (paperId: string) => `/api/m38/paper/study/${paperId}`,
    manual: {
      get: (paperId: string) => `/api/m38/paper/manual/${paperId}`,
      save: (type: string) => `/api/m38/paper/manual/save/${type}`,
    },
    add: {
      manual: (lectureId: string, type: string) => `/api/m38/paper/${lectureId}/add/manualPaper/${type}`,
      academy: (lectureId: string) => `/api/m38/paper/${lectureId}/add/academyPaper`,
    },
    skillCounts: (lectureId: string | null) => lectureId ?
      `/api/m38/paper/skillcounts/${lectureId}` : null,
  },

  // SAVE 강좌 관련
  saveLecture: {
    list: '/api/m38/savelecture/list',
    create: '/api/m38/saveLecture/create',
    delete: (saveLectureId: string) => `/api/m38/saveLecture/${saveLectureId}`,
    papers: (saveLectureId: string | null) => saveLectureId ?
      `/api/m38/savelecture/papers/${saveLectureId}` : null,
    save: (lectureId: string) => `/api/m38/savelecture/save/${lectureId}`,
  },

  // 제공 시험지 관련
  provided: {
    folder: {
      papers: (folderId: string | null) => folderId ?
        `/api/m38/provided/folder/${folderId}/papers` : null,
    },
  },

  // 기타 API
  common: {
    lectureByType: (type: string, id: string) => `/api/m38/${type}/get/${id}`,
    lastIndexInfo: (type: string, lectureId: string) => `/api/m38/${type}/${lectureId}/lastIndex`,
  },

  // 유틸리티 API
  util: {
    school: {
      search: '/api/util/school/search',
      address: (schoolCode: string) => `/api/util/school/address/${schoolCode}`,
    },
  },

  // 학교 시험지 검색 API
  school: {
    exam: {
      region: '/api/school/exam/region',
      schools: (districtId: number, schoolType: string) =>
        `/api/school/exam/district/${districtId}/school/${schoolType}`,
      search: (page: number = 0, size: number = 10) =>
        `/api/school/exam/search?page=${page}&size=${size}`,
    },
  },
} as const;

// 타입 추출
export type MainApiRegistry = typeof MAIN_API_REGISTRY;