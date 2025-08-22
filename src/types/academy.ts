// 학원 관련 타입 정의

export interface AcademyMetrics {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  totalClasses: number;
  averageAttendanceRate: number;
  averagePerformance: number;
  monthlyRevenue: number;
  monthlyGrowthRate: number;
  studentRetentionRate: number;
  lastUpdated: string;
}

export interface DashboardData {
  metrics: AcademyMetrics;
  recentActivities: Activity[];
  upcomingExams: UpcomingExam[];
  performanceTrends: PerformanceTrend[];
  studentDistribution: StudentDistribution;
  classStatistics: ClassStatistics[];
}

export interface Activity {
  id: string;
  type: 'enrollment' | 'exam' | 'attendance' | 'payment' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

export interface UpcomingExam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  scheduledDate: string;
  enrolledStudents: number;
}

export interface PerformanceTrend {
  date: string;
  averageScore: number;
  studentCount: number;
}

export interface StudentDistribution {
  byGrade: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  bySubject: {
    subject: string;
    count: number;
    percentage: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export interface ClassStatistics {
  classId: string;
  className: string;
  studentCount: number;
  averageScore: number;
  attendanceRate: number;
  topPerformers: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  maxCapacity: number;
  schedule: ClassSchedule[];
  room?: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSchedule {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
}