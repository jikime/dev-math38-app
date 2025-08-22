/**
 * API Registry - 중앙집중식 API URL 관리
 * 모든 API 엔드포인트를 한 곳에서 관리합니다.
 */

export const API_REGISTRY = {
  // ===== Main Server API (/m38api) =====
  main: {
    // 통계 관련
    statistics: {
      lectureStat: (lectureId: string | null) => lectureId ? 
        `/m38api/m38/statistics/study/lectureStat?lectureId=${lectureId}` : null,
      userStat: (paperId: string | null) => paperId ? 
        `/m38api/m38/statistics/study/userStat?userStudyPaperId=${paperId}` : null,
      studyStat1: '/m38api/m38/statistics/study/stat1',
      paper: {
        problem: {
          info: '/m38api/m38/statistics/study/paper/problem/info',
        },
      },
    },
    
    // 강좌 관련
    lecture: {
      myLectures: '/m38api/m38/lecture/mylectures',
      get: (id: string) => `/m38api/m38/lecture/${id}`,
      create: '/m38api/m38/lecture',
      update: (id: string) => `/m38api/m38/lecture/${id}`,
      delete: (id: string) => `/m38api/m38/lecture/${id}`,
      userIdList: (lectureId: string) => `/m38api/m38/lecture/userIdList/${lectureId}`,
      students: (lectureId: string | null) => lectureId ? 
        `/m38api/m38/lecture/students/${lectureId}` : null,
      stats: (studentId: string) => 
        `/m38api/v2/m38/lecture/stats/${studentId}`,
      papersByType: (lectureId: string, type: string) => 
        `/m38api/m38/lecture/${lectureId}/paper/bytype/${type}`,
      deletePaper: (lectureId: string, lecturePaperId: string) => 
        `/m38api/m38/lecture/${lectureId}/paper/remove/${lecturePaperId}`,
      addPapers: {
        fromSave: (lectureId: string, saveLectureId: string) => 
          `/m38api/m38/lecture/${lectureId}/papers/add/${saveLectureId}`,
        provided: (lectureId: string) => 
          `/m38api/m38/lecture/${lectureId}/papers/add/provided`,
      },
      workBook: {
        generatePaper: '/m38api/m38/lecture/workBook/paper/generate',
        generateInRangeSkills: '/m38api/m38/lecture/workBook/paper/inRangeSkills/generate',
      },
      restore: (lectureId: string, paperId: string) => 
        `/m38api/m38/lecture/${lectureId}/paper/restore/${paperId}`,
      paper: {
        trash: '/m38api/m38/lecture/paper/trash',
        permanentlyDelete: (paperId: string) => 
          `/m38api/m38/lecture/paper/permanently-delete/${paperId}`,
        emptyTrash: '/m38api/m38/lecture/paper/trash/empty',
        search: (lectureId: string) => `/m38api/v2/m38/lecture/${lectureId}/paper/search`,
      },
    },
    
    // 선생님 관련
    teacher: {
      list: '/m38api/m38/teacher/list',
      all: '/m38api/m38/teacher/all',
      create: '/m38api/m38/teacher/create',
      passwordReset: '/m38api/m38/teacher/passwordReset',
      myImage: (timestamp?: number) => 
        `/m38api/m38/teacher/profile/my-image${timestamp ? `?t=${timestamp}` : ''}`,
      profile: {
        account: '/m38api/account2',
        snsKakao: '/m38api/common/profile/users/sns/kakao',
        upload: '/m38api/common/profile/upload',
        changePassword: '/m38api/common/profile/change-password',
      },
    },
    
    // 학생 관련
    student: {
      list: '/m38api/m38/student/list',
      get: (studentId: string) => `/m38api/m38/student/${studentId}`,
      simpleInfo: (studentId: string) => `/m38api/m38/student/simpleInfo/${studentId}`,
    },
    
    // 학습 관련
    study: {
      lecture: {
        solveCounts: {
          skill: '/m38api/m38/study/lecture/solveCounts/skill',
          papers: '/m38api/m38/study/lecture/solveCounts/papers',
        },
        addon: '/m38api/m38/study/lecture/addon',
      },
      paper: {
        save: '/m38api/m38/study/paper/save',
        get: (paperId: string) => `/m38api/m38/study/paper/get/${paperId}`,
        volist: (lecturePaperId: string | null, type: string | null) => 
          lecturePaperId && type ? 
            `/m38api/m38/study/paper/volist/${lecturePaperId}/${type}` : null,
        reset: (paperAnswerSheetId: string) => 
          `/m38api/m38/study/paper/reset/${paperAnswerSheetId}`,
      },
      student: {
        wrongs: (lectureId: string | null) => lectureId ? 
          `/m38api/m38/study/student/wrongs/${lectureId}` : null,
      },
      skill: {
        wrongs: (lectureId: string, type: string) => `/m38api/m38/study/skill/wrongs/${lectureId}/${type}`,
      },
    },
    
    // 교재 관련
    workBook: {
      list: '/m38api/m38/workBook/list',
      papers: (workBookId: string | null) => workBookId ? 
        `/m38api/m38/workBook/papers/${workBookId}` : null,
      paper: {
        problems: (paperId: string | null) => paperId ?  
          `/m38api/m38/workBook/paper/problems/${paperId}` : null,
      },
    },
    
    // 오류 신고
    errorReport: {
      userReports: (page: number = 0, size: number = 20) => 
        `/m38api/m38/error-report/user-reports?page=${page}&size=${size}`,
      insert: '/m38api/m38/error-report/insert',
      insertWithFiles: '/m38api/m38/error-report/insertWithFiles',
      errorTypes: '/m38api/m38/error-report/error-types',
    },
    
    // 아카데미 분석
    academy: {
      analysis: {
        sessionGrades: {
          paperList: (lectureId: string) => 
            `/m38api/academy/analysis/session-grades/paperlist/${lectureId}`,
          paperGradeStudentCount: (lectureId: string) =>
            `/m38api/academy/analysis/session-grades/paper-grade-student-count/${lectureId}`,
          paperSchoolStudentCount: (lectureId: string) =>
            `/m38api/academy/analysis/session-grades/paper-school-student-count/${lectureId}`,
        },
        lectureTeacher: (lectureId: string) => 
          `/m38api/academy/analysis/lecture-teacher/${lectureId}`,
        analysis: '/m38api/academy/analysis',
      },
    },
    
    // 시험지 관련
    paper: {
      generate: '/m38api/m38/paper/generate',
      save: {
        study: '/m38api/m38/paper/save/study',
        manual: '/m38api/m38/paper/save/manual',
      },
      get: (paperId: string) => `/m38api/m38/paper/${paperId}`,
      study: (paperId: string) => `/m38api/m38/paper/study/${paperId}`,
      manual: {
        get: (paperId: string) => `/m38api/m38/paper/manual/${paperId}`,
        save: (type: string) => `/m38api/m38/paper/manual/save/${type}`,
      },
      add: {
        manual: (lectureId: string, type: string) => `/m38api/m38/paper/${lectureId}/add/manualPaper/${type}`,
        academy: (lectureId: string) => `/m38api/m38/paper/${lectureId}/add/academyPaper`,
      },
      skillCounts: (lectureId: string | null) => lectureId ? 
        `/m38api/m38/paper/skillcounts/${lectureId}` : null,
    },
    
    // SAVE 강좌 관련
    saveLecture: {
      list: '/m38api/m38/savelecture/list',
      create: '/m38api/m38/saveLecture/create',
      delete: (saveLectureId: string) => `/m38api/m38/saveLecture/${saveLectureId}`,
      papers: (saveLectureId: string | null) => saveLectureId ? 
        `/m38api/m38/savelecture/papers/${saveLectureId}` : null,
      save: (lectureId: string) => `/m38api/m38/savelecture/save/${lectureId}`,
    },
    
    // 제공 시험지 관련
    provided: {
      folder: {
        papers: (folderId: string | null) => folderId ? 
          `/m38api/m38/provided/folder/${folderId}/papers` : null,
      },
    },
    
    // 기타 API
    common: {
      lectureByType: (type: string, id: string) => `/m38api/m38/${type}/get/${id}`,
      lastIndexInfo: (type: string, lectureId: string) => `/m38api/m38/${type}/${lectureId}/lastIndex`,
    },
    
    // 유틸리티 API
    util: {
      school: {
        search: '/m38api/util/school/search',
        address: (schoolCode: string) => `/m38api/util/school/address/${schoolCode}`,
      },
    },
    
    // 학교 시험지 검색 API
    school: {
      exam: {
        region: '/m38api/school/exam/region',
        schools: (districtId: number, schoolType: string) => 
          `/m38api/school/exam/district/${districtId}/school/${schoolType}`,
        search: (page: number = 0, size: number = 10) => 
          `/m38api/school/exam/search?page=${page}&size=${size}`,
      },
    },
  },
  
  // ===== App Server API (/appapi) =====
  app: {
    // 과목 관련
    subject: {
      list: '/appapi/subject/subject/list',
      top: (subjectId: number, depth: number = 2) => 
        `/appapi/subject/top?subjectId=${subjectId}&depth=${depth}`,
      tops: (subjectIds: number[], depth: number = 2) => 
        `/appapi/subject/tops?subjectIds=${subjectIds.join(",")}&depth=${depth}`,
      gradeChapters: {
        byDomain: (domain: string) => 
          `/appapi/subject/gradechapters?domain=${domain}`,
      },
    },
    
    // 문제 선택기
    problemSelector: {
      get: (problemId: string | null) => problemId ? `/appapi/problemselector/get/${problemId}` : null,
    },
    
    // 챕터 관련
    chapter: {
      skills: '/appapi/chapter/skills',
      bydomain: '/appapi/subject/chapter/bydomain',
    },
    
    // 스킬 관련
    skill: {
      problems: '/appapi/skill/problems',
      listchapters: '/appapi/skill/listchapters',
      problemsBySkillId: (skillId: string) => `/appapi/skill/${skillId}/problems`,
    },
    
    // 시험지 그룹
    paperGroup: {
      list: (subjectId: number) => 
        `/appapi/papergroup/list/${subjectId}`,
    },
    
    // 과거 시험
    pastExam: {
      get: (fileId: string | null) => fileId ? 
        `/appapi/pastexam/get/${fileId}` : null,
    },
    
    // 시험지 생성
    paper: {
      generate: '/appapi/paper/generate',
      paperGenerate: '/appapi/paper/paper/generate',
      similar: {
        generate: '/appapi/paper/similar/generate',
      },
      change: {
        problem: '/appapi/paper/change/problem',
      },
      generateWithSearchedProblems: '/appapi/paper/paper/generate/withSearchedProblems',
    },
  },
  
  // ===== CMS Server API (/cmsapi) =====
  cms: {
    academy: {
      paperGroup: {
        tree: (subjectId: number) => 
          `/cmsapi/app/academy/papergroup/tree/${subjectId}`,
        paper: (paperId: string) => 
          `/cmsapi/app/academy/papergroup/paper/${paperId}`,
        paperList: (groupId: number) => 
          `/cmsapi/app/academy/papergroup/paper/list/${groupId}`,
      },
    },
    problem: {
      image: (problemId: string) => 
        `/cmsapi/problem/image/${problemId}`,
    },
    paper: {
      pdf: (paperId: string) => 
        `/cmsapi/paper/pdf/${paperId}`,
    },
  },
  
  // ===== Vector Server API (/vectorapi) =====
  vector: {
    problems: {
      search: {
        similar: {
          list: '/vectorapi/v1/problems/search/similar/list',
        },
      },
      vector: (problemId: string) => `/vectorapi/v1/problems/${problemId}/vector`,
    },
    analysis: {
      clusters: '/vectorapi/v1/analysis/clusters',
      distance: (problemId1: string, problemId2: string) => 
        `/vectorapi/v1/analysis/distance/${problemId1}/${problemId2}`,
      quality: (problemId: string) => `/vectorapi/v1/analysis/quality/${problemId}`,
    },
    status: '/vectorapi/v1/status',
    stats: '/vectorapi/v1/stats',
    index: {
      rebuild: '/vectorapi/v1/index/rebuild',
    },
  },
} as const;

