// 학생 관련 타입 정의

export interface Student {
  id: string;
  name: string;
  grade: string; // 학년
  class: string; // 반
  phoneNumber?: string;
  parentPhoneNumber?: string;
  email?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  profileImage?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCreateInput {
  name: string;
  grade: string;
  class: string;
  phoneNumber?: string;
  parentPhoneNumber?: string;
  email?: string;
  enrollmentDate?: string;
  profileImage?: string;
  notes?: string;
}

export interface StudentUpdateInput extends Partial<StudentCreateInput> {
  status?: 'active' | 'inactive' | 'graduated';
}

export interface StudentPerformance {
  studentId: string;
  averageScore: number;
  totalExams: number;
  passedExams: number;
  failedExams: number;
  recentScores: number[];
  subjectPerformance: {
    subject: string;
    averageScore: number;
    trend: 'improving' | 'declining' | 'stable';
  }[];
  weakTopics: string[];
  strongTopics: string[];
  lastUpdated: string;
}

export interface StudentAttendance {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}