// 타입 추출
export type ApiRegistry = typeof API_REGISTRY;

// 서버 타입
export type ApiServer = keyof ApiRegistry;

// URL 빌더 타입
export type UrlBuilder = string | ((...args: any[]) => string);

// Registry 유틸리티
export const ApiRegistryUtils = {
  /**
   * 모든 엔드포인트 목록 반환
   */
  getAllEndpoints(): string[] {
    const endpoints: string[] = [];
    
    const traverse = (obj: any, path: string[] = []): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];
        
        if (typeof value === 'function') {
          endpoints.push(currentPath.join('.'));
        } else if (typeof value === 'string') {
          endpoints.push(`${currentPath.join('.')}: ${value}`);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      });
    };
    
    traverse(API_REGISTRY);
    return endpoints;
  },
  
  /**
   * 키워드로 엔드포인트 검색
   */
  search(keyword: string): string[] {
    return this.getAllEndpoints().filter(endpoint => 
      endpoint.toLowerCase().includes(keyword.toLowerCase())
    );
  },
  
  /**
   * 서버별 엔드포인트 개수
   */
  getStats(): Record<ApiServer, number> {
    const stats: Partial<Record<ApiServer, number>> = {};
    
    Object.keys(API_REGISTRY).forEach((server) => {
      const serverEndpoints = this.getAllEndpoints().filter(ep => 
        ep.startsWith(server)
      );
      stats[server as ApiServer] = serverEndpoints.length;
    });
    
    return stats as Record<ApiServer, number>;
  },
};

// 개발 환경에서 전역 접근 가능
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).apiRegistry = {
    registry: API_REGISTRY,
    utils: ApiRegistryUtils,
  };
  
  console.log('🔍 API Registry 도구: window.apiRegistry로 접근 가능');
  console.log('   - window.apiRegistry.utils.getAllEndpoints()');
  console.log('   - window.apiRegistry.utils.search("lecture")');
  console.log('   - window.apiRegistry.utils.getStats()');
}